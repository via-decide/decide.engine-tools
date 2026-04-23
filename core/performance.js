/**
 * @fileoverview Decide Engine - Core Performance & Critical Path Analysis
 * 
 * This module provides high-resolution per-node latency tracking and critical path
 * analysis for execution flows. It maps execution latencies onto a dependency
 * graph to identify performance bottlenecks and optimize system speed.
 * 
 * Capabilities:
 * - High-resolution timing (supports both Browser and Node.js environments)
 * - Directed Acyclic Graph (DAG) dependency management
 * - Cycle detection for execution graphs
 * - Critical path computation (Longest Path algorithm based on node durations)
 * - Bottleneck identification and execution mapping
 * 
 * @module core/performance
 * @version 3.0.0
 */

/**
 * @typedef {Object} NodeMetrics
 * @property {string} id - Unique identifier for the execution node
 * @property {number} startTime - High-resolution start timestamp
 * @property {number|null} endTime - High-resolution end timestamp
 * @property {number|null} duration - Execution duration in milliseconds
 * @property {boolean} completed - Whether the node has finished execution
 * @property {Object} [metadata] - Optional arbitrary metadata for the node
 */

/**
 * @typedef {Object} CriticalPathResult
 * @property {string[]} path - Ordered array of node IDs forming the critical path
 * @property {number} totalDuration - Total latency of the critical path
 * @property {Object[]} bottlenecks - Nodes on the critical path sorted by individual duration
 */

/**
 * @typedef {Object} ExecutionReport
 * @property {number} totalExecutionTime - Time from first node start to last node end
 * @property {number} activeNodes - Number of nodes currently executing
 * @property {number} completedNodes - Number of successfully measured nodes
 * @property {CriticalPathResult} criticalPath - Critical path analysis results
 * @property {Record<string, NodeMetrics>} nodeDetails - Detailed metrics per node
 */

/**
 * Custom Error class for Performance Graph issues (e.g., circular dependencies)
 */
class GraphError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GraphError';
    }
}

/**
 * Manages the Dependency Directed Acyclic Graph (DAG) for execution nodes.
 */
class DependencyGraph {
    constructor() {
        /** @type {Map<string, Set<string>>} Maps a node to its dependents (children) */
        this.adjacencyList = new Map();
        /** @type {Map<string, Set<string>>} Maps a node to its prerequisites (parents) */
        this.reverseList = new Map();
        /** @type {Set<string>} Set of all registered nodes in the graph */
        this.nodes = new Set();
    }

    /**
     * Registers a node in the graph.
     * @param {string} nodeId - The ID of the node to add.
     */
    addNode(nodeId) {
        if (!this.nodes.has(nodeId)) {
            this.nodes.add(nodeId);
            this.adjacencyList.set(nodeId, new Set());
            this.reverseList.set(nodeId, new Set());
        }
    }

    /**
     * Defines a dependency where `childId` depends on `parentId` completing first.
     * @param {string} parentId - The prerequisite node ID.
     * @param {string} childId - The dependent node ID.
     * @throws {GraphError} If adding the edge creates a cycle.
     */
    addDependency(parentId, childId) {
        this.addNode(parentId);
        this.addNode(childId);

        this.adjacencyList.get(parentId).add(childId);
        this.reverseList.get(childId).add(parentId);

        if (this.hasCycle()) {
            // Rollback the addition if it creates a cycle
            this.adjacencyList.get(parentId).delete(childId);
            this.reverseList.get(childId).delete(parentId);
            throw new GraphError(`Circular dependency detected when adding edge: ${parentId} -> ${childId}`);
        }
    }

    /**
     * Detects if the current graph contains any cycles using DFS.
     * @returns {boolean} True if a cycle exists, false otherwise.
     */
    hasCycle() {
        const visited = new Set();
        const recursionStack = new Set();

        const dfs = (nodeId) => {
            visited.add(nodeId);
            recursionStack.add(nodeId);

            const neighbors = this.adjacencyList.get(nodeId) || new Set();
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (recursionStack.has(neighbor)) {
                    return true;
                }
            }

            recursionStack.delete(nodeId);
            return false;
        };

        for (const node of this.nodes) {
            if (!visited.has(node)) {
                if (dfs(node)) return true;
            }
        }

