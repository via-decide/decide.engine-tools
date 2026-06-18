/**
 * @fileoverview Decide Engine Core - Dependency Graph Validations and Execution Ordering
 * @module core/graph
 * @description Provides a robust, browser-native dependency graph implementation for the Decide Engine.
 * This module ensures tools and actions execute in the correct deterministic sequence,
 * preventing invalid flows, detecting circular dependencies, and enabling parallel execution
 * of independent graph branches.
 * 
 * Features:
 * - Directed Acyclic Graph (DAG) construction and validation.
 * - Circular dependency detection (DFS coloring algorithm).
 * - Topological sorting for deterministic sequential execution.
 * - Layered batching for optimized parallel execution.
 * - Built-in execution engine with state tracking, retries, and timeouts.
 * - Event-driven architecture extending EventTarget for UI updates.
 * 
 * @version 3.0.0-beast
 * @author ViaDecide Antigravity Synthesis Orchestrator
 */

"use strict";

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

/**
 * Base error class for all Graph-related exceptions.
 * @extends Error
 */
export class GraphError extends Error {
    /**
     * @param {string} message - The error message.
     */
    constructor(message) {
        super(message);
        this.name = "GraphError";
        // Maintain V8 stack trace compatibility if available
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GraphError);
        }
    }
}

/**
 * Thrown when a circular dependency (cycle) is detected in the graph.
 * @extends GraphError
 */
export class CircularDependencyError extends GraphError {
    /**
     * @param {string[]} cyclePath - Array of node IDs forming the cycle.
     */
    constructor(cyclePath) {
        super(`Circular dependency detected: ${cyclePath.join(' -> ')}`);
        this.name = "CircularDependencyError";
        this.cyclePath = cyclePath;
    }
}

/**
 * Thrown when attempting to interact with a node that does not exist.
 * @extends GraphError
 */
export class NodeNotFoundError extends GraphError {
    /**
     * @param {string} nodeId - The ID of the missing node.
     */
    constructor(nodeId) {
        super(`Node not found in graph: ${nodeId}`);
        this.name = "NodeNotFoundError";
        this.nodeId = nodeId;
    }
}

/**
 * Thrown when graph validation fails prior to execution.
 * @extends GraphError
 */
export class GraphValidationError extends GraphError {
    /**
     * @param {string} message - The validation error message.
     * @param {Array<string>} details - Specific validation failure details.
     */
    constructor(message, details = []) {
        super(message);
        this.name = "GraphValidationError";
        this.details = details;
    }
}

/**
 * Thrown when a specific node fails to execute.
 * @extends GraphError
 */
export class NodeExecutionError extends GraphError {
    /**
     * @param {string} nodeId - The ID of the node that failed.
     * @param {Error} originalError - The underlying error thrown by the node's task.
     */
    constructor(nodeId, originalError) {
        super(`Execution failed for node [${nodeId}]: ${originalError.message}`);
        this.name = "NodeExecutionError";
        this.nodeId = nodeId;
        this.originalError = originalError;
    }
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Enum for Graph Node Execution States.
 * @readonly
 * @enum {string}
 */
export const NodeState = Object.freeze({
    IDLE: 'IDLE',
    WAITING: 'WAITING',
    RUNNING: 'RUNNING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    SKIPPED: 'SKIPPED'
});

// ============================================================================
// CORE CLASSES
// ============================================================================

/**
 * Represents a single executable tool or action within the dependency graph.
 */
export class GraphNode {
    /**
     * @typedef {Object} NodeConfig
     * @property {string} name - Human-readable name of the tool/action.
     * @property {Function} task - Async function to execute. Signature: `async (inputs, context) => result`
     * @property {number} [timeout=0] - Execution timeout in milliseconds. 0 disables timeout.
     * @property {number} [retries=0] - Number of times to retry on failure.
     * @property {boolean} [optional=false] - If true, failure won't halt dependent nodes (they receive null/undefined).
     * @property {Object} [metadata={}] - Arbitrary metadata for UI or external systems.
     */

