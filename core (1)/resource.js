/**
 * @fileoverview Decide Engine - Per-Node Resource Governance System
 * @module core/resource
 * @description
 * Provides a robust, browser-native resource governance layer for the Decide Engine.
 * This module enforces time and memory budgets on individual execution nodes,
 * preventing runaway processes, infinite loops (where cooperative), and memory leaks
 * from destabilizing the unified dashboard interface.
 * 
 * Features:
 * - Configurable time budgets per node with automatic AbortController triggering.
 * - Memory allocation tracking (using performance.memory where available).
 * - Historical performance profiling and anomaly detection.
 * - Event-driven architecture for system-wide health monitoring.
 * - Graceful degradation and comprehensive custom error classes.
 */

"use strict";

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

/**
 * Base class for all resource governance related errors.
 * @extends Error
 */
export class ResourceGovernanceError extends Error {
    /**
     * @param {string} message - The error message.
     * @param {string} nodeId - The ID of the node that triggered the error.
     * @param {Object} metrics - Snapshot of metrics at the time of the error.
     */
    constructor(message, nodeId, metrics = {}) {
        super(message);
        this.name = 'ResourceGovernanceError';
        this.nodeId = nodeId;
        this.metrics = metrics;
        this.timestamp = Date.now();
        
        // Maintain V8 stack trace context
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ResourceGovernanceError);
        }
    }
}

/**
 * Error thrown when a node exceeds its allocated time budget.
 * @extends ResourceGovernanceError
 */
export class TimeLimitExceededError extends ResourceGovernanceError {
    constructor(nodeId, allocatedMs, elapsedMs, metrics = {}) {
        super(`Node execution aborted: Exceeded time limit of ${allocatedMs}ms (Elapsed: ${Math.round(elapsedMs)}ms).`, nodeId, metrics);
        this.name = 'TimeLimitExceededError';
        this.allocatedMs = allocatedMs;
        this.elapsedMs = elapsedMs;
    }
}

/**
 * Error thrown when a node exceeds its allocated memory budget.
 * @extends ResourceGovernanceError
 */
export class MemoryLimitExceededError extends ResourceGovernanceError {
    constructor(nodeId, allocatedBytes, usedBytes, metrics = {}) {
        const allocatedMb = (allocatedBytes / 1024 / 1024).toFixed(2);
        const usedMb = (usedBytes / 1024 / 1024).toFixed(2);
        super(`Node execution aborted: Exceeded memory delta limit of ${allocatedMb}MB (Used: ${usedMb}MB).`, nodeId, metrics);
        this.name = 'MemoryLimitExceededError';
        this.allocatedBytes = allocatedBytes;
        this.usedBytes = usedBytes;
    }
}

// ============================================================================
// SYSTEM HEALTH & UTILITIES
// ============================================================================

/**
 * Utility class to interact with browser performance and memory APIs.
 */
class SystemMonitor {
    /**
     * Checks if the browser supports the non-standard performance.memory API (Chrome/Edge/Opera).
     * @returns {boolean}
     */
    static hasMemoryAPI() {
        return typeof performance !== 'undefined' && !!performance.memory;
    }

    /**
     * Gets the current JS heap size in bytes. Returns 0 if unsupported.
     * @returns {number}
     */
    static getUsedJSHeapSize() {
        if (this.hasMemoryAPI()) {
            return performance.memory.usedJSHeapSize;
        }
        return 0;
    }

    /**
     * Returns a high-resolution timestamp.
     * @returns {number}
     */
    static now() {
        return typeof performance !== 'undefined' ? performance.now() : Date.now();
    }
}

// ============================================================================
// EXECUTION TICKET (CONTEXT)
// ============================================================================

/**
 * Represents a single execution lease for a node.
 * Contains the AbortSignal and methods to finalize or forcefully abort the execution.
 */
export class ExecutionTicket {
    /**
     * @param {string} nodeId - Unique identifier for the executing node.
     * @param {Object} config - Configuration limits.
     * @param {number} config.maxTimeMs - Maximum execution time in milliseconds.
     * @param {number} config.maxMemoryBytes - Maximum memory delta allowed in bytes.
     * @param {ResourceGovernor} governor - Reference to the parent governor.
     */
    constructor(nodeId, config, governor) {
        this.nodeId = nodeId;
        this.config = config;
        this.governor = governor;
        
        this.controller = new AbortController();
        this.signal = this.controller.signal;
        
        this.startTime = SystemMonitor.now();
        this.startMemory = SystemMonitor.getUsedJSHeapSize();
        
        this.timerId = null;
        this.isFinished = false;
        this.metrics = {
            durationMs: 0,
            memoryDeltaBytes: 0,
            status: 'running' // 'running', 'completed', 'aborted', 'failed'
        };

        this._initializeLimits();
    }

