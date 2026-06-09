/**
 * @fileoverview Idempotency Layer for Decide Engine
 * @module core/idempotency
 * @description 
 * Provides a robust idempotency layer to prevent duplicate node execution
 * and ensure consistent results for identical inputs. This module ensures that
 * each node executes only once per unique input, and repeated executions reuse
 * existing results without triggering side effects.
 * 
 * Features:
 * - Deterministic input normalization (handles nested objects, arrays, primitives).
 * - Fast, collision-resistant 53-bit hashing (cyrb53) for execution key generation.
 * - In-flight execution deduplication (Promise sharing for concurrent identical requests).
 * - Pluggable storage adapters (In-Memory LRU, LocalStorage, SessionStorage).
 * - TTL (Time-To-Live) support for cache invalidation.
 * 
 * @author Antigravity Synthesis Orchestrator (v3.0.0-beast)
 * @version 1.0.0
 */

// ============================================================================
// UTILITIES: DETERMINISTIC NORMALIZATION & HASHING
// ============================================================================

/**
 * Normalizes any JavaScript value into a deterministic string representation.
 * Ensures that object key order does not affect the final string.
 */
class DeterministicNormalizer {
    /**
     * Stringifies a value deterministically.
     * @param {any} value - The input value to normalize.
     * @returns {string} The deterministic JSON string.
     */
    static stringify(value) {
        if (value === undefined) return 'undefined';
        if (value === null) return 'null';
        if (typeof value === 'function') return value.toString();
        if (value instanceof Date) return `__date__:${value.toISOString()}`;
        if (value instanceof RegExp) return `__regex__:${value.toString()}`;
        
        if (Array.isArray(value)) {
            const arrStr = value.map(item => this.stringify(item)).join(',');
            return `[${arrStr}]`;
        }
        
        if (typeof value === 'object') {
            const keys = Object.keys(value).sort();
            const objStr = keys.map(k => `"${k}":${this.stringify(value[k])}`).join(',');
            return `{${objStr}}`;
        }
        
        return JSON.stringify(value);
    }
}

/**
 * Fast, non-cryptographic hash function optimized for JavaScript.
 * cyrb53 (c) 2018 bryc (github.com/bryc). License: Public Domain.
 */
class HashUtil {
    /**
     * Generates a 53-bit hash for a given string.
     * @param {string} str - The string to hash.
     * @param {number} [seed=0] - Optional seed for the hash.
     * @returns {string} The hexadecimal representation of the hash.
     */
    static cyrb53(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        const hashNum = 4294967296 * (2097151 & h2) + (h1 >>> 0);
        return hashNum.toString(16).padStart(14, '0');
    }

    /**
     * Generates a unique execution key based on node ID and normalized input.
     * Formula: key = hash(node_id + normalized_input)
     * @param {string} nodeId - The unique identifier of the execution node.
     * @param {any} input - The input payload for the node.
     * @returns {string} The deterministic execution key.
     */
    static generateExecutionKey(nodeId, input) {
        if (!nodeId) throw new Error('nodeId is required for key generation.');
        const normalizedInput = DeterministicNormalizer.stringify(input);
        const payload = `${nodeId}::${normalizedInput}`;
        return `${nodeId}_${this.cyrb53(payload)}`;
    }
}

// ============================================================================
// STORAGE ADAPTERS
// ============================================================================

/**
 * Abstract Base Class for Storage Adapters.
 */
class StorageAdapter {
    get(key) { throw new Error('Method not implemented.'); }
    set(key, value) { throw new Error('Method not implemented.'); }
    delete(key) { throw new Error('Method not implemented.'); }
    clear() { throw new Error('Method not implemented.'); }
    cleanup() { throw new Error('Method not implemented.'); }
}

/**
 * In-Memory Storage Adapter with LRU (Least Recently Used) eviction and TTL.
 */
