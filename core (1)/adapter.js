/**
 * @fileoverview External Call Adapter for Decide Engine
 * @module core/adapter
 * 
 * @description
 * This module provides a robust, deterministic, and highly configurable adapter for all 
 * external API and tool interactions within the Decide Engine ecosystem. 
 * 
 * Core Capabilities:
 * - Request Normalization: Standardizes headers, query parameters, and payloads to ensure
 *   consistent and reproducible request signatures.
 * - Response Normalization: Deeply cleanses response payloads, aggressively removing or masking
 *   non-deterministic fields (e.g., timestamps, UUIDs, trace IDs, random nonces) to guarantee
 *   identical outputs for identical inputs across executions.
 * - Caching Engine: Implements a highly efficient, deterministic caching layer to eliminate
 *   redundant network calls and ensure execution determinism.
 * - Resilience: Built-in exponential backoff retries, timeout management, and in-flight
 *   request deduplication.
 * 
 * @author Antigravity Synthesis Orchestrator (v3.0.0-beast)
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

/**
 * Base error class for all Adapter-related exceptions.
 * @extends Error
 */
export class AdapterError extends Error {
    /**
     * @param {string} message - Error description
     * @param {Object} [context={}] - Additional context regarding the error
     */
    constructor(message, context = {}) {
        super(message);
        this.name = 'AdapterError';
        this.context = context;
        this.timestamp = new Date().toISOString();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AdapterError);
        }
    }
}

/**
 * Thrown when a network request fails (e.g., DNS resolution, connection refused).
 * @extends AdapterError
 */
export class NetworkError extends AdapterError {
    constructor(message, context = {}) {
        super(message, context);
        this.name = 'NetworkError';
    }
}

/**
 * Thrown when a request exceeds the configured timeout duration.
 * @extends AdapterError
 */
export class TimeoutError extends AdapterError {
    constructor(message, context = {}) {
        super(message, context);
        this.name = 'TimeoutError';
    }
}

/**
 * Thrown when request or response normalization fails.
 * @extends AdapterError
 */
export class NormalizationError extends AdapterError {
    constructor(message, context = {}) {
        super(message, context);
        this.name = 'NormalizationError';
    }
}

// ============================================================================
// DETERMINISTIC UTILITIES
// ============================================================================

/**
 * Utility class providing methods to ensure data determinism.
 */
class DeterministicUtils {
    /**
     * Recursively sorts the keys of an object to ensure deterministic JSON stringification.
     * @param {*} obj - The value to sort.
     * @returns {*} The recursively sorted object, or the original value if not an object.
     */
    static sortObjectKeys(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(DeterministicUtils.sortObjectKeys);
        }

        const sortedKeys = Object.keys(obj).sort();
        const result = {};
        for (const key of sortedKeys) {
            result[key] = DeterministicUtils.sortObjectKeys(obj[key]);
        }
        return result;
    }

    /**
     * Generates a deterministic string representation of any JSON-serializable value.
     * @param {*} value - The value to stringify.
     * @returns {string} The deterministic JSON string.
     */
    static stringify(value) {
        try {
            const sorted = DeterministicUtils.sortObjectKeys(value);
            return JSON.stringify(sorted);
        } catch (error) {
            throw new NormalizationError('Failed to deterministically stringify value', { error: error.message });
        }
    }

    /**
     * Generates a fast, synchronous 53-bit hash for a given string (cyrb53 algorithm).
     * Used for generating deterministic cache keys.
     * @param {string} str - The input string.
     * @param {number} [seed=0] - Optional seed for the hash.
     * @returns {string} Hexadecimal hash string.
     */
    static hashString(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
        return hash.toString(16).padStart(14, '0');
    }
}

// ============================================================================
// NORMALIZER
// ============================================================================

/**
 * Handles the aggressive normalization of requests and responses to enforce determinism.
 */
class Normalizer {
    constructor() {
        // Regex patterns for identifying non-deterministic data
        this.patterns = {
            uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            isoDate: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/i,
            jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
            hexHash: /^[a-f0-9]{32,64}$/i
        };

        // Keys that are inherently non-deterministic and should be masked
        this.nondeterministicKeys = new Set([
            'timestamp', 'time', 'date', 'created_at', 'updated_at', 'deleted_at',
            'uuid', 'guid', 'id', 'trace_id', 'correlation_id', 'request_id',
            'nonce', 'etag', 'last_modified', 'session_id', 'token'
        ]);
    }

