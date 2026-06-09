/**
 * @fileoverview Concurrency Control and Lock Management System
 * @module core/concurrency
 * 
 * Provides a robust, deadlock-aware concurrency control system for the Decide Engine.
 * Features include:
 * - Mutexes for exclusive resource locking.
 * - Semaphores for execution pooling and parallel limits.
 * - Read/Write Locks for shared state and outputs.
 * - Wait-For Graph (WFG) based Deadlock Detection.
 * - Centralized LockManager for named resource coordination across independent nodes.
 * 
 * This ensures that parallel node execution is safe, deterministic, and free 
 * from race conditions or conflicting state mutations.
 */

// ============================================================================
// Custom Error Definitions
// ============================================================================

/**
 * Base error class for all concurrency-related exceptions.
 */
export class ConcurrencyError extends Error {
    /**
     * @param {string} message - Error description
     */
    constructor(message) {
        super(message);
        this.name = 'ConcurrencyError';
        // Ensure stack trace is captured correctly in V8 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConcurrencyError);
        }
    }
}

/**
 * Thrown when a lock acquisition times out.
 */
export class TimeoutError extends ConcurrencyError {
    /**
     * @param {string} resourceId - The ID of the resource that timed out
     * @param {number} timeoutMs - The timeout duration in milliseconds
     */
    constructor(resourceId, timeoutMs) {
        super(`Timeout acquired lock for resource '${resourceId}' after ${timeoutMs}ms`);
        this.name = 'TimeoutError';
        this.resourceId = resourceId;
        this.timeoutMs = timeoutMs;
    }
}

/**
 * Thrown when a deadlock is detected in the Wait-For Graph.
 */
export class DeadlockError extends ConcurrencyError {
    /**
     * @param {string} ownerId - The entity that attempted the lock
     * @param {string} resourceId - The resource that caused the cycle
     * @param {Array<string>} cycle - The detected cycle path
     */
    constructor(ownerId, resourceId, cycle) {
        super(`Deadlock detected! Owner '${ownerId}' waiting on '${resourceId}'. Cycle: ${cycle.join(' -> ')}`);
        this.name = 'DeadlockError';
        this.ownerId = ownerId;
        this.resourceId = resourceId;
        this.cycle = cycle;
    }
}

/**
 * Thrown when an invalid lock operation is attempted (e.g., releasing an unowned lock).
 */
export class LockStateError extends ConcurrencyError {
    constructor(message) {
        super(message);
        this.name = 'LockStateError';
    }
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * A deferred promise implementation to manage queue resolutions.
 * @template T
 */
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

// ============================================================================
// Deadlock Detection (Wait-For Graph)
// ============================================================================

/**
 * Wait-For Graph (WFG) to detect deadlocks dynamically.
 * Tracks which owners hold which resources, and which owners are waiting on which resources.
 */
export class WaitForGraph {
    constructor() {
        // Map<OwnerId, Set<ResourceId>>
        this.holdings = new Map();
        // Map<OwnerId, Set<ResourceId>>
        this.waitings = new Map();
        // Map<ResourceId, Set<OwnerId>>
        this.resourceOwners = new Map();
    }

    /**
     * Records that an owner holds a resource.
     * @param {string} ownerId 
     * @param {string} resourceId 
     */
    addHolding(ownerId, resourceId) {
        if (!this.holdings.has(ownerId)) this.holdings.set(ownerId, new Set());
        this.holdings.get(ownerId).add(resourceId);

        if (!this.resourceOwners.has(resourceId)) this.resourceOwners.set(resourceId, new Set());
        this.resourceOwners.get(resourceId).add(ownerId);

        // If they were waiting for it, they aren't anymore
        if (this.waitings.has(ownerId)) {
            this.waitings.get(ownerId).delete(resourceId);
        }
    }

    /**
     * Records that an owner released a resource.
     * @param {string} ownerId 
     * @param {string} resourceId 
     */
    removeHolding(ownerId, resourceId) {
        if (this.holdings.has(ownerId)) {
            this.holdings.get(ownerId).delete(resourceId);
        }
        if (this.resourceOwners.has(resourceId)) {
            this.resourceOwners.get(resourceId).delete(ownerId);
        }
    }

    /**
     * Records that an owner is waiting for a resource.
     * Throws DeadlockError if adding this wait creates a cycle.
     * @param {string} ownerId 
     * @param {string} resourceId 
     */
    addWaiting(ownerId, resourceId) {
        if (!this.waitings.has(ownerId)) this.waitings.set(ownerId, new Set());
        this.waitings.get(ownerId).add(resourceId);

        const cycle = this.detectCycle(ownerId);
        if (cycle) {
            this.waitings.get(ownerId).delete(resourceId); // Rollback
            throw new DeadlockError(ownerId, resourceId, cycle);
        }
    }

