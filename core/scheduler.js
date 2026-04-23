/**
 * @fileoverview Deterministic Scheduler for Decide Engine
 * 
 * This module provides a robust, deterministic scheduling engine for Directed Acyclic Graphs (DAGs).
 * It ensures that execution order remains strictly consistent across multiple runs, even when 
 * parallel execution is enabled. This is achieved by:
 * 1. Topologically sorting nodes into distinct execution layers (dependency levels).
 * 2. Deterministically sorting nodes within each layer using a stable key (e.g., lexicographical node ID).
 * 3. Providing a strict execution environment that respects these layers while maximizing safe concurrency.
 * 
 * Features:
 * - Cycle detection and detailed reporting.
 * - Missing dependency validation.
 * - Topological grouping (Kahn's Algorithm adapted for layers).
 * - Stable sorting within concurrency layers.
 * - Extensible node payloads and execution wrappers.
 * - Browser-native ES6+ implementation (no Node.js specific dependencies).
 * 
 * @module core/scheduler
 * @version 1.0.0
 */

// ============================================================================
// ERROR CLASSES
// ============================================================================

/**
 * Base error class for all Scheduler-related exceptions.
 */
export class SchedulerError extends Error {
    /**
     * @param {string} message - The error message.
     */
    constructor(message) {
        super(message);
        this.name = 'SchedulerError';
        // Maintain V8 stack trace compatibility if available
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SchedulerError);
        }
    }
}

/**
 * Thrown when a cycle is detected in the dependency graph, preventing topological sort.
 */
export class CycleDetectedError extends SchedulerError {
    /**
     * @param {string} message - The error message.
     * @param {string[]} cyclePath - The ordered list of node IDs forming the cycle.
     */
    constructor(message, cyclePath = []) {
        super(`${message} Cycle path: ${cyclePath.join(' -> ')}`);
        this.name = 'CycleDetectedError';
        this.cyclePath = cyclePath;
    }
}

/**
 * Thrown when a node declares a dependency on an ID that does not exist in the graph.
 */
export class MissingDependencyError extends SchedulerError {
    /**
     * @param {string} nodeId - The ID of the node declaring the dependency.
     * @param {string} missingDependencyId - The ID of the missing dependency.
     */
    constructor(nodeId, missingDependencyId) {
        super(`Node '${nodeId}' depends on non-existent node '${missingDependencyId}'.`);
        this.name = 'MissingDependencyError';
        this.nodeId = nodeId;
        this.missingDependencyId = missingDependencyId;
    }
}

/**
 * Thrown when validation fails for node registration or graph building.
 */
export class ValidationError extends SchedulerError {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

// ============================================================================
// CONSTANTS & ENUMS
// ============================================================================

/**
 * Represents the execution state of a node within the scheduler.
 * @enum {string}
 */
export const NodeState = Object.freeze({
    IDLE: 'IDLE',
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    SKIPPED: 'SKIPPED'
});

// ============================================================================
// DATA MODELS
// ============================================================================

/**
 * Represents a single executable unit within the dependency graph.
 */
export class SchedulerNode {
    /**
     * @param {Object} config - Node configuration.
     * @param {string} config.id - Unique identifier for the node.
     * @param {string[]} [config.dependencies=[]] - Array of node IDs this node depends on.
     * @param {Function|any} [config.payload=null] - The actual work or data associated with the node.
     * @param {number} [config.priority=0] - Optional priority for secondary sorting (higher is executed first within same layer).
     * @param {number} [config.timeout=0] - Timeout in milliseconds for execution (0 means infinite).
     * @param {number} [config.retries=0] - Number of times to retry on failure.
     */
    constructor({ id, dependencies = [], payload = null, priority = 0, timeout = 0, retries = 0 }) {
        if (!id || typeof id !== 'string') {
            throw new ValidationError('Node must have a valid string ID.');
        }
        if (!Array.isArray(dependencies)) {
            throw new ValidationError(`Dependencies for node '${id}' must be an array.`);
        }

        this.id = id;
        this.dependencies = Array.from(new Set(dependencies)); // Deduplicate dependencies
        this.payload = payload;
        this.priority = priority;
        this.timeout = timeout;
        this.maxRetries = retries;
        
        // Execution state tracking
        this.state = NodeState.IDLE;
        this.result = null;
        this.error = null;
        this.retryCount = 0;
        this.startTime = null;
        this.endTime = null;
    }