    /**
     * Sets up the timeout triggers based on configuration.
     * @private
     */
    _initializeLimits() {
        if (this.config.maxTimeMs > 0 && this.config.maxTimeMs !== Infinity) {
            this.timerId = setTimeout(() => {
                this.abort(new TimeLimitExceededError(
                    this.nodeId, 
                    this.config.maxTimeMs, 
                    SystemMonitor.now() - this.startTime,
                    this.snapshotMetrics()
                ));
            }, this.config.maxTimeMs);
        }
    }

    /**
     * Calculates current metrics without stopping execution.
     * @returns {Object} Current metrics snapshot.
     */
    snapshotMetrics() {
        const currentMemory = SystemMonitor.getUsedJSHeapSize();
        return {
            durationMs: SystemMonitor.now() - this.startTime,
            memoryDeltaBytes: currentMemory > 0 && this.startMemory > 0 
                ? currentMemory - this.startMemory 
                : 0,
            status: this.metrics.status
        };
    }

    /**
     * Nodes should call this periodically during heavy synchronous work 
     * to ensure they haven't exceeded memory limits, as setTimeout cannot interrupt
     * a blocked event loop, and memory checks must be cooperative.
     * @throws {ResourceGovernanceError} If limits are exceeded or signal is aborted.
     */
    checkHealth() {
        // 1. Check if already aborted by time or external factors
        this.signal.throwIfAborted();

        // 2. Check memory limits if configured and supported
        if (this.config.maxMemoryBytes > 0 && this.config.maxMemoryBytes !== Infinity) {
            const metrics = this.snapshotMetrics();
            if (metrics.memoryDeltaBytes > this.config.maxMemoryBytes) {
                const error = new MemoryLimitExceededError(
                    this.nodeId,
                    this.config.maxMemoryBytes,
                    metrics.memoryDeltaBytes,
                    metrics
                );
                this.abort(error);
                throw error;
            }
        }
    }

    /**
     * Aborts the execution context with a specific reason.
     * @param {Error|ResourceGovernanceError} reason - The reason for abortion.
     */
    abort(reason) {
        if (this.isFinished) return;
        
        this._cleanup();
        this.metrics = this.snapshotMetrics();
        this.metrics.status = 'aborted';
        
        // Dispatch event via governor
        this.governor.dispatchEvent(new CustomEvent('node-aborted', {
            detail: { nodeId: this.nodeId, reason, metrics: this.metrics }
        }));

        this.controller.abort(reason);
    }

    /**
     * Marks the execution as successfully completed.
     * Must be called by the node runner when the node finishes its work.
     */
    complete() {
        if (this.isFinished) return;
        
        this._cleanup();
        this.metrics = this.snapshotMetrics();
        this.metrics.status = 'completed';

        this.governor.dispatchEvent(new CustomEvent('node-completed', {
            detail: { nodeId: this.nodeId, metrics: this.metrics }
        }));
    }

    /**
     * Marks the execution as failed due to internal node errors (not governance limits).
     * @param {Error} error - The error that caused the failure.
     */
    fail(error) {
        if (this.isFinished) return;
        
        this._cleanup();
        this.metrics = this.snapshotMetrics();
        this.metrics.status = 'failed';

        this.governor.dispatchEvent(new CustomEvent('node-failed', {
            detail: { nodeId: this.nodeId, error, metrics: this.metrics }
        }));
    }

    /**
     * Cleans up internal timers and state.
     * @private
     */
    _cleanup() {
        this.isFinished = true;
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }
}

// ============================================================================
// RESOURCE PROFILER
// ============================================================================

/**
 * Maintains historical execution data to identify degrading performance.
 */
class ResourceProfiler {
    constructor() {
        /** @type {Map<string, Array<Object>>} */
        this.history = new Map();
        this.maxHistoryPerNode = 50;
    }