    /**
     * Records that an owner is no longer waiting for a resource (e.g., timeout).
     * @param {string} ownerId 
     * @param {string} resourceId 
     */
    removeWaiting(ownerId, resourceId) {
        if (this.waitings.has(ownerId)) {
            this.waitings.get(ownerId).delete(resourceId);
        }
    }

    /**
     * Detects if there is a cycle in the WFG starting from the given owner.
     * @param {string} startOwnerId 
     * @returns {Array<string>|null} The cycle path if detected, null otherwise.
     */
    detectCycle(startOwnerId) {
        const visited = new Set();
        const stack = new Set();
        const path = [];

        const dfs = (currentOwner) => {
            if (stack.has(currentOwner)) {
                path.push(currentOwner);
                return true;
            }
            if (visited.has(currentOwner)) {
                return false;
            }

            visited.add(currentOwner);
            stack.add(currentOwner);
            path.push(currentOwner);

            const waitingForResources = this.waitings.get(currentOwner) || new Set();
            for (const res of waitingForResources) {
                const ownersOfResource = this.resourceOwners.get(res) || new Set();
                for (const owner of ownersOfResource) {
                    if (dfs(owner)) {
                        return true;
                    }
                }
            }

            stack.delete(currentOwner);
            path.pop();
            return false;
        };

        if (dfs(startOwnerId)) {
            return path;
        }
        return null;
    }
}

// ============================================================================
// Core Synchronization Primitives
// ============================================================================

/**
 * Mutual Exclusion Lock. Ensures only one execution thread/context
 * can hold the lock at any given time.
 */
export class Mutex {
    constructor() {
        this.locked = false;
        this.queue = [];
        this.currentOwner = null;
    }

    /**
     * Acquires the mutex lock.
     * @param {string} ownerId - Identifier of the entity acquiring the lock
     * @returns {Promise<void>} Resolves when the lock is acquired
     */
    async acquire(ownerId) {
        if (!this.locked) {
            this.locked = true;
            this.currentOwner = ownerId;
            return Promise.resolve();
        }

        const deferred = new Deferred();
        this.queue.push({ ownerId, deferred });
        return deferred.promise;
    }

    /**
     * Releases the mutex lock.
     * @param {string} ownerId - Identifier of the entity releasing the lock
     * @throws {LockStateError} If the lock is not held by the owner
     */
    release(ownerId) {
        if (!this.locked) {
            throw new LockStateError(`Cannot release an unlocked mutex (Owner: ${ownerId})`);
        }
        if (this.currentOwner !== ownerId) {
            throw new LockStateError(`Mutex is owned by '${this.currentOwner}', cannot be released by '${ownerId}'`);
        }

        if (this.queue.length > 0) {
            const next = this.queue.shift();
            this.currentOwner = next.ownerId;
            next.deferred.resolve();
        } else {
            this.locked = false;
            this.currentOwner = null;
        }
    }

    /**
     * Checks if the mutex is currently locked.
     * @returns {boolean}
     */
    isLocked() {
        return this.locked;
    }

    /**
     * Gets the current owner of the lock.
     * @returns {string|null}
     */
    getOwner() {
        return this.currentOwner;
    }
}

/**
 * Read-Write Lock. Allows multiple readers simultaneously, but only one writer.
 * Writers get exclusive access. Prevents writers from starving.
 */
export class ReadWriteLock {
    constructor() {
        this.readers = new Set();
        this.writer = null;
        this.readQueue = [];
        this.writeQueue = [];
    }

    /**
     * Acquires a read (shared) lock.
     * @param {string} ownerId 
     * @returns {Promise<void>}
     */
    async acquireRead(ownerId) {
        // If there's a writer, or writers waiting, queue the reader to prevent writer starvation
        if (this.writer !== null || this.writeQueue.length > 0) {
            const deferred = new Deferred();
            this.readQueue.push({ ownerId, deferred });
            return deferred.promise;
        }
        this.readers.add(ownerId);
        return Promise.resolve();
    }

    /**
     * Releases a read (shared) lock.
     * @param {string} ownerId 
     */
    releaseRead(ownerId) {
        if (!this.readers.has(ownerId)) {
            throw new LockStateError(`Reader '${ownerId}' does not hold the read lock.`);
        }
        this.readers.delete(ownerId);
        this._processQueues();
    }