    /**
     * @param {string} id - Unique identifier for the node.
     * @param {NodeConfig} config - Configuration object for the node.
     */
    constructor(id, config) {
        if (!id || typeof id !== 'string') {
            throw new GraphError("Node ID must be a non-empty string.");
        }
        if (typeof config.task !== 'function') {
            throw new GraphError(`Node [${id}] must have a valid 'task' function.`);
        }

        this.id = id;
        this.name = config.name || id;
        this.task = config.task;
        this.timeout = typeof config.timeout === 'number' ? config.timeout : 0;
        this.maxRetries = typeof config.retries === 'number' ? config.retries : 0;
        this.optional = !!config.optional;
        this.metadata = config.metadata || {};

        // Execution State
        this.state = NodeState.IDLE;
        this.result = null;
        this.error = null;
        this.startTime = null;
        this.endTime = null;
        this.retryCount = 0;
    }

    /**
     * Resets the node's execution state to IDLE.
     */
    reset() {
        this.state = NodeState.IDLE;
        this.result = null;
        this.error = null;
        this.startTime = null;
        this.endTime = null;
        this.retryCount = 0;
    }

    /**
     * Executes the node's task with the provided inputs and context.
     * Handles timeouts and retries internally.
     * 
     * @param {Object<string, any>} inputs - Results from dependency nodes, keyed by node ID.
     * @param {Object} context - Global execution context shared across the graph.
     * @returns {Promise<any>} The result of the task.
     */
    async execute(inputs, context) {
        this.state = NodeState.RUNNING;
        this.startTime = performance.now();
        this.error = null;

        const attemptExecution = async () => {
            if (this.timeout > 0) {
                return Promise.race([
                    this.task(inputs, context),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error(`Execution timed out after ${this.timeout}ms`)), this.timeout)
                    )
                ]);
            }
            return this.task(inputs, context);
        };

        while (this.retryCount <= this.maxRetries) {
            try {
                this.result = await attemptExecution();
                this.state = NodeState.SUCCESS;
                this.endTime = performance.now();
                return this.result;
            } catch (err) {
                this.error = err;
                this.retryCount++;
                
                if (this.retryCount > this.maxRetries) {
                    this.state = NodeState.FAILED;
                    this.endTime = performance.now();
                    
                    if (this.optional) {
                        // If optional, we swallow the error for the graph, but mark as failed.
                        return null; 
                    }
                    throw new NodeExecutionError(this.id, err);
                }
                // Optional: Add exponential backoff here if needed for network resilience
                await new Promise(res => setTimeout(res, 100 * Math.pow(2, this.retryCount - 1)));
            }
        }
    }

    /**
     * Returns the execution duration in milliseconds.
     * @returns {number} Duration in ms, or 0 if not executed.
     */
    getDuration() {
        if (this.startTime && this.endTime) {
            return this.endTime - this.startTime;
        }
        if (this.startTime) {
            return performance.now() - this.startTime; // Currently running
        }
        return 0;
    }

    /**
     * Serializes the node configuration (excludes the task function).
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            timeout: this.timeout,
            maxRetries: this.maxRetries,
            optional: this.optional,
            metadata: this.metadata,
            state: this.state,
            duration: this.getDuration(),
            error: this.error ? this.error.message : null
        };
    }
}

/**
 * Manages a Directed Acyclic Graph (DAG) of tools/actions.
 * Extends EventTarget to emit lifecycle events for UI integration.
 * 
 * Events Emitted:
 * - `graph:start`: Fired when graph execution begins.
 * - `node:start`: Fired when a specific node starts running.
 * - `node:success`: Fired when a node completes successfully.
 * - `node:failed`: Fired when a node fails.
 * - `node:skipped`: Fired when a node is skipped due to upstream failure.
 * - `graph:complete`: Fired when all nodes have finished successfully.
 * - `graph:error`: Fired when graph execution halts due to an error.
 */
export class DependencyGraph extends EventTarget {
    constructor() {
        super();
        /** @type {Map<string, GraphNode>} Map of node ID to GraphNode instance */
        this.nodes = new Map();
        
        /** @type {Map<string, Set<string>>} Adjacency list: NodeID -> Set of Dependent NodeIDs (Edges: A -> B means B depends on A) */
        this.edges = new Map();
        
        /** @type {Map<string, Set<string>>} Reverse Adjacency list: NodeID -> Set of Prerequisite NodeIDs */
        this.dependencies = new Map();

        /** @type {boolean} Flag indicating if the graph is currently executing */
        this.isExecuting = false;
    }

    // ------------------------------------------------------------------------
    // GRAPH CONSTRUCTION API
    // ------------------------------------------------------------------------

