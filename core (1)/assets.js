/**
 * @fileoverview Decide Engine Core Asset Management System
 * @module core/assets
 * @description Provides a robust, high-performance asset management system for AAA-quality 
 * web rendering pipelines. Features include priority-based loading, concurrent request 
 * limits, LRU caching, exponential backoff retries, and specialized handlers for 
 * textures, meshes, and materials.
 * 
 * Designed for seamless integration with WebGL/WebGPU rendering contexts.
 */

'use strict';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

/**
 * @typedef {Object} AssetManagerOptions
 * @property {number} [maxConcurrentLoads=4] Maximum number of parallel network requests.
 * @property {number} [cacheSize=1000] Maximum number of items in the LRU cache.
 * @property {number} [maxRetries=3] Number of times to retry a failed download.
 * @property {number} [retryDelay=1000] Base delay in ms for exponential backoff.
 * @property {string} [basePath=''] Base URL path for all asset requests.
 * @property {boolean} [useImageBitmap=true] Whether to decode images off main thread using ImageBitmap.
 */

/**
 * @typedef {Object} AssetLoadOptions
 * @property {number} [priority=0] Higher numbers load first.
 * @property {boolean} [cache=true] Whether to store the result in the cache.
 * @property {boolean} [forceReload=false] Bypass cache and force network request.
 * @property {string} [type] Explicitly define the asset type (overrides extension inference).
 * @property {Object} [headers] Custom HTTP headers for the fetch request.
 * @property {AbortSignal} [signal] External abort signal for cancellation.
 */

/**
 * @typedef {Object} AssetManifestItem
 * @property {string} id Unique identifier for the asset.
 * @property {string} url The URL to load the asset from.
 * @property {string} type The type of asset ('texture', 'mesh', 'material', 'audio', 'json', 'binary').
 * @property {AssetLoadOptions} [options] Specific options for this asset.
 */

/**
 * Enum for Asset Types
 * @readonly
 * @enum {string}
 */
const AssetType = {
    TEXTURE: 'texture',
    MESH: 'mesh',
    MATERIAL: 'material',
    AUDIO: 'audio',
    JSON: 'json',
    TEXT: 'text',
    BINARY: 'binary',
    UNKNOWN: 'unknown'
};

/**
 * Enum for Asset Load States
 * @readonly
 * @enum {number}
 */
const AssetState = {
    PENDING: 0,
    LOADING: 1,
    LOADED: 2,
    FAILED: 3,
    ABORTED: 4
};

// ============================================================================
// UTILITIES & CORE CLASSES
// ============================================================================

/**
 * Custom Error class for Asset Management failures.
 */
class AssetError extends Error {
    /**
     * @param {string} message 
     * @param {string} assetId 
     * @param {string} url 
     * @param {number} [statusCode]
     */
    constructor(message, assetId, url, statusCode = 0) {
        super(`[AssetError] ${message} (ID: ${assetId}, URL: ${url})`);
        this.name = 'AssetError';
        this.assetId = assetId;
        this.url = url;
        this.statusCode = statusCode;
    }
}

/**
 * High-performance Event Emitter for tracking load progress and lifecycle events.
 */
class EventEmitter {
    constructor() {
        /** @type {Map<string, Set<Function>>} */
        this._listeners = new Map();
    }

    /**
     * @param {string} event 
     * @param {Function} callback 
     */
    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event).add(callback);
    }

    /**
     * @param {string} event 
     * @param {Function} callback 
     */
    off(event, callback) {
        const callbacks = this._listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this._listeners.delete(event);
            }
        }
    }

    /**
     * @param {string} event 
     * @param {Function} callback 
     */
    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        this.on(event, wrapper);
    }

    /**
     * @param {string} event 
     * @param {...any} args 
     */
    emit(event, ...args) {
        const callbacks = this._listeners.get(event);
        if (callbacks) {
            for (const callback of callbacks) {
                try {
                    callback(...args);
                } catch (err) {
                    console.error(`[EventEmitter] Error in event listener for ${event}:`, err);
                }
            }
        }
    }

    clearListeners() {
        this._listeners.clear();
    }
}

/**
 * Least Recently Used (LRU) Cache to manage memory efficiently for AAA assets.
 */
class LRUCache {
    /**
     * @param {number} capacity 
     * @param {Function} [onEvict] Callback fired when an item is evicted (useful for WebGL disposal).
     */
    constructor(capacity, onEvict = null) {
        this.capacity = capacity;
        this.onEvict = onEvict;
        /** @type {Map<string, any>} */
        this.cache = new Map();
    }