    /**
     * Acquires a write (exclusive) lock.
     * @param {string} ownerId 
     * @returns {Promise<void>}
     */
    async acquireWrite(ownerId) {
        if (this.writer !== null || this.readers.size > 0) {
            const deferred = new Deferred();
            this.writeQueue.push({ ownerId, deferred });
            return deferred.promise;
        }
        this.writer = ownerId;
        return Promise.resolve();
    }

    /**
     * Releases a write (exclusive) lock.
     * @param {string} ownerId 
     */
    releaseWrite(ownerId) {
        if (this.writer !== ownerId) {
            throw new LockStateError(`Writer '${ownerId}' does not hold the write lock.`);
        }
        this.writer = null;
        this._processQueues();
    }

    /**
     * Internal method to process waiting queues after a release.
     * Prioritizes writers to prevent starvation.
     * @private
     */
    _processQueues() {
        if (this.writer !== null) return; // Still locked by a writer

        if (this.readers.size === 0 && this.writeQueue.length > 0) {
            // No readers, and we have a waiting writer -> Grant Write Lock
            const nextWriter = this.writeQueue.shift();
            this.writer = nextWriter.ownerId;
            nextWriter.deferred.resolve();
        } else if (this.writeQueue.length === 0 && this.readQueue.length > 0) {
            // No waiting writers, flush all waiting readers -> Grant Read Locks
            const readersToWake = [...this.readQueue];
            this.readQueue = [];
            for (const r of readersToWake) {
                this.readers.add(r.ownerId);
                r.deferred.resolve();
            }
        }
    }
}

/**
 * Semaphore for controlling access to a pool of resources (e.g., max concurrent nodes).
 */
export class Semaphore {
    /**
     * @param {number} maxConcurrency - Maximum number of concurrent acquisitions allowed
     */
    constructor(maxConcurrency) {
        if (maxConcurrency <= 0) throw new Error("Semaphore concurrency must be > 0");
        this.maxConcurrency = maxConcurrency;
        this.currentCount = 0;
        this.queue = [];
    }

    /**
     * Acquires a slot in the semaphore.
     * @returns {Promise<void>}
     */
    async acquire() {
        if (this.currentCount < this.maxConcurrency) {
            this.currentCount++;
            return Promise.resolve();
        }
        const deferred = new Deferred();
        this.queue.push(deferred);
        return deferred.promise;
    }

    /**
     * Releases a slot in the semaphore.
     */
    release() {
        if (this.currentCount === 0) {
            throw new LockStateError("Cannot release a semaphore that has no active acquisitions.");
        }
        if (this.queue.length > 0) {
            const nextDeferred = this.queue.shift();
            nextDeferred.resolve();
        } else {
            this.currentCount--;
        }
    }

    /**
     * Executes a function within the semaphore constraints.
     * @param {Function} taskFn - Async function to execute
     * @returns {Promise<any>}
     */
    async runExclusive(taskFn) {
        await this.acquire();
        try {
            return await taskFn();
        } finally {
            this.release();
        }
    }
}

// ============================================================================
// Main Lock Manager
// ============================================================================

/**
 * Centralized Lock Manager handling Mutexes and Read/Write locks by resource name.
 * Integrates Deadlock Detection and Timeout mechanisms.
 * Ideal for locking Node states, Shared Outputs, and Global Resources.
 */
export class LockManager {
    constructor() {
        this.mutexes = new Map();
        this.rwLocks = new Map();
        this.wfg = new WaitForGraph();
        
        // Default timeout for acquiring locks (30 seconds)
        this.defaultTimeoutMs = 30000;
    }

    /**
     * Retrieves or creates a Mutex for the given resource ID.
     * @param {string} resourceId 
     * @returns {Mutex}
     * @private
     */
    _getMutex(resourceId) {
        if (!this.mutexes.has(resourceId)) {
            this.mutexes.set(resourceId, new Mutex());
        }
        return this.mutexes.get(resourceId);
    }

    /**
     * Retrieves or creates a ReadWriteLock for the given resource ID.
     * @param {string} resourceId 
     * @returns {ReadWriteLock}
     * @private
     */
    _getRWLock(resourceId) {
        if (!this.rwLocks.has(resourceId)) {
            this.rwLocks.set(resourceId, new ReadWriteLock());
        }
        return this.rwLocks.get(resourceId);
    }