    /**
     * Adds a new node (tool/action) to the graph.
     * 
     * @param {string} id - Unique identifier for the node.
     * @param {Object} config - Node configuration (see GraphNode).
     * @returns {DependencyGraph} Returns this instance for chaining.
     * @throws {GraphError} If node ID already exists.
     */
    addNode(id, config) {
        if (this.nodes.has(id)) {
            throw new GraphError(`Node with ID [${id}] already exists.`);
        }
        const node = new GraphNode(id, config);
        this.nodes.set(id, node);
        this.edges.set(id, new Set());
        this.dependencies.set(id, new Set());
        return this;
    }

    /**
     * Defines a dependency: `dependentId` requires `prerequisiteId` to finish first.
     * Edge direction is prerequisiteId -> dependentId.
     * 
     * @param {string} prerequisiteId - The ID of the node that must run first.
     * @param {string} dependentId - The ID of the node that depends on the prerequisite.
     * @returns {DependencyGraph} Returns this instance for chaining.
     * @throws {NodeNotFoundError} If either node does not exist in the graph.
     */
    addDependency(prerequisiteId, dependentId) {
        if (!this.nodes.has(prerequisiteId)) {
            throw new NodeNotFoundError(prerequisiteId);
        }
        if (!this.nodes.has(dependentId)) {
            throw new NodeNotFoundError(dependentId);
        }
        if (prerequisiteId === dependentId) {
            throw new GraphError(`Node [${prerequisiteId}] cannot depend on itself.`);
        }

        this.edges.get(prerequisiteId).add(dependentId);
        this.dependencies.get(dependentId).add(prerequisiteId);
        return this;
    }

    /**
     * Removes a node and all associated edges from the graph.
     * 
     * @param {string} id - The ID of the node to remove.
     * @returns {boolean} True if removed, false if it didn't exist.
     */
    removeNode(id) {
        if (!this.nodes.has(id)) return false;

        // Remove from edges (nodes that depended on this node)
        const dependents = this.edges.get(id);
        if (dependents) {
            for (const depId of dependents) {
                this.dependencies.get(depId).delete(id);
            }
        }

        // Remove from dependencies (nodes this node depended on)
        const prerequisites = this.dependencies.get(id);
        if (prerequisites) {
            for (const preId of prerequisites) {
                this.edges.get(preId).delete(id);
            }
        }

        this.edges.delete(id);
        this.dependencies.delete(id);
        this.nodes.delete(id);
        return true;
    }

    /**
     * Clears the entire graph.
     */
    clear() {
        this.nodes.clear();
        this.edges.clear();
        this.dependencies.clear();
        this.isExecuting = false;
    }

    // ------------------------------------------------------------------------
    // VALIDATION & ANALYSIS API
    // ------------------------------------------------------------------------

    /**
     * Validates the graph structure.
     * Checks for missing dependencies and circular dependencies (cycles).
     * 
     * @throws {GraphValidationError} If the graph is empty or has structural issues.
     * @throws {CircularDependencyError} If a cycle is detected.
     * @returns {boolean} True if the graph is valid.
     */
    validate() {
        if (this.nodes.size === 0) {
            throw new GraphValidationError("Graph is empty. Add nodes before validation or execution.");
        }

        // 1. Check for dangling edges (should be impossible with current API, but safe to check)
        const missingNodes = [];
        for (const [id, deps] of this.dependencies.entries()) {
            for (const dep of deps) {
                if (!this.nodes.has(dep)) {
                    missingNodes.push(`Node [${id}] depends on missing node [${dep}]`);
                }
            }
        }
        if (missingNodes.length > 0) {
            throw new GraphValidationError("Graph contains unresolved dependencies.", missingNodes);
        }

        // 2. Cycle Detection using Depth-First Search (DFS) with node coloring
        // Colors: 0 = unvisited, 1 = visiting (in current path), 2 = visited (fully processed)
        const colors = new Map();
        for (const id of this.nodes.keys()) {
            colors.set(id, 0);
        }

        const detectCycleDFS = (nodeId, path) => {
            colors.set(nodeId, 1);
            path.push(nodeId);

            const neighbors = this.edges.get(nodeId) || new Set();
            for (const neighbor of neighbors) {
                const neighborColor = colors.get(neighbor);
                if (neighborColor === 1) {
                    // Back-edge found -> Cycle
                    const cycleStartIdx = path.indexOf(neighbor);
                    const cyclePath = path.slice(cycleStartIdx);
                    cyclePath.push(neighbor); // Close the loop for the error message
                    throw new CircularDependencyError(cyclePath);
                } else if (neighborColor === 0) {
                    detectCycleDFS(neighbor, path);
                }
            }

            colors.set(nodeId, 2);
            path.pop();
        };

        for (const id of this.nodes.keys()) {
            if (colors.get(id) === 0) {
                detectCycleDFS(id, []);
            }
        }

        return true;
    }