    /**
     * @param {string} key 
     * @returns {any|undefined}
     */
    get(key) {
        if (!this.cache.has(key)) return undefined;
        // Refresh position
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    /**
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Evict oldest (first item in Map)
            const oldestKey = this.cache.keys().next().value;
            const evictedValue = this.cache.get(oldestKey);
            this.cache.delete(oldestKey);
            if (this.onEvict) {
                this.onEvict(oldestKey, evictedValue);
            }
        }
        this.cache.set(key, value);
    }

    /**
     * @param {string} key 
     */
    delete(key) {
        if (this.cache.has(key)) {
            const value = this.cache.get(key);
            this.cache.delete(key);
            if (this.onEvict) {
                this.onEvict(key, value);
            }
        }
    }

    clear() {
        if (this.onEvict) {
            for (const [key, value] of this.cache.entries()) {
                this.onEvict(key, value);
            }
        }
        this.cache.clear();
    }

    /**
     * @returns {number}
     */
    get size() {
        return this.cache.size;
    }
}

// ============================================================================
// LOADERS
// ============================================================================

/**
 * Base class for specific asset type loaders.
 * @abstract
 */
class BaseLoader {
    /**
     * @param {AssetManager} manager 
     */
    constructor(manager) {
        this.manager = manager;
    }

    /**
     * @abstract
     * @param {string} url 
     * @param {AssetLoadOptions} options 
     * @returns {Promise<any>}
     */
    async load(url, options) {
        throw new Error('Not implemented');
    }

    /**
     * Helper for basic fetch with progress and abort support.
     * @protected
     * @param {string} url 
     * @param {AssetLoadOptions} options 
     * @param {string} responseType 'arrayBuffer', 'json', 'text', 'blob'
     * @returns {Promise<any>}
     */
    async _fetch(url, options, responseType = 'arrayBuffer') {
        const response = await fetch(url, {
            headers: options.headers || {},
            signal: options.signal
        });

        if (!response.ok) {
            throw new AssetError(`HTTP Error ${response.status}: ${response.statusText}`, 'unknown', url, response.status);
        }

        // Handle progress if Content-Length is available
        const contentLength = response.headers.get('content-length');
        if (!contentLength) {
            return await response[responseType]();
        }

        const total = parseInt(contentLength, 10);
        let loaded = 0;

        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            chunks.push(value);
            loaded += value.length;

            // Emit progress event globally via manager
            this.manager.emit('progress', { url, loaded, total, percent: loaded / total });
        }

        // Reconstruct stream
        const allChunks = new Uint8Array(loaded);
        let position = 0;
        for (const chunk of chunks) {
            allChunks.set(chunk, position);
            position += chunk.length;
        }

        if (responseType === 'arrayBuffer') return allChunks.buffer;
        if (responseType === 'text') return new TextDecoder("utf-8").decode(allChunks);
        if (responseType === 'json') return JSON.parse(new TextDecoder("utf-8").decode(allChunks));
        if (responseType === 'blob') {
            const mime = response.headers.get('content-type') || 'application/octet-stream';
            return new Blob([allChunks], { type: mime });
        }
        
        return allChunks.buffer;
    }
}

/**
 * Specialized loader for Textures (Images, KTX, DDS - currently handles standard Images).
 */
class TextureLoader extends BaseLoader {
    async load(url, options) {
        if (this.manager.options.useImageBitmap && typeof createImageBitmap !== 'undefined') {
            const blob = await this._fetch(url, options, 'blob');
            // Decode off main thread
            return await createImageBitmap(blob, {
                premultiplyAlpha: 'none',
                colorSpaceConversion: 'default'
            });
        } else {
            // Fallback to standard Image object
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                if (options.signal) {
                    options.signal.addEventListener('abort', () => {
                        img.src = '';
                        reject(new AssetError('Aborted', 'unknown', url));
                    });
                }
                img.onload = () => resolve(img);
                img.onerror = (e) => reject(new AssetError('Image load failed', 'unknown', url));
                img.src = url;
            });
        }
    }
}

/**
 * Specialized loader for Meshes (GLTF/GLB/OBJ).
 * Returns ArrayBuffer or JSON depending on extension, ready for the 3D engine to parse.
 */