    /**
     * Resets the node's execution state for a fresh run.
     */
    reset() {
        this.state = NodeState.IDLE;
        this.result = null;
        this.error = null;
        this.retryCount = 0;
        this.startTime = null;
        this.endTime = null;
    }

    /**
     * Calculates the execution duration.
     * @returns {number|null} Duration in milliseconds, or null if not completed.
     */
    getDuration() {
        if (this.startTime && this.endTime) {
            return this.endTime - this.startTime;
        }
        return null;
    }
}

/**
 * Represents the final deterministic execution plan.
 */
export class ExecutionPlan {
    /**
     * @param {Array<Array<SchedulerNode>>} layers - Array of node layers.
     */
    constructor(layers) {
        /**
         * @type {Array<Array<SchedulerNode>>}
         * Each sub-array represents a layer of nodes that can be executed in parallel.
         * Layers must be executed sequentially.
         */
        this.layers = layers;
        
        /**
         * @type {number} Total number of nodes in the plan.
         */
        this.totalNodes = layers.reduce((sum, layer) => sum + layer.length, 0);
        
        /**
         * @type {number} Total number of dependency layers (depth of the graph).
         */
        this.depth = layers.length;
    }

    /**
     * Serializes the execution plan to a readable string format.
     * @returns {string} String representation of the plan.
     */
    toString() {
        let output = `Execution Plan (Depth: ${this.depth}, Nodes: ${this.totalNodes})\n`;
        this.layers.forEach((layer, index) => {
            const nodeIds = layer.map(n => n.id).join(', ');
            output += `  Layer ${index + 1}: [ ${nodeIds} ]\n`;
        });
        return output;
    }
}

// ============================================================================
// CORE SCHEDULER
// ============================================================================

/**
 * DeterministicScheduler
 * 
 * Enforces consistent execution order across runs by generating a deterministic
 * execution plan based on topological layers and stable internal sorting.
 */
export class DeterministicScheduler {
    /**
     * @param {Object} [options] - Scheduler configuration options.
     * @param {boolean} [options.allowMissingDependencies=false] - If true, ignores dependencies not present in the graph.
     * @param {boolean} [options.strictCycleDetection=true] - If true, throws immediately on cycles. If false, attempts to break them (not recommended for deterministic behavior).
     */
    constructor(options = {}) {
        this.options = {
            allowMissingDependencies: false,
            strictCycleDetection: true,
            ...options
        };
        
        /** @type {Map<string, SchedulerNode>} */
        this.nodes = new Map();
        
        /** @type {Map<string, string[]>} Adjacency list: Node ID -> Array of Dependent Node IDs (Edges point from dependency to dependent) */
        this.adjacencyList = new Map();
        
        /** @type {Map<string, number>} In-degree map: Node ID -> Number of unresolved dependencies */
        this.inDegree = new Map();
    }

    /**
     * Adds a new node to the scheduler.
     * 
     * @param {Object|SchedulerNode} nodeConfig - Configuration object or SchedulerNode instance.
     * @returns {DeterministicScheduler} Returns this instance for chaining.
     * @throws {ValidationError} If a node with the same ID already exists.
     */
    addNode(nodeConfig) {
        const node = nodeConfig instanceof SchedulerNode ? nodeConfig : new SchedulerNode(nodeConfig);
        
        if (this.nodes.has(node.id)) {
            throw new ValidationError(`Node with ID '${node.id}' already exists in the scheduler.`);
        }
        
        this.nodes.set(node.id, node);
        return this;
    }