    /**
     * Records a completed execution's metrics.
     * @param {string} nodeId - The node identifier.
     * @param {Object} metrics - The finalized metrics from the ExecutionTicket.
     */
    record(nodeId, metrics) {
        if (!this.history.has(nodeId)) {
            this.history.set(nodeId, []);
        }
        
        const nodeHistory = this.history.get(nodeId);
        nodeHistory.push({
            timestamp: Date.now(),
            ...metrics
        });

        if (nodeHistory.length > this.maxHistoryPerNode) {
            nodeHistory.shift();
        }
    }

    /**
     * Gets statistical aggregates for a specific node.
     * @param {string} nodeId - The node identifier.
     * @returns {Object|null} Aggregated statistics or null if no history.
     */
    getStats(nodeId) {
        const nodeHistory = this.history.get(nodeId);
        if (!nodeHistory || nodeHistory.length === 0) return null;

        const durations = nodeHistory.map(h => h.durationMs);
        const memoryDeltas = nodeHistory.map(h => h.memoryDeltaBytes);
        
        const sum = (arr) => arr.reduce((a, b) => a + b, 0);
        const avg = (arr) => sum(arr) / arr.length;
        const max = (arr) => Math.max(...arr);

        return {
            executions: nodeHistory.length,
            avgDurationMs: avg(durations),
            maxDurationMs: max(durations),
            avgMemoryDeltaBytes: avg(memoryDeltas),
            maxMemoryDeltaBytes: max(memoryDeltas),
            failureRate: nodeHistory.filter(h => h.status !== 'completed').length / nodeHistory.length
        };
    }
}

// ============================================================================
// RESOURCE GOVERNOR (MAIN ORCHESTRATOR)
// ============================================================================

/**
 * The primary orchestrator for per-node resource governance.
 * Manages global configurations, issues execution tickets, and monitors system health.
 * Extends EventTarget to allow the Decide Engine dashboard to listen for governance events.
 * 
 * Events emitted:
 * - 'node-started': When a node requests execution.
 * - 'node-completed': When a node finishes within limits.
 * - 'node-aborted': When a node is killed by the governor.
 * - 'node-failed': When a node fails internally.
 * - 'system-warning': When global metrics suggest instability.
 */
export class ResourceGovernor extends EventTarget {
    /**
     * @param {Object} options - Global governor configuration.
     * @param {number} [options.defaultMaxTimeMs=5000] - Default max time per node.
     * @param {number} [options.defaultMaxMemoryBytes=52428800] - Default max memory delta (50MB).
     * @param {boolean} [options.enableProfiling=true] - Whether to track historical stats.
     */
    constructor(options = {}) {
        super();
        this.config = {
            defaultMaxTimeMs: options.defaultMaxTimeMs || 5000,
            defaultMaxMemoryBytes: options.defaultMaxMemoryBytes || (50 * 1024 * 1024),
            enableProfiling: options.enableProfiling !== false
        };

        /** @type {Map<string, ExecutionTicket>} */
        this.activeTickets = new Map();
        
        this.profiler = this.config.enableProfiling ? new ResourceProfiler() : null;

        this._setupInternalListeners();
    }

    /**
     * Binds internal listeners to handle profiling and cleanup.
     * @private
     */
    _setupInternalListeners() {
        const handleFinalization = (event) => {
            const { nodeId, metrics } = event.detail;
            this.activeTickets.delete(nodeId);
            if (this.profiler) {
                this.profiler.record(nodeId, metrics);
            }
        };

        this.addEventListener('node-completed', handleFinalization);
        this.addEventListener('node-aborted', handleFinalization);
        this.addEventListener('node-failed', handleFinalization);
    }