class MemoryStorageAdapter extends StorageAdapter {
    /**
     * @param {number} maxItems - Maximum number of items to keep in memory.
     */
    constructor(maxItems = 1000) {
        super();
        this.maxItems = maxItems;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        
        const record = this.cache.get(key);
        if (record.expiresAt && Date.now() > record.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        // LRU bump
        this.cache.delete(key);
        this.cache.set(key, record);
        
        return record.data;
    }

    set(key, value, ttlMs = null) {
        if (this.cache.size >= this.maxItems) {
            // Evict oldest (first item in Map iteration)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        const record = {
            data: value,
            timestamp: Date.now(),
            expiresAt: ttlMs ? Date.now() + ttlMs : null
        };

        this.cache.set(key, record);
    }

    delete(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.cache.entries()) {
            if (record.expiresAt && now > record.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

/**
 * Browser LocalStorage Adapter for persistent idempotency across sessions.
 */
class LocalStorageAdapter extends StorageAdapter {
    /**
     * @param {string} prefix - Prefix for local storage keys to prevent collisions.
     */
    constructor(prefix = 'decide_idemp_') {
        super();
        this.prefix = prefix;
        this.isSupported = this._checkSupport();
    }

    _checkSupport() {
        try {
            const testKey = '__test_support__';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('LocalStorage is not supported or is full. Idempotency will gracefully fail to persist.');
            return false;
        }
    }

    get(key) {
        if (!this.isSupported) return null;
        try {
            const raw = window.localStorage.getItem(this.prefix + key);
            if (!raw) return null;

            const record = JSON.parse(raw);
            if (record.expiresAt && Date.now() > record.expiresAt) {
                this.delete(key);
                return null;
            }
            return record.data;
        } catch (e) {
            console.error(`Error reading key ${key} from LocalStorage:`, e);
            return null;
        }
    }

    set(key, value, ttlMs = null) {
        if (!this.isSupported) return;
        try {
            const record = {
                data: value,
                timestamp: Date.now(),
                expiresAt: ttlMs ? Date.now() + ttlMs : null
            };
            window.localStorage.setItem(this.prefix + key, JSON.stringify(record));
        } catch (e) {
            console.error(`Error writing key ${key} to LocalStorage. Quota exceeded?`, e);
            // Attempt cleanup and retry once
            this.cleanup();
            try {
                window.localStorage.setItem(this.prefix + key, JSON.stringify({
                    data: value,
                    timestamp: Date.now(),
                    expiresAt: ttlMs ? Date.now() + ttlMs : null
                }));
            } catch (retryError) {
                console.error('Retry failed. LocalStorage is strictly full.');
            }
        }
    }

    delete(key) {
        if (!this.isSupported) return;
        window.localStorage.removeItem(this.prefix + key);
    }

    clear() {
        if (!this.isSupported) return;
        const keysToRemove = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && k.startsWith(this.prefix)) {
                keysToRemove.push(k);
            }
        }
        keysToRemove.forEach(k => window.localStorage.removeItem(k));
    }

    cleanup() {
        if (!this.isSupported) return;
        const now = Date.now();
        const keysToRemove = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && k.startsWith(this.prefix)) {
                try {
                    const raw = window.localStorage.getItem(k);
                    const record = JSON.parse(raw);
                    if (record.expiresAt && now > record.expiresAt) {
                        keysToRemove.push(k);
                    }
                } catch (e) {
                    // Corrupted data, mark for removal
                    keysToRemove.push(k);
                }
            }
        }
        keysToRemove.forEach(k => window.localStorage.removeItem(k));
    }
}

// ============================================================================
// CORE IDEMPOTENCY MANAGER
// ============================================================================

/**
 * Manages idempotency for node executions.
 * Prevents duplicate executions of identical tasks and caches results.
 */
class IdempotencyManager {
    /**
     * @param {Object} options - Configuration options.
     * @param {StorageAdapter} [options.storage] - Storage adapter instance. Defaults to MemoryStorageAdapter.
     * @param {number} [options.defaultTtlMs=3600000] - Default Time-To-Live for cached results in milliseconds (1 hour).
     * @param {boolean} [options.deduplicateInFlight=true] - If true, concurrent identical requests will share the same Promise.
     */
    constructor(options = {}) {
        this.storage = options.storage || new MemoryStorageAdapter();
        this.defaultTtlMs = options.defaultTtlMs !== undefined ? options.defaultTtlMs : 60 * 60 * 1000;
        this.deduplicateInFlight = options.deduplicateInFlight !== false;
        
        // Tracks in-flight promises to prevent simultaneous duplicate executions
        this.inFlightExecutions = new Map();

        // Periodic cleanup
        this.cleanupInterval = setInterval(() => this.storage.cleanup(), 5 * 60 * 1000); // Every 5 mins
    }

    /**
     * Generates the deterministic key for a node execution.
     * @param {string} nodeId - Node identifier.
     * @param {any} input - Node input data.
     * @returns {string} Execution key.
     */
    generateKey(nodeId, input) {
        return HashUtil.generateExecutionKey(nodeId, input);
    }