    /**
     * Adds multiple nodes to the scheduler.
     * 
     * @param {Array<Object|SchedulerNode>} nodes - Array of node configurations.
     * @returns {DeterministicScheduler}
     */
    addNodes(nodes) {
        if (!Array.isArray(nodes)) {
            throw new ValidationError('addNodes expects an array of node configurations.');
        }
        nodes.forEach(node => this.addNode(node));
        return this;
    }

    /**
     * Removes a node and purges it from other nodes' dependencies.
     * 
     * @param {string} id - The ID of the node to remove.
     * @returns {boolean} True if removed, false if not found.
     */
    removeNode(id) {
        if (!this.nodes.has(id)) return false;
        
        this.nodes.delete(id);
        
        // Purge from other nodes' dependencies
        for (const node of this.nodes.values()) {
            node.dependencies = node.dependencies.filter(depId => depId !== id);
        }
        
        return true;
    }

    /**
     * Clears all nodes from the scheduler.
     */
    clear() {
        this.nodes.clear();
        this.adjacencyList.clear();
        this.inDegree.clear();
    }

    /**
     * Builds the internal graph structures (adjacency list and in-degree map).
     * Validates missing dependencies.
     * @private
     */
    _buildGraph() {
        this.adjacencyList.clear();
        this.inDegree.clear();

        // Initialize structures for all registered nodes
        for (const id of this.nodes.keys()) {
            this.adjacencyList.set(id, []);
            this.inDegree.set(id, 0);
        }

        // Populate edges and calculate in-degrees
        for (const [id, node] of this.nodes.entries()) {
            for (const depId of node.dependencies) {
                if (!this.nodes.has(depId)) {
                    if (!this.options.allowMissingDependencies) {
                        throw new MissingDependencyError(id, depId);
                    }
                    // If allowed, we skip this dependency
                    continue;
                }

                // Directed edge: Dependency -> Dependent
                // Meaning: When `depId` finishes, it unlocks `id`
                this.adjacencyList.get(depId).push(id);
                
                // Increment in-degree of the dependent node
                this.inDegree.set(id, this.inDegree.get(id) + 1);
            }
        }
    }

    /**
     * Detects cycles in the graph using Depth First Search (DFS).
     * Used primarily to extract the exact cycle path when Kahn's algorithm fails.
     * 
     * @private
     * @returns {string[]|null} An array representing the cycle path, or null if no cycle.
     */
    _findCyclePath() {
        const visited = new Set();
        const recursionStack = new Set();
        const parentMap = new Map();

        const dfs = (nodeId) => {
            visited.add(nodeId);
            recursionStack.add(nodeId);

            const dependents = this.adjacencyList.get(nodeId) || [];
            for (const neighbor of dependents) {
                if (!visited.has(neighbor)) {
                    parentMap.set(neighbor, nodeId);
                    const cycle = dfs(neighbor);
                    if (cycle) return cycle;
                } else if (recursionStack.has(neighbor)) {
                    // Cycle detected
                    const cyclePath = [neighbor];
                    let curr = nodeId;
                    while (curr !== neighbor) {
                        cyclePath.push(curr);
                        curr = parentMap.get(curr);
                    }
                    cyclePath.push(neighbor);
                    return cyclePath.reverse();
                }
            }

            recursionStack.delete(nodeId);
            return null;
        };

        for (const nodeId of this.nodes.keys()) {
            if (!visited.has(nodeId)) {
                const cycle = dfs(nodeId);
                if (cycle) return cycle;
            }
        }

        return null;
    }