class MeshLoader extends BaseLoader {
    async load(url, options) {
        const isJSON = url.toLowerCase().endsWith('.gltf');
        const data = await this._fetch(url, options, isJSON ? 'json' : 'arrayBuffer');
        
        // In a full AAA pipeline, this is where we would pass the ArrayBuffer to a Web Worker
        // for Draco decoding, mesh decompression, or ASTC texture extraction.
        // For this core asset manager, we provide the raw parsed data to the rendering pipeline.
        return {
            type: isJSON ? 'gltf-json' : 'gltf-binary',
            data: data,
            url: url
        };
    }
}

/**
 * Specialized loader for Materials (JSON descriptors).
 */
class MaterialLoader extends BaseLoader {
    async load(url, options) {
        const data = await this._fetch(url, options, 'json');
        // Material definitions usually require engine-specific parsing.
        return data;
    }
}

/**
 * Specialized loader for Audio files.
 */
class AudioLoader extends BaseLoader {
    async load(url, options) {
        const arrayBuffer = await this._fetch(url, options, 'arrayBuffer');
        // Requires AudioContext to decode, returning ArrayBuffer for the audio engine.
        return arrayBuffer;
    }
}

/**
 * Generic JSON Loader.
 */
class JSONLoader extends BaseLoader {
    async load(url, options) {
        return await this._fetch(url, options, 'json');
    }
}

/**
 * Generic Binary Loader.
 */
class BinaryLoader extends BaseLoader {
    async load(url, options) {
        return await this._fetch(url, options, 'arrayBuffer');
    }
}

// ============================================================================
// CORE ASSET MANAGER
// ============================================================================

/**
 * The Antigravity Synthesis Orchestrator - Core Asset Manager.
 * Handles the complete lifecycle of game/engine assets.
 */
class AssetManager extends EventEmitter {
    /**
     * @param {AssetManagerOptions} [options={}]
     */
    constructor(options = {}) {
        super();
        
        /** @type {AssetManagerOptions} */
        this.options = {
            maxConcurrentLoads: 6,
            cacheSize: 2000,
            maxRetries: 3,
            retryDelay: 1000,
            basePath: '',
            useImageBitmap: true,
            ...options
        };

        // Core State
        /** @type {LRUCache} */
        this.cache = new LRUCache(this.options.cacheSize, this._onAssetEvicted.bind(this));
        
        /** @type {Map<string, Object>} */
        this.registry = new Map(); // Metadata for all known assets
        
        /** @type {Set<string>} */
        this.activeRequests = new Set();
        
        /** @type {Array<Object>} */
        this.queue = [];

        // Loaders Map
        /** @type {Map<string, BaseLoader>} */
        this.loaders = new Map();
        
        // Initialize default loaders
        this.registerLoader(AssetType.TEXTURE, new TextureLoader(this));
        this.registerLoader(AssetType.MESH, new MeshLoader(this));
        this.registerLoader(AssetType.MATERIAL, new MaterialLoader(this));
        this.registerLoader(AssetType.AUDIO, new AudioLoader(this));
        this.registerLoader(AssetType.JSON, new JSONLoader(this));
        this.registerLoader(AssetType.BINARY, new BinaryLoader(this));
        
        // Type Inference Map
        this.extensionMap = {
            'png': AssetType.TEXTURE,
            'jpg': AssetType.TEXTURE,
            'jpeg': AssetType.TEXTURE,
            'webp': AssetType.TEXTURE,
            'ktx2': AssetType.TEXTURE,
            'gltf': AssetType.MESH,
            'glb': AssetType.MESH,
            'obj': AssetType.MESH,
            'mat': AssetType.MATERIAL,
            'json': AssetType.JSON,
            'mp3': AssetType.AUDIO,
            'wav': AssetType.AUDIO,
            'ogg': AssetType.AUDIO,
            'bin': AssetType.BINARY,
            'wasm': AssetType.BINARY
        };

        // Subsystems
        this.textures = new SubSystemManager(this, AssetType.TEXTURE);
        this.meshes = new SubSystemManager(this, AssetType.MESH);
        this.materials = new SubSystemManager(this, AssetType.MATERIAL);
    }

    /**
     * Register a custom loader for a specific asset type.
     * @param {string} type 
     * @param {BaseLoader} loader 
     */
    registerLoader(type, loader) {
        this.loaders.set(type, loader);
    }

