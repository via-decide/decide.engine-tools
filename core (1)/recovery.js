/**
 * @fileoverview Decide Engine - Core Recovery & Node Isolation Subsystem
 * @module core/recovery
 * @description Provides robust node-level retry isolation, partial execution recovery,
 * circuit breaking, and checkpointing. Prevents full graph execution collapse from 
 * individual tool/node failures and enables resuming from the last successful state.
 * Designed for both browser-native and Node.js environments.
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Represents the lifecycle state of a node's execution within the graph.
 * @readonly
 * @enum {string}
 */
const NodeState = Object.freeze({
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    RETRYING: 'RETRYING',
    SKIPPED: 'SKIPPED',
    CIRCUIT_OPEN: 'CIRCUIT_OPEN'
});

/**
 * Supported backoff strategies for retry policies.
 * @readonly
 * @enum {string}
 */
const BackoffStrategy = Object.freeze({
    LINEAR: 'LINEAR',
    EXPONENTIAL: 'EXPONENTIAL',
    CONSTANT: 'CONSTANT',
    FIBONACCI: 'FIBONACCI'
});

/**
 * Default configuration for retry policies if none is provided.
 */
const DEFAULT_RETRY_POLICY = Object.freeze({
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
    strategy: BackoffStrategy.EXPONENTIAL,
    useJitter: true,
    timeoutMs: 30000,
    retryableErrors: ['NetworkError', 'TimeoutError', 'RateLimitError', 'TemporaryFailure']
});

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

/**
 * Base class for recovery-related errors.
 * @extends Error
 */