    /**
     * Normalizes a request configuration object.
     * @param {Object} config - The request configuration (url, method, headers, body, etc.)
     * @returns {Object} The normalized request configuration.
     */
    normalizeRequest(config) {
        const normalized = {
            url: this._normalizeUrl(config.url, config.params),
            method: (config.method || 'GET').toUpperCase(),
            headers: this._normalizeHeaders(config.headers),
        };

        if (config.body) {
            normalized.body = this._normalizeRequestBody(config.body);
        }

        return normalized;
    }

    /**
     * Normalizes a response payload by recursively stripping non-deterministic values.
     * @param {*} data - The response payload.
     * @returns {*} The deeply normalized response payload.
     */
    normalizeResponse(data) {
        try {
            // Deep clone to avoid mutating the original response
            const clonedData = JSON.parse(JSON.stringify(data));
            return this._deepNormalize(clonedData);
        } catch (error) {
            throw new NormalizationError('Failed to normalize response payload', { error: error.message });
        }
    }

    /**
     * Internal method to recursively traverse and cleanse objects/arrays.
     * @private
     */
    _deepNormalize(value, keyName = '') {
        if (value === null || value === undefined) {
            return value;
        }

        // Handle Arrays
        if (Array.isArray(value)) {
            return value.map((item) => this._deepNormalize(item, keyName));
        }

        // Handle Objects
        if (typeof value === 'object') {
            const normalizedObj = {};
            for (const [k, v] of Object.entries(value)) {
                const lowerKey = k.toLowerCase();
                
                // If the key implies non-determinism, mask its value entirely
                if (this._isNondeterministicKey(lowerKey)) {
                    normalizedObj[k] = `[NORMALIZED_${k.toUpperCase()}]`;
                } else {
                    normalizedObj[k] = this._deepNormalize(v, k);
                }
            }
            return normalizedObj;
        }

        // Handle Strings (Check for UUIDs, Dates, Hashes)
        if (typeof value === 'string') {
            if (this.patterns.uuid.test(value)) return '[NORMALIZED_UUID]';
            if (this.patterns.isoDate.test(value)) return '[NORMALIZED_ISO_DATE]';
            if (this.patterns.jwt.test(value)) return '[NORMALIZED_JWT]';
            if (this.patterns.hexHash.test(value)) return '[NORMALIZED_HASH]';
            return value;
        }

        // Handle primitives (Numbers, Booleans)
        return value;
    }

    /**
     * Checks if a key name indicates a non-deterministic value.
     * @private
     */
    _isNondeterministicKey(key) {
        // Exact matches
        if (this.nondeterministicKeys.has(key)) return true;
        
        // Partial matches for common patterns
        if (key.endsWith('_id') && key !== 'user_id' && key !== 'organization_id') return true;
        if (key.includes('timestamp') || key.includes('date')) return true;
        
        return false;
    }

    /**
     * Normalizes a URL, alphabetizing query parameters for consistency.
     * @private
     */
    _normalizeUrl(baseUrl, params = {}) {
        try {
            const urlObj = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
            
            // Append explicit params to URL object
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== null) {
                    urlObj.searchParams.set(key, value);
                }
            }

            // Sort search parameters to ensure deterministic URL
            urlObj.searchParams.sort();

            // Return absolute URL if provided as absolute, else pathname + search
            return baseUrl.startsWith('http') ? urlObj.toString() : `${urlObj.pathname}${urlObj.search}`;
        } catch (error) {
            throw new NormalizationError(`Invalid URL provided: ${baseUrl}`, { error: error.message });
        }
    }

    /**
     * Normalizes HTTP headers.
     * @private
     */
    _normalizeHeaders(headers = {}) {
        const normalized = {};
        const sortedKeys = Object.keys(headers).sort();
        
        for (const key of sortedKeys) {
            const lowerKey = key.toLowerCase();
            // Ignore non-deterministic headers
            if (['date', 'x-request-id', 'x-correlation-id', 'postman-token'].includes(lowerKey)) {
                continue;
            }
            normalized[lowerKey] = headers[key];
        }
        
        return normalized;
    }

    /**
     * Normalizes a request body.
     * @private
     */
    _normalizeRequestBody(body) {
        if (typeof body === 'string') {
            try {
                // Attempt to parse and deterministically stringify JSON strings
                const parsed = JSON.parse(body);
                return DeterministicUtils.stringify(parsed);
            } catch (e) {
                return body; // Return as-is if not JSON
            }
        }
        if (typeof body === 'object') {
            return DeterministicUtils.stringify(body);
        }
        return body;
    }
}