    /**
     * Maps a file extension to an asset type.
     * @param {string} extension 
     * @param {string} type 
     */
    registerExtension(extension, type) {
        this.extensionMap[extension.toLowerCase()] = type;
    }

    /**
     * Infers asset type from URL.
     * @param {string} url 
     * @returns {string}
     */
    _inferType(url) {
        const cleanUrl = url.split('?')[0].split('#')[0];
        const ext = cleanUrl.split('.').pop().toLowerCase();
        return this.extensionMap[ext] || AssetType.UNKNOWN;
    }

    /**
     * Computes the final URL based on basePath configuration.
     * @param {string} url 
     * @returns {string}
     */
    _resolveUrl(url) {
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        return `${this.options.basePath}${url}`.replace(/([^:]\/)\/+/g, "$1");
    }

    /**
     * Internal handler for LRU cache evictions.
     * @param {string} id 
     * @param {any} asset 
     */
    _onAssetEvicted(id, asset) {
        this.emit('evicted', { id, asset });
        
        // Attempt to cleanup memory
        if (asset) {
            // If it's an ImageBitmap, close it
            if (typeof ImageBitmap !== 'undefined' && asset instanceof ImageBitmap) {
                asset.close();
            }
            // If the asset has a dispose method (like Three.js objects), call it
            if (typeof asset.dispose === 'function') {
                try {
                    asset.dispose();
                } catch (e) {
                    console.warn(`[AssetManager] Error disposing asset ${id}:`, e);
                }
            }
        }
    }

    /**
     * Retrieves an asset from the cache.
     * @param {string} id 
     * @returns {any|null}
     */
    get(id) {
        return this.cache.get(id) || null;
    }

    /**
     * Checks if an asset exists in the cache.
     * @param {string} id 
     * @returns {boolean}
     */
    has(id) {
        return this.cache.cache.has(id); // direct check without triggering LRU update
    }

    /**
     * Manually adds an asset to the cache.
     * @param {string} id 
     * @param {any} data 
     * @param {string} [type=AssetType.UNKNOWN] 
     */
    set(id, data, type = AssetType.UNKNOWN) {
        this.cache.set(id, data);
        this.registry.set(id, { id, type, state: AssetState.LOADED });
    }

    /**
     * Disposes and removes an asset from the manager.
     * @param {string} id 
     */
    dispose(id) {
        this.cache.delete(id);
        this.registry.delete(id);
    }

    /**
     * Clears all assets and aborts pending requests.
     */
    clear() {
        this.cache.clear();
        this.registry.clear();
        this.queue = [];
        // Active requests would need their AbortControllers signaled here in a full implementation
        this.activeRequests.clear();
    }

    /**
     * Load a single asset.
     * @param {string} id 
     * @param {string} url 
     * @param {AssetLoadOptions} [options={}] 
     * @returns {Promise<any>}
     */
    async load(id, url, options = {}) {
        const fullUrl = this._resolveUrl(url);
        const type = options.type || this._inferType(fullUrl);
        const cacheEnabled = options.cache !== false;

        if (cacheEnabled && !options.forceReload) {
            const cached = this.get(id);
            if (cached) return cached;
        }

        // If already loading, we should ideally wait for the existing promise.
        // For simplicity, we queue a new request or return the existing promise if tracked.
        
        return new Promise((resolve, reject) => {
            const request = {
                id,
                url: fullUrl,
                type,
                options: { priority: 0, ...options },
                resolve,
                reject,
                retries: 0
            };

            this.registry.set(id, { id, url: fullUrl, type, state: AssetState.PENDING });
            this.queue.push(request);
            
            // Sort queue by priority (highest first)
            this.queue.sort((a, b) => b.options.priority - a.options.priority);
            
            this._processQueue();
        });
    }

    /**
     * Load a batch of assets based on a manifest.
     * @param {Array<AssetManifestItem>} manifest 
     * @returns {Promise<Object<string, any>>} A promise that resolves with an object mapping IDs to loaded assets.
     */
    async loadBatch(manifest) {
        const promises = manifest.map(item => 
            this.load(item.id, item.url, { type: item.type, ...item.options })
                .then(data => ({ id: item.id, data, error: null }))
                .catch(error => ({ id: item.id, data: null, error }))
        );

        const results = await Promise.all(promises);
        
        const batchResult = {};
        const errors = [];

        for (const res of results) {
            if (res.error) {
                errors.push(res);
            } else {
                batchResult[res.id] = res.data;
            }
        }

        if (errors.length > 0) {
            this.emit('batchError', errors);
            // Depending on strictness, we might throw here. 
            // Returning partial success is usually better for AAA engines.
        }

        return batchResult;
    }