    /**
     * Performs a topological sort of the graph to determine a valid sequential execution order.
     * Uses Kahn's Algorithm.
     * 
     * @returns {string[]} Array of node IDs in execution order.
     * @throws {CircularDependencyError} If a cycle is detected during sorting.
     */
    getTopologicalSort() {
        this.validate(); // Ensure no cycles before sorting

        const inDegree = new Map();
        for (const id of this.nodes.keys()) {
            inDegree.set(id, 0);
        }

        for (const [_, dependents] of this.edges.entries()) {
            for (const dep of dependents) {
                inDegree.set(dep, inDegree.get(dep) + 1);
            }
        }

        const queue = [];
        for (const [id, degree] of inDegree.entries()) {
            if (degree === 0) {
                queue.push(id);
            }
        }

        const sorted = [];
        while (queue.length > 0) {
            const currentId = queue.shift();
            sorted.push(currentId);

            const neighbors = this.edges.get(currentId) || new Set();
            for (const neighbor of neighbors) {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }

        if (sorted.length !== this.nodes.size) {
            // Fallback safety check, validate() should catch this first.
            throw new GraphError("Topological sort failed due to graph inconsistency.");
        }

        return sorted;
    }

    /**
     * Groups nodes into execution layers. Nodes in the same layer have no dependencies
     * on each other and can be executed in parallel.
     * 
     * @returns {Array<Array<string>>} Array of layers, where each layer is an array of node IDs.
     */
    getExecutionBatches() {
        this.validate();

        const inDegree = new Map();
        for (const id of this.nodes.keys()) {
            inDegree.set(id, this.dependencies.get(id).size);
        }

        const batches = [];
        let currentBatch = [];

        // Find initial nodes with 0 dependencies
        for (const [id, degree] of inDegree.entries()) {
            if (degree === 0) {
                currentBatch.push(id);
            }
        }

        while (currentBatch.length > 0) {
            batches.push(currentBatch);
            const nextBatch = [];

            for (const nodeId of currentBatch) {
                const dependents = this.edges.get(nodeId) || new Set();
                for (const depId of dependents) {
                    const newDegree = inDegree.get(depId) - 1;
                    inDegree.set(depId, newDegree);
                    if (newDegree === 0) {
                        nextBatch.push(depId);
                    }
                }
            }
            currentBatch = nextBatch;
        }

        return batches;
    }

    // ------------------------------------------------------------------------
    // EXECUTION ENGINE API
    // ------------------------------------------------------------------------

    /**
     * Emits a CustomEvent.
     * @private
     * @param {string} eventName 
     * @param {Object} detail 
     */
    _emit(eventName, detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    /**
     * Resets all nodes in the graph to their initial IDLE state.
     */
    resetExecutionState() {
        for (const node of this.nodes.values()) {
            node.reset();
        }
        this.isExecuting = false;
    }

    /**
     * Executes the graph asynchronously, respecting dependencies.
     * Automatically runs independent branches in parallel.
     * 
     * @param {Object} globalContext - Shared context object passed to all nodes.
     * @returns {Promise<Object>} A promise that resolves to an object containing all node results.
     * @throws {GraphError} If validation fails or a critical node fails.
     */
    async execute(globalContext = {}) {
        if (this.isExecuting) {
            throw new GraphError("Graph is already executing.");
        }

        this.validate();
        this.resetExecutionState();
        this.isExecuting = true;

        this._emit('graph:start', { totalNodes: this.nodes.size });

        const results = {};
        const nodePromises = new Map();

        // Helper to get results from dependencies
        const getDependencyResults = (nodeId) => {
            const deps = this.dependencies.get(nodeId) || new Set();
            const inputs = {};
            for (const depId of deps) {
                inputs[depId] = results[depId];
            }
            return inputs;
        };

        // Helper to check if any required dependency failed
        const checkDependenciesFailed = (nodeId) => {
            const deps = this.dependencies.get(nodeId) || new Set();
            for (const depId of deps) {
                const depNode = this.nodes.get(depId);
                if (depNode.state === NodeState.FAILED && !depNode.optional) {
                    return true;
                }
                if (depNode.state === NodeState.SKIPPED) {
                    return true;
                }
            }
            return false;
        };

        // Recursive execution trigger
        const executeNode = async (nodeId) => {
            const node = this.nodes.get(nodeId);

            // Wait for all prerequisites to resolve
            const prerequisites = Array.from(this.dependencies.get(nodeId) || new Set());
            const prereqPromises = prerequisites.map(id => nodePromises.get(id));
            
            try {
                await Promise.all(prereqPromises);
            } catch (err) {
                // If a required prerequisite threw an error, it will be caught here.
                // We mark this node as skipped.
                node.state = NodeState.SKIPPED;
                this._emit('node:skipped', { nodeId, reason: 'Upstream failure' });
                throw err; // Propagate the failure down the chain
            }

            // Double check state of prerequisites in case they were optional but failed
            if (checkDependenciesFailed(nodeId)) {
                node.state = NodeState.SKIPPED;
                this._emit('node:skipped', { nodeId, reason: 'Upstream dependency failed' });
                throw new GraphError(`Node [${nodeId}] skipped due to upstream failure.`);
            }

            // Execute the node
            node.state = NodeState.WAITING;
            this._emit('node:start', { nodeId, name: node.name });

            const inputs = getDependencyResults(nodeId);

            try {
                const result = await node.execute(inputs, globalContext);
                results[nodeId] = result;
                this._emit('node:success', { 
                    nodeId, 
                    result, 
                    duration: node.getDuration() 
                });
                return result;
            } catch (err) {
                this._emit('node:failed', { 
                    nodeId, 
                    error: err, 
                    duration: node.getDuration() 
                });
                if (!node.optional) {
                    throw err; // Halt the graph execution on this branch
                } else {
                    // Optional node failed, return null to dependents
                    results[nodeId] = null;
                    return null;
                }
            }
        };

        try {
            // Initialize promises for all nodes
            for (const id of this.nodes.keys()) {
                nodePromises.set(id, executeNode(id));
            }

            // Await all node executions
            await Promise.allSettled(Array.from(nodePromises.values()));

            // Check if any critical failures occurred across the graph
            const failedNodes = Array.from(this.nodes.values()).filter(n => n.state === NodeState.FAILED && !n.optional);
            if (failedNodes.length > 0) {
                const errorMsg = `Graph execution failed. Critical nodes failed: ${failedNodes.map(n => n.id).join(', ')}`;
                const err = new GraphError(errorMsg);
                this._emit('graph:error', { error: err, results });
                throw err;
            }

            this.isExecuting = false;
            this._emit('graph:complete', { results, duration: this.getOverallDuration() });
            return results;

        } catch (error) {
            this.isExecuting = false;
            this._emit('graph:error', { error, results });
            throw error;
        }
    }

    /**
     * Helper to calculate total execution time.
     * @private
     * @returns {number}
     */
    getOverallDuration() {
        let minStart = Infinity;
        let maxEnd = 0;
        for (const node of this.nodes.values()) {
            if (node.startTime && node.startTime < minStart) minStart = node.startTime;
            if (node.endTime && node.endTime > maxEnd) maxEnd = node.endTime;
        }
        if (minStart === Infinity || maxEnd === 0) return 0;
        return maxEnd - minStart;
    }

    // ------------------------------------------------------------------------
    // SERIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Serializes the graph structure and current state to JSON.
     * Note: Functions (`task`) cannot be serialized.
     * 
     * @returns {Object} JSON representation of the graph.
     */
    toJSON() {
        const nodesData = {};
        for (const [id, node] of this.nodes.entries()) {
            nodesData[id] = node.toJSON();
        }

        const edgesData = {};
        for (const [id, deps] of this.edges.entries()) {
            edgesData[id] = Array.from(deps);
        }

        return {
            nodes: nodesData,
            edges: edgesData,
            isExecuting: this.isExecuting
        };
    }
}