class RecoverySystemError extends Error {
    /**
     * @param {string} message 
     * @param {string} nodeId 
     * @param {Object} [details={}]
     */
    constructor(message, nodeId, details = {}) {
        super(message);
        this.name = this.constructor.name;
        this.nodeId = nodeId;
        this.details = details;
        this.timestamp = Date.now();
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when a node exceeds its maximum retry attempts.
 */
class MaxRetriesExceededError extends RecoverySystemError {
    constructor(nodeId, attempts, lastError) {
        super(`Node ${nodeId} failed after ${attempts} attempts.`, nodeId, { attempts, lastError });
    }
}

/**
 * Thrown when a node execution times out.
 */
class NodeTimeoutError extends RecoverySystemError {
    constructor(nodeId, timeoutMs) {
        super(`Node ${nodeId} execution timed out after ${timeoutMs}ms.`, nodeId, { timeoutMs });
    }
}

/**
 * Thrown when attempting to execute a node while its circuit breaker is open.
 */
class CircuitOpenError extends RecoverySystemError {
    constructor(nodeId, resetTimeoutMs) {
        super(`Circuit is open for node ${nodeId}. Execution blocked.`, nodeId, { resetTimeoutMs });
    }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Promisified delay for non-blocking wait periods.
 * @param {number} ms - Milliseconds to delay.
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a random jitter value to prevent thundering herd problems.
 * @param {number} baseValue - The calculated delay before jitter.
 * @param {number} [jitterFactor=0.2] - Percentage of jitter (0.0 to 1.0).
 * @returns {number} Delay with applied jitter.
 */
const applyJitter = (baseValue, jitterFactor = 0.2) => {
    const jitterAmount = baseValue * jitterFactor;
    const min = baseValue - jitterAmount;
    const max = baseValue + jitterAmount;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculates the delay for the next retry attempt based on the chosen strategy.
 * @param {number} attempt - Current attempt number (1-indexed).
 * @param {Object} policy - Retry policy configuration.
 * @returns {number} Delay in milliseconds.
 */
const calculateBackoff = (attempt, policy) => {
    let delayMs = policy.baseDelayMs;

    switch (policy.strategy) {
        case BackoffStrategy.LINEAR:
            delayMs = policy.baseDelayMs * attempt;
            break;
        case BackoffStrategy.EXPONENTIAL:
            delayMs = policy.baseDelayMs * Math.pow(2, attempt - 1);
            break;
        case BackoffStrategy.FIBONACCI:
            const fib = (n) => n <= 1 ? n : fib(n - 1) + fib(n - 2);
            delayMs = policy.baseDelayMs * fib(attempt + 1);
            break;
        case BackoffStrategy.CONSTANT:
        default:
            delayMs = policy.baseDelayMs;
            break;
    }

    if (policy.useJitter) {
        delayMs = applyJitter(delayMs);
    }

    return Math.min(delayMs, policy.maxDelayMs);
};

// ============================================================================
// CHECKPOINT & STATE MANAGEMENT
// ============================================================================

/**
 * Represents the execution state and history of a single node.
 */
class NodeRecord {
    /**
     * @param {string} nodeId - Unique identifier for the node.
     */
    constructor(nodeId) {
        this.nodeId = nodeId;
        this.state = NodeState.PENDING;
        this.attempts = 0;
        this.history = [];
        this.result = null;
        this.error = null;
        this.startTime = null;
        this.endTime = null;
        this.lastRecoveredAt = null;
    }

    /**
     * Updates the node's state and records the transition in history.
     * @param {string} newState - The new NodeState.
     * @param {Object} [metadata={}] - Additional context for the state change.
     */
    transition(newState, metadata = {}) {
        const timestamp = Date.now();
        this.history.push({
            from: this.state,
            to: newState,
            timestamp,
            ...metadata
        });
        this.state = newState;
        
        if (newState === NodeState.RUNNING && !this.startTime) {
            this.startTime = timestamp;
        }
        if ([NodeState.COMPLETED, NodeState.FAILED, NodeState.SKIPPED].includes(newState)) {
            this.endTime = timestamp;
        }
    }

    /**
     * Serializes the node record for storage.
     * @returns {Object}
     */
    toJSON() {
        return {
            nodeId: this.nodeId,
            state: this.state,
            attempts: this.attempts,
            history: this.history,
            result: this.result,
            error: this.error ? { message: this.error.message, name: this.error.name, stack: this.error.stack } : null,
            startTime: this.startTime,
            endTime: this.endTime,
            lastRecoveredAt: this.lastRecoveredAt
        };
    }

    /**
     * Deserializes a node record from storage.
     * @param {Object} data - Serialized node data.
     * @returns {NodeRecord}
     */
    static fromJSON(data) {
        const record = new NodeRecord(data.nodeId);
        Object.assign(record, data);
        if (data.error) {
            const err = new Error(data.error.message);
            err.name = data.error.name;
            err.stack = data.error.stack;
            record.error = err;
        }
        return record;
    }
}

/**
 * Interface/Implementation for storing graph execution state.
 * Allows partial execution recovery across browser reloads or process restarts.
 */
class CheckpointStore {
    constructor(storageKeyPrefix = 'decide_engine_graph_') {
        this.prefix = storageKeyPrefix;
        // In-memory fallback if no persistent storage is available
        this.memoryStore = new Map();
        this.isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }

    /**
     * Saves the current snapshot of a graph's execution.
     * @param {string} graphId 
     * @param {Object} snapshot 
     */
    async save(graphId, snapshot) {
        const key = `${this.prefix}${graphId}`;
        const serialized = JSON.stringify(snapshot);
        
        this.memoryStore.set(key, serialized);
        
        if (this.isBrowser) {
            try {
                window.localStorage.setItem(key, serialized);
            } catch (e) {
                console.warn(`[CheckpointStore] Failed to write to localStorage for ${graphId}:`, e);
            }
        }
    }

    /**
     * Loads the last saved snapshot for a graph.
     * @param {string} graphId 
     * @returns {Promise<Object|null>}
     */
    async load(graphId) {
        const key = `${this.prefix}${graphId}`;
        let serialized = null;

        if (this.isBrowser) {
            try {
                serialized = window.localStorage.getItem(key);
            } catch (e) {
                console.warn(`[CheckpointStore] Failed to read from localStorage for ${graphId}:`, e);
            }
        }

        if (!serialized) {
            serialized = this.memoryStore.get(key);
        }

        return serialized ? JSON.parse(serialized) : null;
    }

    /**
     * Clears a graph's checkpoint data.
     * @param {string} graphId 
     */
    async clear(graphId) {
        const key = `${this.prefix}${graphId}`;
        this.memoryStore.delete(key);
        if (this.isBrowser) {
            try {
                window.localStorage.removeItem(key);
            } catch (e) {
                console.warn(`[CheckpointStore] Failed to clear localStorage for ${graphId}:`, e);
            }
        }
    }
}

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

/**
 * Circuit Breaker pattern implementation to prevent cascading failures
 * when a node or its underlying tool is consistently failing.
 */
class CircuitBreaker {
    /**
     * @param {Object} options
     * @param {number} options.failureThreshold - Number of consecutive failures before opening.
     * @param {number} options.resetTimeoutMs - Time to wait before attempting half-open state.
     */
    constructor({ failureThreshold = 5, resetTimeoutMs = 60000 } = {}) {
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
        this.failures = new Map(); // nodeId -> consecutive failure count
        this.openCircuits = new Map(); // nodeId -> timestamp when circuit opens
    }

    /**
     * Checks if execution is allowed for a given node.
     * @param {string} nodeId 
     * @throws {CircuitOpenError} If the circuit is currently open.
     */
    check(nodeId) {
        if (this.openCircuits.has(nodeId)) {
            const openedAt = this.openCircuits.get(nodeId);
            const now = Date.now();
            
            if (now - openedAt > this.resetTimeoutMs) {
                // Half-open state: allow one attempt
                this.openCircuits.delete(nodeId);
            } else {
                throw new CircuitOpenError(nodeId, this.resetTimeoutMs - (now - openedAt));
            }
        }
    }

    /**
     * Records a successful execution, resetting failure counts.
     * @param {string} nodeId 
     */
    recordSuccess(nodeId) {
        this.failures.delete(nodeId);
        this.openCircuits.delete(nodeId);
    }

    /**
     * Records a failure, potentially opening the circuit.
     * @param {string} nodeId 
     */
    recordFailure(nodeId) {
        const currentFailures = (this.failures.get(nodeId) || 0) + 1;
        this.failures.set(nodeId, currentFailures);

        if (currentFailures >= this.failureThreshold) {
            this.openCircuits.set(nodeId, Date.now());
            console.warn(`[CircuitBreaker] Circuit OPENED for node ${nodeId} after ${currentFailures} failures.`);
        }
    }
}

// ============================================================================
// CORE RECOVERY MANAGER
// ============================================================================

/**
 * Orchestrates node execution, isolation, retry policies, and state recovery.
 * Acts as the safety net for the graph execution engine.
 */
class RecoveryManager {
    /**
     * @param {Object} config
     * @param {CheckpointStore} [config.store] - Custom checkpoint store.
     * @param {Object} [config.globalRetryPolicy] - Overrides for default retry policy.
     * @param {Object} [config.circuitBreakerOpts] - Options for the circuit breaker.
     */
    constructor(config = {}) {
        this.store = config.store || new CheckpointStore();
        this.globalRetryPolicy = { ...DEFAULT_RETRY_POLICY, ...config.globalRetryPolicy };
        this.circuitBreaker = new CircuitBreaker(config.circuitBreakerOpts);
        
        // Active graph states: graphId -> Map<nodeId, NodeRecord>
        this.activeGraphs = new Map();
        
        // Event listeners for observability (simple pub/sub)
        this.listeners = new Set();
    }

    /**
     * Subscribe to recovery events (retries, failures, recoveries).
     * @param {Function} callback 
     * @returns {Function} Unsubscribe function.
     */
    onEvent(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    /**
     * Emits an internal event to all registered listeners.
     * @private
     * @param {string} eventType 
     * @param {Object} payload 
     */
    _emit(eventType, payload) {
        for (const listener of this.listeners) {
            try {
                listener({ type: eventType, timestamp: Date.now(), ...payload });
            } catch (e) {
                console.error('[RecoveryManager] Error in event listener:', e);
            }
        }
    }

    /**
     * Initializes or recovers the state of a graph execution.
     * @param {string} graphId - Unique graph identifier.
     * @param {Array<string>} nodeIds - All node IDs in the graph.
     * @returns {Promise<Map<string, NodeRecord>>} The recovered or initialized state map.
     */
    async initializeGraph(graphId, nodeIds) {
        let stateMap = new Map();
        const snapshot = await this.store.load(graphId);

        if (snapshot && snapshot.nodes) {
            this._emit('GRAPH_RECOVERED', { graphId, nodeCount: snapshot.nodes.length });
            snapshot.nodes.forEach(nodeData => {
                const record = NodeRecord.fromJSON(nodeData);
                // If a node was RUNNING or RETRYING when the system crashed, reset to PENDING
                if (record.state === NodeState.RUNNING || record.state === NodeState.RETRYING) {
                    record.transition(NodeState.PENDING, { reason: 'System recovery reset' });
                    record.lastRecoveredAt = Date.now();
                }
                stateMap.set(record.nodeId, record);
            });
        }

        // Ensure all current nodes exist in the state map
        nodeIds.forEach(id => {
            if (!stateMap.has(id)) {
                stateMap.set(id, new NodeRecord(id));
            }
        });

        this.activeGraphs.set(graphId, stateMap);
        await this.checkpoint(graphId);
        return stateMap;
    }

    /**
     * Persists the current state of a graph to the checkpoint store.
     * @param {string} graphId 
     */
    async checkpoint(graphId) {
        const stateMap = this.activeGraphs.get(graphId);
        if (!stateMap) return;

        const nodes = Array.from(stateMap.values()).map(record => record.toJSON());
        await this.store.save(graphId, {
            graphId,
            timestamp: Date.now(),
            nodes
        });
        this._emit('CHECKPOINT_SAVED', { graphId });
    }

    /**
     * Determines if an error is considered retryable based on policy.
     * @private
     * @param {Error} error 
     * @param {Object} policy 
     * @returns {boolean}
     */
    _isRetryableError(error, policy) {
        if (!policy.retryableErrors || policy.retryableErrors.length === 0) return true; // Retry all if not specified
        return policy.retryableErrors.some(errName => 
            error.name === errName || error.message.includes(errName)
        );
    }

    /**
     * Executes a single node with complete isolation, timeout, and retry logic.
     * This wrapper prevents individual node failures from crashing the main thread.
     * 
     * @param {string} graphId - The ID of the graph.
     * @param {string} nodeId - The ID of the node to execute.
     * @param {Function} taskFn - The async function representing the node's workload.
     * @param {Object} [customPolicy] - Node-specific retry policy overrides.
     * @returns {Promise<any>} The result of the task function.
     * @throws {Error} Throws only if all retries fail or an unrecoverable error occurs.
     */
    async executeIsolatedNode(graphId, nodeId, taskFn, customPolicy = {}) {
        const stateMap = this.activeGraphs.get(graphId);
        if (!stateMap) throw new Error(`Graph ${graphId} not initialized in RecoveryManager.`);

        const record = stateMap.get(nodeId) || new NodeRecord(nodeId);
        if (!stateMap.has(nodeId)) stateMap.set(nodeId, record);

        // If node already completed successfully in a previous run (recovery), skip execution
        if (record.state === NodeState.COMPLETED && record.result !== null) {
            this._emit('NODE_SKIPPED_ALREADY_COMPLETED', { graphId, nodeId });
            return record.result;
        }

        const policy = { ...this.globalRetryPolicy, ...customPolicy };

        try {
            // Check circuit breaker before attempting
            this.circuitBreaker.check(nodeId);
        } catch (cbError) {
            record.transition(NodeState.CIRCUIT_OPEN, { error: cbError.message });
            record.error = cbError;
            await this.checkpoint(graphId);
            this._emit('NODE_BLOCKED_CIRCUIT_OPEN', { graphId, nodeId, error: cbError });
            throw cbError;
        }

        record.transition(NodeState.RUNNING);
        await this.checkpoint(graphId);

        let lastError = null;

        while (record.attempts < policy.maxAttempts) {
            record.attempts++;
            this._emit('NODE_ATTEMPT_START', { graphId, nodeId, attempt: record.attempts });

            try {
                // Execute with timeout
                const result = await Promise.race([
                    taskFn(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new NodeTimeoutError(nodeId, policy.timeoutMs)), policy.timeoutMs)
                    )
                ]);

                // Success path
                this.circuitBreaker.recordSuccess(nodeId);
                record.result = result;
                record.error = null;
                record.transition(NodeState.COMPLETED);
                await this.checkpoint(graphId);
                
                this._emit('NODE_COMPLETED', { graphId, nodeId, attempt: record.attempts });
                return result;

            } catch (error) {
                lastError = error;
                this.circuitBreaker.recordFailure(nodeId);
                
                this._emit('NODE_ATTEMPT_FAILED', { 
                    graphId, 
                    nodeId, 
                    attempt: record.attempts, 
                    error: error.message 
                });

                const isRetryable = this._isRetryableError(error, policy);
                const isFinalAttempt = record.attempts >= policy.maxAttempts;

                if (!isRetryable || isFinalAttempt) {
                    break; // Exit retry loop
                }

                // Prepare for retry
                record.transition(NodeState.RETRYING, { attempt: record.attempts, error: error.message });
                await this.checkpoint(graphId);
                
                const delayMs = calculateBackoff(record.attempts, policy);
                this._emit('NODE_BACKOFF', { graphId, nodeId, delayMs });
                await delay(delayMs);
                
                record.transition(NodeState.RUNNING, { reason: 'Retrying after backoff' });
            }
        }

        // Exhausted retries or encountered unretryable error
        record.error = lastError;
        record.transition(NodeState.FAILED, { 
            attempts: record.attempts, 
            finalError: lastError.message 
        });
        await this.checkpoint(graphId);
        
        this._emit('NODE_FAILED_FINAL', { graphId, nodeId, error: lastError });

        // Throw a specific recovery error to let the graph engine decide if it should halt
        throw new MaxRetriesExceededError(nodeId, record.attempts, lastError);
    }

    /**
     * Cleans up graph state from memory and storage upon successful completion of the entire graph.
     * @param {string} graphId 
     */
    async finalizeGraph(graphId) {
        this.activeGraphs.delete(graphId);
        await this.store.clear(graphId);
        this._emit('GRAPH_FINALIZED', { graphId });
    }

    /**
     * Gets the current execution status of a specific node.
     * @param {string} graphId 
     * @param {string} nodeId 
     * @returns {NodeRecord|null}
     */
    getNodeState(graphId, nodeId) {
        const stateMap = this.activeGraphs.get(graphId);
        return stateMap ? (stateMap.get(nodeId) || null) : null;
    }

    /**
     * Utility to manually mark a node as skipped (e.g., if a dependency failed but graph continues).
     * @param {string} graphId 
     * @param {string} nodeId 
     * @param {string} reason 
     */
    async skipNode(graphId, nodeId, reason = 'Dependency failed') {
        const stateMap = this.activeGraphs.get(graphId);
        if (!stateMap) return;

        const record = stateMap.get(nodeId) || new NodeRecord(nodeId);
        if (!stateMap.has(nodeId)) stateMap.set(nodeId, record);

        record.transition(NodeState.SKIPPED, { reason });
        await this.checkpoint(graphId);
        this._emit('NODE_SKIPPED', { graphId, nodeId, reason });
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    NodeState,
    BackoffStrategy,
    DEFAULT_RETRY_POLICY,
    RecoverySystemError,
    MaxRetriesExceededError,
    NodeTimeoutError,
    CircuitOpenError,
    NodeRecord,
    CheckpointStore,
    CircuitBreaker,
    RecoveryManager
};