    /**
     * Internal method to process the load queue.
     * @private
     */
    async _processQueue() {
        if (this.queue.length === 0 || this.activeRequests.size >= this.options.maxConcurrentLoads) {
            return;
        }

        const request = this.queue.shift();
        this.activeRequests.add(request.id);
        
        const metadata = this.registry.get(request.id);
        if (metadata) metadata.state = AssetState.LOADING;

        this.emit('loadStart', { id: request.id, url: request.url });

        try {
            const loader = this.loaders.get(request.type);
            if (!loader) {
                throw new AssetError(`No loader registered for type: ${request.type}`, request.id, request.url);
            }

            const data = await loader.load(request.url, request.options);
            
            if (request.options.cache !== false) {
                this.cache.set(request.id, data);
            }

            if (metadata) metadata.state = AssetState.LOADED;
            
            this.emit('loadSuccess', { id: request.id, url: request.url, data });
            request.resolve(data);

        } catch (error) {
            if (error.name === 'AbortError') {
                if (metadata) metadata.state = AssetState.ABORTED;
                request.reject(error);
                this.emit('loadAbort', { id: request.id, url: request.url });
            } else if (request.retries < this.options.maxRetries) {
                request.retries++;
                const delay = this.options.retryDelay * Math.pow(2, request.retries - 1);
                console.warn(`[AssetManager] Load failed for ${request.id}. Retrying (${request.retries}/${this.options.maxRetries}) in ${delay}ms...`);
                
                setTimeout(() => {
                    this.queue.push(request);
                    this.queue.sort((a, b) => b.options.priority - a.options.priority);
                    this._processQueue();
                }, delay);
                
                this.activeRequests.delete(request.id);
                return; // Exit early so we don't reject yet
            } else {
                if (metadata) metadata.state = AssetState.FAILED;
                this.emit('loadError', { id: request.id, url: request.url, error });
                request.reject(error);
            }
        }

        this.activeRequests.delete(request.id);
        
        // Process next items in queue
        this._processQueue();
    }

    /**
     * Generates a structural report of the current asset cache.
     * @returns {Object}
     */
    getStats() {
        let textureCount = 0;
        let meshCount = 0;
        let materialCount = 0;
        let otherCount = 0;

        for (const meta of this.registry.values()) {
            if (meta.state === AssetState.LOADED) {
                switch(meta.type) {
                    case AssetType.TEXTURE: textureCount++; break;
                    case AssetType.MESH: meshCount++; break;
                    case AssetType.MATERIAL: materialCount++; break;
                    default: otherCount++; break;
                }
            }
        }

        return {
            cacheSize: this.cache.size,
            cacheCapacity: this.cache.capacity,
            activeRequests: this.activeRequests.size,
            queuedRequests: this.queue.length,
            breakdown: {
                textures: textureCount,
                meshes: meshCount,
                materials: materialCount,
                others: otherCount
            }
        };
    }
}

// ============================================================================
// SUBSYSTEM MANAGERS (Syntactic Sugar for specific asset types)
// ============================================================================

/**
 * Helper class to provide a cleaner API for specific asset types.
 */
class SubSystemManager {
    /**
     * @param {AssetManager} manager 
     * @param {string} type 
     */
    constructor(manager, type) {
        this.manager = manager;
        this.type = type;
    }

    /**
     * @param {string} id 
     * @param {string} url 
     * @param {AssetLoadOptions} [options={}] 
     * @returns {Promise<any>}
     */
    load(id, url, options = {}) {
        options.type = this.type;
        return this.manager.load(id, url, options);
    }

    /**
     * @param {string} id 
     * @returns {any|null}
     */
    get(id) {
        const meta = this.manager.registry.get(id);
        if (meta && meta.type === this.type) {
            return this.manager.get(id);
        }
        return null;
    }

    /**
     * @param {string} id 
     */
    dispose(id) {
        const meta = this.manager.registry.get(id);
        if (meta && meta.type === this.type) {
            this.manager.dispose(id);
        }
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    AssetManager,
    AssetType,
    AssetState,
    AssetError,
    BaseLoader,
    TextureLoader,
    MeshLoader,
    MaterialLoader,
    AudioLoader,
    JSONLoader,
    BinaryLoader
};