        return false;
    }

    /**
     * Computes a topological sort of the graph.
     * @returns {string[]} Array of node IDs in topologically sorted order.
     * @throws {GraphError} If a cycle prevents topological sorting.
     */
    topologicalSort() {
        const inDegree = new Map();
        for (const node of this.nodes) {
            inDegree.set(node, 0);
        }

        for (const [node, neighbors] of this.adjacencyList.entries()) {
            for (const neighbor of neighbors) {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
            }
        }

        const queue = [];
        for (const [node, degree] of inDegree.entries()) {
            if (degree === 0) {
                queue.push(node);
            }
        }

        const sorted = [];
        while (queue.length > 0) {
            const current = queue.shift();
            sorted.push(current);

            const neighbors = this.adjacencyList.get(current) || new Set();
            for (const neighbor of neighbors) {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }

        if (sorted.length !== this.nodes.size) {
            throw new GraphError("Graph contains a cycle, cannot compute topological sort.");
        }

        return sorted;
    }

    /**
     * Retrieves all parent nodes (prerequisites) for a given node.
     * @param {string} nodeId - The target node ID.
     * @returns {string[]} Array of parent node IDs.
     */
    getParents(nodeId) {
        return Array.from(this.reverseList.get(nodeId) || new Set());
    }
}

/**
 * Core Performance Tracker for the Decide Engine.
 * Tracks node latencies and performs critical path analysis to find bottlenecks.
 */
export class ExecutionProfiler {
    constructor() {
        /** @type {Map<string, NodeMetrics>} */
        this.metrics = new Map();
        /** @type {DependencyGraph} */
        this.graph = new DependencyGraph();
        
        // Ensure high-resolution time is available across environments
        this.perf = typeof performance !== 'undefined' ? performance : Date;
    }

    /**
     * Clears all tracking data and resets the graph.
     */
    reset() {
        this.metrics.clear();
        this.graph = new DependencyGraph();
    }

    /**
     * Registers a dependency between two execution nodes.
     * @param {string} prerequisiteId - Node that must complete first.
     * @param {string} dependentId - Node that waits for the prerequisite.
     */
    registerDependency(prerequisiteId, dependentId) {
        try {
            this.graph.addDependency(prerequisiteId, dependentId);
            
            // Ensure metrics exist for both nodes
            if (!this.metrics.has(prerequisiteId)) this._initializeNodeMetrics(prerequisiteId);
            if (!this.metrics.has(dependentId)) this._initializeNodeMetrics(dependentId);
        } catch (error) {
            console.error(`[ExecutionProfiler] Failed to register dependency: ${error.message}`);
            throw error;
        }
    }

    /**
     * Initializes the metric object for a node if it doesn't exist.
     * @private
     * @param {string} nodeId 
     */
    _initializeNodeMetrics(nodeId) {
        this.metrics.set(nodeId, {
            id: nodeId,
            startTime: 0,
            endTime: null,
            duration: null,
            completed: false,
            metadata: {}
        });
        this.graph.addNode(nodeId);
    }

    /**
     * Marks the start time of a node's execution.
     * @param {string} nodeId - The ID of the node starting execution.
     * @param {Object} [metadata] - Optional metadata to attach to the node trace.
     */
    markNodeStart(nodeId, metadata = {}) {
        if (!this.metrics.has(nodeId)) {
            this._initializeNodeMetrics(nodeId);
        }

        const node = this.metrics.get(nodeId);
        node.startTime = this.perf.now();
        node.completed = false;
        node.endTime = null;
        node.duration = null;
        node.metadata = { ...node.metadata, ...metadata };
    }

    /**
     * Marks the end time of a node's execution and computes latency.
     * @param {string} nodeId - The ID of the node finishing execution.
     * @throws {Error} If the node was never started.
     */
    markNodeEnd(nodeId) {
        const endTime = this.perf.now();
        const node = this.metrics.get(nodeId);

        if (!node || node.startTime === 0 && !node.completed) {
            throw new Error(`[ExecutionProfiler] Cannot end node '${nodeId}' before starting it.`);
        }

        node.endTime = endTime;
        node.duration = node.endTime - node.startTime;
        node.completed = true;
    }

    /**
     * Retrieves the latency map of all tracked nodes.
     * @returns {Record<string, NodeMetrics>} Object mapping node IDs to their metrics.
     */
    getExecutionMap() {
        const map = {};
        for (const [id, metric] of this.metrics.entries()) {
            map[id] = { ...metric };
        }
        return map;
    }