    /**
     * Wraps a lock acquisition promise with timeout and deadlock detection logic.
     * @param {string} resourceId 
     * @param {string} ownerId 
     * @param {Promise<void>} acquirePromise 
     * @param {number} timeoutMs 
     * @returns {Promise<void>}
     * @private
     */
    async _acquireWithSupervision(resourceId, ownerId, acquirePromise, timeoutMs) {
        this.wfg.addWaiting(ownerId, resourceId);

        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                this.wfg.removeWaiting(ownerId, resourceId);
                reject(new TimeoutError(resourceId, timeoutMs));
            }, timeoutMs);
        });

        try {
            await Promise.race([acquirePromise, timeoutPromise]);
            clearTimeout(timeoutId);
            this.wfg.addHolding(ownerId, resourceId);
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Acquires an exclusive lock (Mutex) on a resource.
     * @param {string} resourceId - The resource to lock (e.g., 'node:123:state')
     * @param {string} ownerId - The entity requesting the lock (e.g., 'worker:456')
     * @param {number} [timeoutMs] - Optional timeout in ms
     * @returns {Promise<void>}
     */
    async acquireExclusive(resourceId, ownerId, timeoutMs = this.defaultTimeoutMs) {
        const mutex = this._getMutex(resourceId);
        const acquirePromise = mutex.acquire(ownerId);
        
        // If immediately acquired, bypass supervision overhead
        if (mutex.getOwner() === ownerId && mutex.isLocked()) {
             this.wfg.addHolding(ownerId, resourceId);
             return;
        }

        await this._acquireWithSupervision(resourceId, ownerId, acquirePromise, timeoutMs);
    }

    /**
     * Releases an exclusive lock (Mutex) on a resource.
     * @param {string} resourceId 
     * @param {string} ownerId 
     */
    releaseExclusive(resourceId, ownerId) {
        const mutex = this.mutexes.get(resourceId);
        if (!mutex) {
            throw new LockStateError(`Resource '${resourceId}' is not currently locked.`);
        }
        mutex.release(ownerId);
        this.wfg.removeHolding(ownerId, resourceId);
        
        // Cleanup empty locks to prevent memory leaks
        if (!mutex.isLocked() && mutex.queue.length === 0) {
            this.mutexes.delete(resourceId);
        }
    }

    /**
     * Acquires a Read (Shared) lock on a resource.
     * @param {string} resourceId 
     * @param {string} ownerId 
     * @param {number} [timeoutMs] 
     * @returns {Promise<void>}
     */
    async acquireRead(resourceId, ownerId, timeoutMs = this.defaultTimeoutMs) {
        const rwLock = this._getRWLock(resourceId);
        const acquirePromise = rwLock.acquireRead(ownerId);
        await this._acquireWithSupervision(resourceId, ownerId, acquirePromise, timeoutMs);
    }

    /**
     * Releases a Read (Shared) lock on a resource.
     * @param {string} resourceId 
     * @param {string} ownerId 
     */
    releaseRead(resourceId, ownerId) {
        const rwLock = this.rwLocks.get(resourceId);
        if (!rwLock) {
            throw new LockStateError(`Resource '${resourceId}' is not currently locked.`);
        }
        rwLock.releaseRead(ownerId);
        this.wfg.removeHolding(ownerId, resourceId);

        this._cleanupRWLockIfEmpty(resourceId, rwLock);
    }

    /**
     * Acquires a Write (Exclusive) lock on a resource.
     * @param {string} resourceId 
     * @param {string} ownerId 
     * @param {number} [timeoutMs] 
     * @returns {Promise<void>}
     */
    async acquireWrite(resourceId, ownerId, timeoutMs = this.defaultTimeoutMs) {
        const rwLock = this._getRWLock(resourceId);
        const acquirePromise = rwLock.acquireWrite(ownerId);
        await this._acquireWithSupervision(resourceId, ownerId, acquirePromise, timeoutMs);
    }

    /**
     * Releases a Write (Exclusive) lock on a resource.
     * @param {string} resourceId 
     * @param {string} ownerId 
     */
    releaseWrite(resourceId, ownerId) {
        const rwLock = this.rwLocks.get(resourceId);
        if (!rwLock) {
            throw new LockStateError(`Resource '${resourceId}' is not currently locked.`);
        }
        rwLock.releaseWrite(ownerId);
        this.wfg.removeHolding(ownerId, resourceId);

        this._cleanupRWLockIfEmpty(resourceId, rwLock);
    }

    /**
     * Utility to run a function safely within an exclusive lock.
     * Automatically acquires and releases the lock.
     * @param {string} resourceId 
     * @param {string} ownerId 
     * @param {Function} taskFn - Async function to execute
     * @param {number} [timeoutMs] 
     * @returns {Promise<any>}
     */
    async withExclusiveLock(resourceId, ownerId, taskFn, timeoutMs = this.defaultTimeoutMs) {
        await this.acquireExclusive(resourceId, ownerId, timeoutMs);
        try {
            return await taskFn();
        } finally {
            this.releaseExclusive(resourceId, ownerId);
        }
    }

    /**
     * Utility to run a function safely within a read lock.
     * @param {string} resourceId 
     * @param {string} ownerId 
     * @param {Function} taskFn 
     * @param {number} [timeoutMs] 
     * @returns {Promise<any>}
     */
    async withReadLock(resourceId, ownerId, taskFn, timeoutMs = this.defaultTimeoutMs) {
        await this.acquireRead(resourceId, ownerId, timeoutMs);
        try {
            return await taskFn();
        } finally {
            this.releaseRead(resourceId, ownerId);
        }
    }

    /**
     * Utility to run a function safely within a write lock.
     * @param {string} resourceId 
     * @param {string} ownerId 
     * @param {Function} taskFn 
     * @param {number} [timeoutMs] 
     * @returns {Promise<any>}
     */
    async withWriteLock(resourceId, ownerId, taskFn, timeoutMs = this.defaultTimeoutMs) {
        await this.acquireWrite(resourceId, ownerId, timeoutMs);
        try {
            return await taskFn();
        } finally {
            this.releaseWrite(resourceId, ownerId);
        }
    }

    /**
     * Cleans up RW locks to prevent memory bloat.
     * @private
     */
    _cleanupRWLockIfEmpty(resourceId, rwLock) {
        if (rwLock.readers.size === 0 && 
            rwLock.writer === null && 
            rwLock.readQueue.length === 0 && 
            rwLock.writeQueue.length === 0) {
            this.rwLocks.delete(resourceId);
        }
    }
}