    /**
     * Generates a deterministic execution plan.
     * 
     * Groups nodes into topological layers. Nodes in the same layer have no dependencies
     * on each other and can be executed in parallel.
     * To guarantee determinism, nodes within each layer are sorted by priority, then lexicographically by ID.
     * 
     * @returns {ExecutionPlan} The computed execution plan.
     * @throws {CycleDetectedError} If a cycle is present in the dependency graph.
     * @throws {MissingDependencyError} If a required dependency is missing and allowMissingDependencies is false.
     */
    createPlan() {
        if (this.nodes.size === 0) {
            return new ExecutionPlan([]);
        }

        this._buildGraph();

        const layers = [];
        let processedCount = 0;

        // Queue for nodes with 0 in-degree (ready to execute)
        let readyQueue = [];

        // Find initial nodes with no dependencies
        for (const [id, degree] of this.inDegree.entries()) {
            if (degree === 0) {
                readyQueue.push(this.nodes.get(id));
            }
        }

        // Kahn's Algorithm adapted for layer-by-layer extraction
        while (readyQueue.length > 0) {
            // Dğindeeterministic Sort: Primary by priority (descending), Secondary by ID (ascending)
            readyQueue.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return b.priority - a.priority; // Higher priority first
                }
                return a.id.localeCompare(b.id); // Lexicographical fallback guarantees stable order
            });

            // The current queue forms a complete execution layer
            const currentLayer = [...readyQueue];
            layers.push(currentLayer);
            processedCount += currentLayer.length;

            // Prepare the queue for the next layer
            const nextQueue = [];

            for (const node of currentLayer) {
                const dependents = this.adjacencyList.get(node.id) || [];
                
                for (const dependentId of dependents) {
                    const currentDegree = this.inDegree.get(dependentId) - 1;
                    this.inDegree.set(dependentId, currentDegree);
                    
                    // If in-degree hits 0, it's ready for the NEXT layer
                    if (currentDegree === 0) {
                        nextQueue.push(this.nodes.get(dependentId));
                    }
                }
            }

            readyQueue = nextQueue;
        }

        // If we haven't processed all nodes, there must be a cycle
        if (processedCount !== this.nodes.size) {
            if (this.options.strictCycleDetection) {
                const cyclePath = this._findCyclePath();
                throw new CycleDetectedError(
                    `Failed to generate plan. Graph contains a cycle preventing ${this.nodes.size - processedCount} nodes from resolving.`,
                    cyclePath || ['Unknown Cycle']
                );
            } else {
                // If not strict, we could attempt to append remaining nodes, 
                // but this violates determinism. We throw anyway as a safety fallback.
                throw new CycleDetectedError('Graph contains a cycle.');
            }
        }

        return new ExecutionPlan(layers);
    }
}

// ============================================================================
// EXECUTION ENGINE
// ============================================================================

/**
 * A robust engine to execute the generated deterministic plan.
 * Supports parallel execution within layers, timeouts, and retries.
 */
export class PlanExecutor {
    /**
     * @param {Object} [options] - Executor configuration.
     * @param {Function} [options.executorFn] - Default async function to execute a node's payload. Signature: async (node) => any
     * @param {boolean} [options.stopOnFailure=true] - If true, aborts the entire plan if any node fails.
     * @param {Object} [options.logger=console] - Logger instance (must support .log, .warn, .error, .info).
     */
    constructor(options = {}) {
        this.options = {
            executorFn: async (node) => {
                if (typeof node.payload === 'function') {
                    return await node.payload();
                }
                return node.payload;
            },
            stopOnFailure: true,
            logger: console,
            ...options
        };
        
        this.logger = this.options.logger;
    }