    /**
     * Updates the global default limits for the governor.
     * @param {Object} newConfig - Partial configuration object.
     */
    setGlobalLimits(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Requests an execution ticket for a node.
     * This ticket provides the AbortSignal that the node runner MUST respect.
     * 
     * @param {string} nodeId - Unique identifier for the node.
     * @param {Object} [customLimits] - Node-specific overrides for limits.
     * @param {number} [customLimits.maxTimeMs] - Override max execution time.
     * @param {number} [customLimits.maxMemoryBytes] - Override max memory delta.
     * @returns {ExecutionTicket} The execution context ticket.
     * @throws {Error} If the node is already executing.
     */
    requestExecution(nodeId, customLimits = {}) {
        if (this.activeTickets.has(nodeId)) {
            throw new Error(`Governance Violation: Node ${nodeId} is already executing. Concurrent executions of the same node instance are not permitted.`);
        }

        const limits = {
            maxTimeMs: customLimits.maxTimeMs ?? this.config.defaultMaxTimeMs,
            maxMemoryBytes: customLimits.maxMemoryBytes ?? this.config.defaultMaxMemoryBytes
        };

        const ticket = new ExecutionTicket(nodeId, limits, this);
        this.activeTickets.set(nodeId, ticket);

        this.dispatchEvent(new CustomEvent('node-started', {
            detail: { nodeId, limits }
        }));

        return ticket;
    }

    /**
     * High-level wrapper to execute an asynchronous node function under governance.
     * Automatically handles ticket creation, completion, and failure routing.
     * 
     * @param {string} nodeId - Unique identifier for the node.
     * @param {Function} asyncNodeFn - Async function to execute. Receives the `ExecutionTicket` as an argument.
     * @param {Object} [customLimits] - Node-specific overrides.
     * @returns {Promise<any>} The result of the node function.
     * @throws {ResourceGovernanceError} If limits are exceeded.
     * @throws {Error} If the node function throws an internal error.
     * 
     * @example
     * const result = await governor.wrapAsync('node-123', async (ticket) => {
     *     const response = await fetch('...', { signal: ticket.signal });
     *     ticket.checkHealth(); // Optional cooperative sync check
     *     return response.json();
     * }, { maxTimeMs: 10000 });
     */
    async wrapAsync(nodeId, asyncNodeFn, customLimits = {}) {
        const ticket = this.requestExecution(nodeId, customLimits);

        try {
            // Execute the provided function, passing the ticket so it can use the signal
            const result = await asyncNodeFn(ticket);
            
            // If the function completed but the signal was aborted (e.g., race condition),
            // throw the abort reason.
            ticket.signal.throwIfAborted();
            
            ticket.complete();
            return result;

        } catch (error) {
            // Differentiate between governance abortions and standard errors
            if (error.name === 'AbortError' || error instanceof ResourceGovernanceError) {
                // If it's an abort error, ensure the ticket knows it was aborted
                const abortReason = ticket.signal.reason || error;
                ticket.abort(abortReason);
                throw abortReason;
            } else {
                // Standard internal node error
                ticket.fail(error);
                throw error;
            }
        }
    }

    /**
     * Forcefully terminates all currently active node executions.
     * Useful for engine shutdown or emergency panic resets.
     * @param {string} [reason="System panic: Global abort requested"] - The reason for mass termination.
     */
    panic(reason = "System panic: Global abort requested") {
        const error = new ResourceGovernanceError(reason, 'SYSTEM');
        for (const [nodeId, ticket] of this.activeTickets.entries()) {
            ticket.abort(error);
        }
        this.activeTickets.clear();
        
        this.dispatchEvent(new CustomEvent('system-panic', {
            detail: { reason, timestamp: Date.now() }
        }));
    }

    /**
     * Retrieves the historical statistics for a specific node.
     * @param {string} nodeId - The node identifier.
     * @returns {Object|null} Node statistics, or null if profiling is disabled/no history.
     */
    getNodeStats(nodeId) {
        if (!this.profiler) return null;
        return this.profiler.getStats(nodeId);
    }

    /**
     * Retrieves a snapshot of all currently active executions.
     * @returns {Array<Object>} List of active nodes and their current metrics.
     */
    getActiveExecutions() {
        const active = [];
        for (const [nodeId, ticket] of this.activeTickets.entries()) {
            active.push({
                nodeId,
                limits: ticket.config,
                currentMetrics: ticket.snapshotMetrics()
            });
        }
        return active;
    }
}

// ============================================================================
// SINGLETON EXPORT FOR UNIFIED DASHBOARD USAGE
// ============================================================================

/**
 * Shared, global instance of the ResourceGovernor tailored for the Decide Engine Dashboard.
 * Initialized with safe defaults for browser-native execution.
 * @type {ResourceGovernor}
 */
export const engineGovernor = new ResourceGovernor({
    defaultMaxTimeMs: 15000, // 15 seconds max for standard nodes to prevent UI lockup
    defaultMaxMemoryBytes: 100 * 1024 * 1024, // 100MB delta per node
    enableProfiling: true
});