// ============================================================================
// Node Execution Concurrency Controller
// ============================================================================

/**
 * Orchestrator for managing parallel execution of independent nodes.
 * Uses Semaphores to limit total concurrent execution and LockManager 
 * to ensure shared state/outputs are mutated safely.
 */
export class NodeExecutionController {
    /**
     * @param {number} maxConcurrentNodes - Max number of nodes to execute in parallel
     */
    constructor(maxConcurrentNodes = 10) {
        this.executionSemaphore = new Semaphore(maxConcurrentNodes);
        this.lockManager = new LockManager();
    }

    /**
     * Executes a node safely by handling its resource dependencies.
     * 
     * @param {string} nodeId - Unique ID of the node
     * @param {Array<string>} readDependencies - Resource IDs the node needs to read
     * @param {Array<string>} writeDependencies - Resource IDs the node needs to mutate
     * @param {Function} executionFn - The actual async logic of the node
     * @returns {Promise<any>} The result of the node execution
     */
    async executeNode(nodeId, readDependencies, writeDependencies, executionFn) {
        // Step 1: Wait for an available execution slot in the pool
        await this.executionSemaphore.acquire();

        try {
            // Step 2: Acquire all necessary locks (Ordered to prevent deadlocks)
            // Sorting dependencies ensures deterministic lock acquisition order globally
            const sortedReads = [...new Set(readDependencies)].sort();
            const sortedWrites = [...new Set(writeDependencies)].sort();

            // Acquire Write Locks first (higher priority for mutation)
            for (const res of sortedWrites) {
                await this.lockManager.acquireWrite(res, nodeId);
            }

            // Acquire Read Locks next
            for (const res of sortedReads) {
                // Skip read lock if we already hold a write lock on the same resource
                if (!sortedWrites.includes(res)) {
                    await this.lockManager.acquireRead(res, nodeId);
                }
            }

            // Step 3: Execute the node logic safely
            try {
                return await executionFn();
            } finally {
                // Step 4: Release all locks in reverse order
                for (const res of sortedReads.reverse()) {
                    if (!sortedWrites.includes(res)) {
                        this.lockManager.releaseRead(res, nodeId);
                    }
                }
                for (const res of sortedWrites.reverse()) {
                    this.lockManager.releaseWrite(res, nodeId);
                }
            }
        } finally {
            // Step 5: Release the execution slot
            this.executionSemaphore.release();
        }
    }

    /**
     * Utility to lock a specific node's internal state directly.
     * Useful for UI updates or external state injections while the engine runs.
     * @param {string} nodeId 
     * @param {Function} stateModifierFn 
     * @returns {Promise<any>}
     */
    async mutateNodeStateSafely(nodeId, stateModifierFn) {
        const resourceId = `node_state:${nodeId}`;
        const ownerId = `state_mutator:${Math.random().toString(36).substr(2, 9)}`;
        return this.lockManager.withExclusiveLock(resourceId, ownerId, stateModifierFn);
    }
}

// Instantiate a global singleton for generic usage across the engine
export const globalLockManager = new LockManager();
export const globalNodeController = new NodeExecutionController();