// ============================================================================
// CACHE MANAGER
// ============================================================================

/**
 * Manages deterministic caching of external responses.
 */
class CacheManager {
    /**
     * @param {Object} options
     * @param {number} options.ttl - Time to live in milliseconds
     * @param {boolean} options.useLocalStorage - Whether to persist cache to localStorage (browser only)
     * @param {string} options.namespace - Prefix for cache keys
     */
    constructor(options = {}) {
        this.ttl = options.ttl || 1000 * 60 * 5; // Default 5 minutes
        this.useLocalStorage = options.useLocalStorage !== false && typeof window !== 'undefined' && window.localStorage;
        this.namespace = options.namespace || 'decide_adapter_cache';
        this.memoryCache = new Map();
    }

    /**
     * Generates a unique, deterministic cache key for a request.
     * @param {Object} normalizedRequest - The normalized request object
     * @returns {string} The cache key
     */
    generateKey(normalizedRequest) {
        const requestString = DeterministicUtils.stringify(normalizedRequest);
        const hash = DeterministicUtils.hashString(requestString);
        return `${this.namespace}_${hash}`;
    }

    /**
     * Retrieves a value from the cache if it exists and is not expired.
     * @param {string} key - The cache key
     * @returns {Object|null} The cached response or null
     */
    get(key) {
        const now = Date.now();

        // Check memory cache first
        if (this.memoryCache.has(key)) {
            const entry = this.memoryCache.get(key);
            if (now < entry.expiry) {
                return entry.data;
            }
            this.memoryCache.delete(key); // Evict expired
        }

        // Check local storage fallback
        if (this.useLocalStorage) {
            try {
                const stored = localStorage.getItem(key);
                if (stored) {
                    const entry = JSON.parse(stored);
                    if (now < entry.expiry) {
                        // Restore to memory cache for faster subsequent access
                        this.memoryCache.set(key, entry);
                        return entry.data;
                    }
                    localStorage.removeItem(key); // Evict expired
                }
            } catch (error) {
                console.warn('[CacheManager] Failed to read from localStorage', error);
            }
        }

        return null;
    }

    /**
     * Stores a value in the cache.
     * @param {string} key - The cache key
     * @param {Object} data - The normalized response data to cache
     */
    set(key, data) {
        const entry = {
            data,
            expiry: Date.now() + this.ttl,
            timestamp: Date.now()
        };

        this.memoryCache.set(key, entry);

        if (this.useLocalStorage) {
            try {
                localStorage.setItem(key, JSON.stringify(entry));
            } catch (error) {
                console.warn('[CacheManager] Failed to write to localStorage (Quota exceeded?)', error);
                // If quota exceeded, we might want to clear old entries, but keeping it simple for now.
            }
        }
    }

    /**
     * Clears all entries managed by this cache instance.
     */
    clear() {
        this.memoryCache.clear();
        if (this.useLocalStorage) {
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.namespace)) {
                        localStorage.removeItem(key);
                    }
                }
            } catch (error) {
                console.warn('[CacheManager] Failed to clear localStorage', error);
            }
        }
    }
}

// ============================================================================
// REQUEST QUEUE (DEDUPLICATION)
// ============================================================================

/**
 * Prevents identical in-flight requests from triggering multiple network calls.
 */
class RequestQueue {
    constructor() {
        this.inFlight = new Map();
    }

    /**
     * Enqueues a request or returns an existing promise if identical request is in flight.
     * @param {string} key - Deterministic request key
     * @param {Function} executor - Function that returns a Promise for the network call
     * @returns {Promise<any>}
     */
    async execute(key, executor) {
        if (this.inFlight.has(key)) {
            return this.inFlight.get(key);
        }

        const promise = executor().finally(() => {
            this.inFlight.delete(key);
        });

        this.inFlight.set(key, promise);
        return promise;
    }
}

// ============================================================================
// EXTERNAL CALL ADAPTER (MAIN CLASS)
// ============================================================================

/**
 * Main External Call Adapter for wrapping, normalizing, and executing external API/Tool calls.
 */