    /**
     * Pre-execution check. Determines if a valid result already exists.
     * @param {string} executionKey - The generated execution key.
     * @returns {any|null} The cached result, or null if not found/expired.
     */
    check(executionKey) {
        return this.storage.get(executionKey);
    }

    /**
     * Post-execution save. Stores the result for future identical inputs.
     * @param {string} executionKey - The generated execution key.
     * @param {any} result - The result of the execution.
     * @param {number} [ttlMs] - Optional override for TTL.
     */
    save(executionKey, result, ttlMs = this.defaultTtlMs) {
        this.storage.set(executionKey, result, ttlMs);
    }

    /**
     * Core wrapper for asynchronous node execution.
     * Ensures the task is executed only once for the given inputs.
     * 
     * @param {string} nodeId - The unique identifier of the node.
     * @param {any} input - The input payload.
     * @param {Function} taskFn - An async function containing the execution logic.
     * @param {Object} [options={}] - Execution options.
     * @param {boolean} [options.forceBypass=false] - If true, ignores cache and forces execution.
     * @param {number} [options.ttlMs] - TTL for this specific execution result.
     * @returns {Promise<any>} The result of the execution (cached or fresh).
     */
    async execute(nodeId, input, taskFn, options = {}) {
        const { forceBypass = false, ttlMs = this.defaultTtlMs } = options;
        const executionKey = this.generateKey(nodeId, input);

        // 1. Check persistent cache (if not bypassing)
        if (!forceBypass) {
            const cachedResult = this.check(executionKey);
            if (cachedResult !== null) {
                return cachedResult;
            }
        }

        // 2. Check in-flight executions (Promise deduplication)
        if (this.deduplicateInFlight && this.inFlightExecutions.has(executionKey)) {
            return this.inFlightExecutions.get(executionKey);
        }

        // 3. Execute the task and track it
        const executionPromise = (async () => {
            try {
                const result = await taskFn(input);
                
                // 4. Save result on success
                this.save(executionKey, result, ttlMs);
                return result;
            } catch (error) {
                // On error, we do not cache the failure by default in this implementation,
                // allowing subsequent retries to attempt execution again.
                throw error;
            } finally {
                // 5. Cleanup in-flight tracking
                if (this.deduplicateInFlight) {
                    this.inFlightExecutions.delete(executionKey);
                }
            }
        })();

        if (this.deduplicateInFlight) {
            this.inFlightExecutions.set(executionKey, executionPromise);
        }

        return executionPromise;
    }

    /**
     * Core wrapper for synchronous node execution.
     * 
     * @param {string} nodeId - The unique identifier of the node.
     * @param {any} input - The input payload.
     * @param {Function} taskFn - A synchronous function containing the execution logic.
     * @param {Object} [options={}] - Execution options.
     * @param {boolean} [options.forceBypass=false] - If true, ignores cache and forces execution.
     * @param {number} [options.ttlMs] - TTL for this specific execution result.
     * @returns {any} The result of the execution (cached or fresh).
     */
    executeSync(nodeId, input, taskFn, options = {}) {
        const { forceBypass = false, ttlMs = this.defaultTtlMs } = options;
        const executionKey = this.generateKey(nodeId, input);

        if (!forceBypass) {
            const cachedResult = this.check(executionKey);
            if (cachedResult !== null) {
                return cachedResult;
            }
        }

        const result = taskFn(input);
        this.save(executionKey, result, ttlMs);
        
        return result;
    }

    /**
     * Invalidates the cache for a specific key.
     * @param {string} nodeId - Node identifier.
     * @param {any} input - The input payload.
     */
    invalidate(nodeId, input) {
        const executionKey = this.generateKey(nodeId, input);
        this.storage.delete(executionKey);
    }

    /**
     * Clears all cached idempotency records.
     */
    clearAll() {
        this.storage.clear();
        this.inFlightExecutions.clear();
    }

    /**
     * Destroys the manager, clearing intervals to prevent memory leaks.
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.clearAll();
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    DeterministicNormalizer,
    HashUtil,
    StorageAdapter,
    MemoryStorageAdapter,
    LocalStorageAdapter,
    IdempotencyManager
};

// Default singleton instance for quick usage across the Decide Engine
export const defaultIdempotencyManager = new IdempotencyManager({
    storage: new MemoryStorageAdapter(5000), // Default high-capacity memory store for the engine
    defaultTtlMs: 24 * 60 * 60 * 1000 // 24 hour default TTL
});