    /**
     * Executes a single node with timeout and retry logic.
     * 
     * @private
     * @param {SchedulerNode} node - The node to execute.
     * @returns {Promise<any>}
     */
    async _executeNode(node) {
        node.state = NodeState.RUNNING;
        node.startTime = Date.now();
        
        let attempt = 0;
        let lastError = null;
        const maxAttempts = 1 + node.maxRetries;

        while (attempt < maxAttempts) {
            try {
                node.retryCount = attempt;
                
                const executionPromise = this.options.executorFn(node);
                
                // Wrap with timeout if configured
                if (node.timeout > 0) {
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error(`Execution timed out after ${node.timeout}ms`)), node.timeout);
                    });
                    node.result = await Promise.race([executionPromise, timeoutPromise]);
                } else {
                    node.result = await executionPromise;
                }
                
                node.state = NodeState.COMPLETED;
                node.endTime = Date.now();
                return node.result;

            } catch (error) {
                lastError = error;
                attempt++;
                
                if (attempt < maxAttempts) {
                    this.logger.warn(`Node '${node.id}' failed attempt ${attempt}/${maxAttempts}. Retrying... Error: ${error.message}`);
                }
            }
        }

        // If we exhaust retries, mark as failed
        node.state = NodeState.FAILED;
        node.error = lastError;
        node.endTime = Date.now();
        throw lastError;
    }

    /**
     * Executes an entire execution plan layer by layer.
     * Nodes within a layer are executed in parallel.
     * 
     * @param {ExecutionPlan} plan - The deterministic execution plan.
     * @returns {Promise<Object>} Summary of the execution results.
     */
    async execute(plan) {
        if (!(plan instanceof ExecutionPlan)) {
            throw new ValidationError('Invalid execution plan provided.');
        }

        this.logger.info(`Starting execution of plan: ${plan.depth} layers, ${plan.totalNodes} nodes.`);
        
        const startTime = Date.now();
        const results = {
            completed: [],
            failed: [],
            skipped: [],
            totalDuration: 0,
            success: true
        };

        let planAborted = false;

        for (let layerIndex = 0; layerIndex < plan.layers.length; layerIndex++) {
            const layer = plan.layers[layerIndex];
            
            if (planAborted) {
                // If aborted, mark remaining nodes as skipped
                layer.forEach(node => {
                    node.state = NodeState.SKIPPED;
                    results.skipped.push(node.id);
                });
                continue;
            }

            this.logger.info(`Executing Layer ${layerIndex + 1}/${plan.depth} (${layer.length} nodes)`);

            // Execute all nodes in the current layer concurrently
            // Thanks to deterministic sorting in createPlan(), the array order passed to Promise.allSettled is stable.
            const layerPromises = layer.map(node => this._executeNode(node));
            const layerResults = await Promise.allSettled(layerPromises);

            // Process results for the layer
            let layerHasFailure = false;
            
            layerResults.forEach((result, index) => {
                const node = layer[index];
                if (result.status === 'fulfilled') {
                    results.completed.push(node.id);
                    this.logger.info(`[✓] Node '${node.id}' completed in ${node.getDuration()}ms`);
                } else {
                    results.failed.push({ id: node.id, error: result.reason });
                    layerHasFailure = true;
                    this.logger.error(`[✗] Node '${node.id}' failed: ${result.reason.message}`);
                }
            });

            if (layerHasFailure && this.options.stopOnFailure) {
                this.logger.error(`Layer ${layerIndex + 1} experienced failures. Aborting subsequent layers due to stopOnFailure=true.`);
                planAborted = true;
                results.success = false;
            }
        }

        results.totalDuration = Date.now() - startTime;
        this.logger.info(`Execution finished in ${results.totalDuration}ms. Success: ${results.success}. Completed: ${results.completed.length}, Failed: ${results.failed.length}, Skipped: ${results.skipped.length}`);

        return results;
    }
}

// ============================================================================
// HELPER FACTORIES
// ============================================================================

/**
 * Convenience function to quickly schedule and run a set of node configurations.
 * 
 * @param {Array<Object>} nodeConfigs - Array of node configurations.
 * @param {Object} [schedulerOptions] - Options for the DeterministicScheduler.
 * @param {Object} [executorOptions] - Options for the PlanExecutor.
 * @returns {Promise<Object>} The execution results.
 */
export async function runDeterministicGraph(nodeConfigs, schedulerOptions = {}, executorOptions = {}) {
    const scheduler = new DeterministicScheduler(schedulerOptions);
    scheduler.addNodes(nodeConfigs);
    
    const plan = scheduler.createPlan();
    const executor = new PlanExecutor(executorOptions);
    
    return await executor.execute(plan);
}