export class ExternalCallAdapter {
    /**
     * @param {Object} options - Configuration options
     * @param {number} [options.timeout=10000] - Default request timeout in ms
     * @param {number} [options.retries=3] - Number of retry attempts for failed requests
     * @param {number} [options.retryDelay=1000] - Base delay for exponential backoff in ms
     * @param {boolean} [options.enableCache=true] - Whether to enable deterministic caching
     * @param {Object} [options.cacheOptions] - Configuration passed to CacheManager
     * @param {Object} [options.defaultHeaders] - Headers applied to every request
     */
    constructor(options = {}) {
        this.timeout = options.timeout || 10000;
        this.retries = options.retries !== undefined ? options.retries : 3;
        this.retryDelay = options.retryDelay || 1000;
        this.enableCache = options.enableCache !== false;
        this.defaultHeaders = options.defaultHeaders || {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        this.normalizer = new Normalizer();
        this.cache = new CacheManager(options.cacheOptions);
        this.queue = new RequestQueue();

        // Interceptors
        this.interceptors = {
            request: [],
            response: []
        };
    }

    /**
     * Adds a request interceptor.
     * @param {Function} onFulfilled - Called with normalized config before request is made
     * @param {Function} [onRejected] - Called if request configuration fails
     */
    addRequestInterceptor(onFulfilled, onRejected) {
        this.interceptors.request.push({ onFulfilled, onRejected });
    }

    /**
     * Adds a response interceptor.
     * @param {Function} onFulfilled - Called with normalized response before returning to caller
     * @param {Function} [onRejected] - Called if request fails
     */
    addResponseInterceptor(onFulfilled, onRejected) {
        this.interceptors.response.push({ onFulfilled, onRejected });
    }

    /**
     * Executes a GET request.
     * @param {string} url - Target URL
     * @param {Object} [params] - Query parameters
     * @param {Object} [config] - Additional configuration overrides
     * @returns {Promise<Object>} Normalized response
     */
    async get(url, params = {}, config = {}) {
        return this.request({ ...config, url, method: 'GET', params });
    }

    /**
     * Executes a POST request.
     * @param {string} url - Target URL
     * @param {Object} [data] - Request payload
     * @param {Object} [config] - Additional configuration overrides
     * @returns {Promise<Object>} Normalized response
     */
    async post(url, data = {}, config = {}) {
        return this.request({ ...config, url, method: 'POST', body: data });
    }

    /**
     * Executes a PUT request.
     * @param {string} url - Target URL
     * @param {Object} [data] - Request payload
     * @param {Object} [config] - Additional configuration overrides
     * @returns {Promise<Object>} Normalized response
     */
    async put(url, data = {}, config = {}) {
        return this.request({ ...config, url, method: 'PUT', body: data });
    }

    /**
     * Executes a DELETE request.
     * @param {string} url - Target URL
     * @param {Object} [config] - Additional configuration overrides
     * @returns {Promise<Object>} Normalized response
     */
    async delete(url, config = {}) {
        return this.request({ ...config, url, method: 'DELETE' });
    }

    /**
     * Core request execution method. Wraps fetch with normalization, caching, and retries.
     * @param {Object} config - Request configuration object
     * @returns {Promise<Object>} Standardized and normalized response
     */
    async request(config) {
        try {
            // 1. Merge defaults and initial normalization
            let mergedConfig = {
                ...config,
                headers: { ...this.defaultHeaders, ...(config.headers || {}) }
            };

            // Run Request Interceptors
            for (const interceptor of this.interceptors.request) {
                if (interceptor.onFulfilled) {
                    mergedConfig = await interceptor.onFulfilled(mergedConfig);
                }
            }

            // 2. Strict Deterministic Normalization
            const normalizedReq = this.normalizer.normalizeRequest(mergedConfig);
            const cacheKey = this.cache.generateKey(normalizedReq);

            // 3. Check Cache
            const useCache = config.cache !== false && this.enableCache && normalizedReq.method === 'GET';
            if (useCache) {
                const cachedResponse = this.cache.get(cacheKey);
                if (cachedResponse) {
                    return this._processResponseInterceptors({
                        ...cachedResponse,
                        _source: 'cache'
                    });
                }
            }

            // 4. Execute Request with Deduplication, Timeout, and Retries
            const executor = () => this._executeWithRetry(normalizedReq, config.retries ?? this.retries);
            const rawResponse = await this.queue.execute(cacheKey, executor);

            // 5. Response Normalization (Standardize format and remove non-determinism)
            const standardizedResponse = {
                status: rawResponse.status,
                statusText: rawResponse.statusText,
                headers: this._extractHeaders(rawResponse.headers),
                data: this.normalizer.normalizeResponse(rawResponse.data),
                _source: 'network'
            };

            // 6. Cache the normalized response
            if (useCache && standardizedResponse.status >= 200 && standardizedResponse.status < 300) {
                this.cache.set(cacheKey, standardizedResponse);
            }

            // 7. Run Response Interceptors and Return
            return this._processResponseInterceptors(standardizedResponse);

        } catch (error) {
            // Run Response Error Interceptors
            let handledError = error;
            for (const interceptor of this.interceptors.response) {
                if (interceptor.onRejected) {
                    try {
                        handledError = await interceptor.onRejected(handledError);
                    } catch (e) {
                        handledError = e;
                    }
                }
            }
            throw handledError;
        }
    }

    /**
     * Executes fetch with exponential backoff retries and timeout.
     * @private
     */
    async _executeWithRetry(normalizedReq, retriesLeft) {
        const attempt = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const fetchOptions = {
                method: normalizedReq.method,
                headers: normalizedReq.headers,
                signal: controller.signal
            };

            if (normalizedReq.body) {
                fetchOptions.body = typeof normalizedReq.body === 'string' 
                    ? normalizedReq.body 
                    : JSON.stringify(normalizedReq.body);
            }

            try {
                // Determine fetch implementation (browser vs node environment)
                const fetchImpl = typeof window !== 'undefined' ? window.fetch : global.fetch;
                if (!fetchImpl) {
                    throw new AdapterError('Fetch API is not available in this environment.');
                }

                const response = await fetchImpl(normalizedReq.url, fetchOptions);
                clearTimeout(timeoutId);

                let data;
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }

                if (!response.ok) {
                    throw new NetworkError(`HTTP Error: ${response.status} ${response.statusText}`, {
                        status: response.status,
                        data
                    });
                }

                return {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    data
                };

            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    throw new TimeoutError(`Request timed out after ${this.timeout}ms`, { url: normalizedReq.url });
                }
                throw error;
            }
        };

        try {
            return await attempt();
        } catch (error) {
            if (retriesLeft > 0 && this._isRetryableError(error)) {
                const delay = this.retryDelay * Math.pow(2, (this.retries - retriesLeft));
                await new Promise(resolve => setTimeout(resolve, delay));
                return this._executeWithRetry(normalizedReq, retriesLeft - 1);
            }
            throw error;
        }
    }

    /**
     * Determines if an error should trigger a retry.
     * @private
     */
    _isRetryableError(error) {
        if (error instanceof TimeoutError) return true;
        if (error instanceof NetworkError) {
            const status = error.context?.status;
            // Retry on network failures (no status) or 5xx server errors, or 429 Rate Limit
            return !status || status >= 500 || status === 429;
        }
        return false; // Don't retry 4xx errors (except 429) as they are deterministic client errors
    }

    /**
     * Extracts fetch Headers object into a plain JS object.
     * @private
     */
    _extractHeaders(fetchHeaders) {
        const headers = {};
        if (fetchHeaders && typeof fetchHeaders.forEach === 'function') {
            fetchHeaders.forEach((value, key) => {
                headers[key.toLowerCase()] = value;
            });
        }
        return headers;
    }

    /**
     * Sequentially executes response interceptors.
     * @private
     */
    async _processResponseInterceptors(response) {
        let processedResponse = response;
        for (const interceptor of this.interceptors.response) {
            if (interceptor.onFulfilled) {
                processedResponse = await interceptor.onFulfilled(processedResponse);
            }
        }
        return processedResponse;
    }

    /**
     * Manually clear the adapter's cache.
     */
    clearCache() {
        this.cache.clear();
    }
}

// ============================================================================
// DEFAULT EXPORT INSTANCE
// ============================================================================

/**
 * Pre-configured singleton instance of the ExternalCallAdapter for immediate use.
 * Configured for aggressive caching and determinism suitable for the Decide Engine.
 */
export const adapter = new ExternalCallAdapter({
    timeout: 15000,
    retries: 3,
    enableCache: true,
    cacheOptions: {
        ttl: 1000 * 60 * 15, // 15 minute cache TTL
        namespace: 'decide_engine_adapter_v1'
    }
});

export default adapter;