    /**
     * Analyzes the execution graph to find the critical path.
     * The critical path is the longest sequence of dependent nodes by total duration.
     * 
     * @returns {CriticalPathResult} The critical path and bottleneck analysis.
     */
    analyzeCriticalPath() {
        const sortedNodes = this.graph.topologicalSort();
        
        // DP Maps for longest path calculation
        const maxDurations = new Map();
        const predecessors = new Map();

        // Initialize maps
        for (const nodeId of sortedNodes) {
            const metrics = this.metrics.get(nodeId);
            // If a node wasn't executed/completed, we treat its duration as 0 to avoid breaking analysis
            const duration = (metrics && metrics.completed) ? metrics.duration : 0;
            maxDurations.set(nodeId, duration);
            predecessors.set(nodeId, null);
        }

        // Calculate longest paths
        for (const nodeId of sortedNodes) {
            const parents = this.graph.getParents(nodeId);
            const metrics = this.metrics.get(nodeId);
            const myDuration = (metrics && metrics.completed) ? metrics.duration : 0;

            let maxParentDuration = 0;
            let bestParent = null;

            for (const parentId of parents) {
                const parentPathDuration = maxDurations.get(parentId);
                if (parentPathDuration > maxParentDuration) {
                    maxParentDuration = parentPathDuration;
                    bestParent = parentId;
                }
            }

            if (bestParent !== null) {
                maxDurations.set(nodeId, maxParentDuration + myDuration);
                predecessors.set(nodeId, bestParent);
            }
        }

        // Find the node where the longest path ends
        let terminalNode = null;
        let absoluteMaxDuration = -1;

        for (const [nodeId, duration] of maxDurations.entries()) {
            if (duration > absoluteMaxDuration) {
                absoluteMaxDuration = duration;
                terminalNode = nodeId;
            }
        }

        // Backtrack to build the critical path
        const criticalPath = [];
        let currentNode = terminalNode;

        while (currentNode !== null) {
            criticalPath.unshift(currentNode); // prepend to maintain start-to-end order
            currentNode = predecessors.get(currentNode);
        }

        // Identify bottlenecks (nodes on critical path sorted by their individual duration descending)
        const bottlenecks = criticalPath
            .map(id => this.metrics.get(id))
            .filter(metric => metric && metric.completed)
            .map(metric => ({
                id: metric.id,
                duration: metric.duration,
                percentageOfTotal: absoluteMaxDuration > 0 ? (metric.duration / absoluteMaxDuration) * 100 : 0
            }))
            .sort((a, b) => b.duration - a.duration);

        return {
            path: criticalPath,
            totalDuration: absoluteMaxDuration === -1 ? 0 : absoluteMaxDuration,
            bottlenecks: bottlenecks
        };
    }

    /**
     * Generates a comprehensive performance report.
     * @returns {ExecutionReport} Full diagnostic report of the execution flow.
     */
    generateReport() {
        let earliestStart = Infinity;
        let latestEnd = 0;
        let activeNodes = 0;
        let completedNodes = 0;

        for (const metric of this.metrics.values()) {
            if (metric.startTime > 0 && metric.startTime < earliestStart) {
                earliestStart = metric.startTime;
            }
            if (metric.completed) {
                completedNodes++;
                if (metric.endTime > latestEnd) {
                    latestEnd = metric.endTime;
                }
            } else if (metric.startTime > 0) {
                activeNodes++;
            }
        }

        const totalExecutionTime = (latestEnd > 0 && earliestStart !== Infinity) 
            ? (latestEnd - earliestStart) 
            : 0;

        let criticalPathData;
        try {
            criticalPathData = this.analyzeCriticalPath();
        } catch (err) {
            console.warn(`[ExecutionProfiler] Could not compute critical path: ${err.message}`);
            criticalPathData = { path: [], totalDuration: 0, bottlenecks: [] };
        }

        return {
            totalExecutionTime,
            activeNodes,
            completedNodes,
            criticalPath: criticalPathData,
            nodeDetails: this.getExecutionMap()
        };
    }

    /**
     * Utility to wrap an asynchronous function/node execution with automatic tracking.
     * @param {string} nodeId - Identifier for the node.
     * @param {Function} asyncFn - The async function to execute.
     * @param {Object} [metadata] - Optional metadata.
     * @returns {Promise<any>} The result of the async function.
     */
    async trackExecution(nodeId, asyncFn, metadata = {}) {
        this.markNodeStart(nodeId, metadata);
        try {
            const result = await asyncFn();
            this.markNodeEnd(nodeId);
            return result;
        } catch (error) {
            // Record failure in metadata but still mark end to compute time-to-failure
            const node = this.metrics.get(nodeId);
            if (node) {
                node.metadata.error = error.message;
                node.metadata.failed = true;
            }
            this.markNodeEnd(nodeId);
            throw error;
        }
    }
}

// Singleton instance for global tracking across the engine
export const globalProfiler = new ExecutionProfiler();