/**
 * @fileoverview Decide Engine Core - Sandboxed Execution Wrapper
 * @module core/sandbox
 * @description Provides highly secure, isolated execution environments for decision nodes.
 * Utilizes both Web Worker-based thread isolation (for heavy/untrusted code) and 
 * Proxy-based membrane isolation (for lightweight/synchronous code).
 * Prevents global state corruption, captures side-effects, and intercepts logs.
 * 
 * @author Antigravity Synthesis Orchestrator (v3.0.0-beast)
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// CUSTOM ERROR DEFINITIONS
// ============================================================================

/**
 * Base error class for all Sandbox-related exceptions.
 * @extends Error
 */
class SandboxError extends Error {
    /**
     * @param {string} message - Error description
     * @param {string} [nodeId] - Optional ID of the node that caused the error
     */
    constructor(message, nodeId = 'UNKNOWN_NODE') {
        super(`[SandboxError: ${nodeId}] ${message}`);
        this.name = 'SandboxError';
        this.nodeId = nodeId;
    }
}

/**
 * Error thrown when sandbox execution exceeds the permitted time limit.
 * @extends SandboxError
 */
class SandboxTimeoutError extends SandboxError {
    /**
     * @param {number} timeoutMs - The timeout limit in milliseconds
     * @param {string} [nodeId] - Optional ID of the node
     */
    constructor(timeoutMs, nodeId) {
        super(`Execution exceeded the maximum allowed time of ${timeoutMs}ms.`, nodeId);
        this.name = 'SandboxTimeoutError';
        this.timeoutMs = timeoutMs;
    }
}

/**
 * Error thrown when sandbox execution attempts an unauthorized operation.
 * @extends SandboxError
 */
class SandboxSecurityError extends SandboxError {
    constructor(operation, nodeId) {
        super(`Security violation: Attempted unauthorized operation '${operation}'.`, nodeId);
        this.name = 'SandboxSecurityError';
        this.operation = operation;
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely deeply clones an object, preventing reference leakage.
 * Uses structuredClone if available, falling back to JSON serialization.
 * @param {any} obj - The object to clone
 * @returns {any} The deeply cloned object
 */
const safeClone = (obj) => {
    if (obj === undefined) return undefined;
    try {
        if (typeof structuredClone === 'function') {
            return structuredClone(obj);
        }
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        throw new SandboxError(`Failed to clone state: ${e.message}`);
    }
};

/**
 * Generates a unique identifier for sandbox sessions.
 * @returns {string} UUID-like string
 */
const generateSessionId = () => {
    return 'sbx-' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// ============================================================================
// STATE MEMBRANE & SIDE-EFFECT TRACKER (PROXY BASED)
// ============================================================================

/**
 * Tracks mutations to an object without altering the original.
 * Creates a "membrane" using JavaScript Proxies.
 */
class SideEffectTracker {
    /**
     * @param {Object} baseState - The initial, read-only state.
     */
    constructor(baseState) {
        this.baseState = safeClone(baseState) || {};
        this.mutations = new Map();
        this.deletions = new Set();
        this.proxyCache = new WeakMap();
    }

    /**
     * Creates a deeply proxied version of the state.
     * @param {Object} target - The target object to proxy (defaults to baseState)
     * @param {string[]} path - The nested path of the current target
     * @returns {Proxy} The proxied object
     */
    createMembrane(target = this.baseState, path = []) {
        if (typeof target !== 'object' || target === null) {
            return target;
        }

        if (this.proxyCache.has(target)) {
            return this.proxyCache.get(target);
        }

        const handler = {
            get: (obj, prop) => {
                // Prevent access to potentially dangerous global scopes if they leak
                if (prop === 'constructor' || prop === '__proto__') return undefined;
                
                const currentPath = [...path, prop];
                const pathKey = currentPath.join('.');

                if (this.mutations.has(pathKey)) {
                    return this.mutations.get(pathKey);
                }
                if (this.deletions.has(pathKey)) {
                    return undefined;
                }

                const value = obj[prop];
                if (typeof value === 'object' && value !== null) {
                    return this.createMembrane(value, currentPath);
                }
                return value;
            },
            set: (obj, prop, value) => {
                const currentPath = [...path, prop];
                const pathKey = currentPath.join('.');
                
                this.mutations.set(pathKey, value);
                this.deletions.delete(pathKey);
                return true; // Pretend it succeeded to isolate side-effect
            },
            deleteProperty: (obj, prop) => {
                const currentPath = [...path, prop];
                const pathKey = currentPath.join('.');
                
                this.deletions.set(pathKey);
                this.mutations.delete(pathKey);
                return true;
            },
            has: (obj, prop) => {
                const currentPath = [...path, prop];
                const pathKey = currentPath.join('.');
                
                if (this.deletions.has(pathKey)) return false;
                if (this.mutations.has(pathKey)) return true;
                return prop in obj;
            },
            ownKeys: (obj) => {
                const keys = new Set(Reflect.ownKeys(obj));
                
                // Remove deleted keys
                for (const delPath of this.deletions) {
                    const parts = delPath.split('.');
                    if (parts.length === path.length + 1 && parts.slice(0, -1).join('.') === path.join('.')) {
                        keys.delete(parts[parts.length - 1]);
                    }
                }
                
                // Add mutated/added keys
                for (const mutPath of this.mutations.keys()) {
                    const parts = mutPath.split('.');
                    if (parts.length === path.length + 1 && parts.slice(0, -1).join('.') === path.join('.')) {
                        keys.add(parts[parts.length - 1]);
                    }
                }
                
                return Array.from(keys);
            }
        };

        const proxy = new Proxy(target, handler);
        this.proxyCache.set(target, proxy);
        return proxy;
    }

    /**
     * Extracts all recorded side-effects (mutations and deletions).
     * @returns {Object} Object containing mutated state diffs
     */
    getSideEffects() {
        const diff = {
            addedOrModified: {},
            deleted: Array.from(this.deletions)
        };

        for (const [path, value] of this.mutations.entries()) {
            // Reconstruct nested object diff
            const parts = path.split('.');
            let current = diff.addedOrModified;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) current[parts[i]] = {};
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = safeClone(value);
        }

        return diff;
    }
}

// ============================================================================
// WORKER-BASED SANDBOX (HARD ISOLATION)
// ============================================================================

/**
 * Template for the Web Worker execution environment.
 * Completely isolates the execution thread, intercepts console, and blocks DOM/Global access.
 */
const WORKER_TEMPLATE = `
self.onmessage = async function(e) {
    const { code, state, sessionId, nodeId } = e.data;
    
    // Intercept console to capture logs
    const logs = [];
    const originalConsole = { ...console };
    const createLogCapturer = (level) => (...args) => {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push({ level, message, timestamp: Date.now() });
    };

    console.log = createLogCapturer('log');
    console.info = createLogCapturer('info');
    console.warn = createLogCapturer('warn');
    console.error = createLogCapturer('error');
    console.debug = createLogCapturer('debug');

    // Prevent access to dangerous globals
    const restrictedGlobals = [
        'Worker', 'SharedWorker', 'XMLHttpRequest', 'fetch', 'WebSocket', 
        'indexedDB', 'localStorage', 'sessionStorage', 'caches', 'navigator'
    ];
    
    restrictedGlobals.forEach(g => {
        try {
            Object.defineProperty(self, g, {
                get: () => { throw new Error(\`Security violation: Access to \${g} is blocked in sandbox.\`); },
                configurable: false
            });
        } catch(err) { /* Ignore if already non-configurable */ }
    });

    let executionResult;
    let executionError = null;

    try {
        // Construct the execution function
        // We inject 'state' as a local variable, and run the user code
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        
        // The user code is wrapped in an async IIFE that is bound to the state
        const executor = new AsyncFunction('state', \`
            "use strict";
            // User code begins
            \${code}
            // User code ends
        \`);

        executionResult = await executor(state);
        
    } catch (error) {
        executionError = {
            message: error.message,
            stack: error.stack,
            name: error.name
        };
    } finally {
        // Restore console for internal worker use if needed
        Object.assign(console, originalConsole);
        
        // Post results back to main thread
        self.postMessage({
            sessionId,
            nodeId,
            result: executionResult,
            stateMutations: state, // State mutated by reference inside the worker
            logs,
            error: executionError
        });
    }
};
`;

/**
 * Manages execution of node logic inside an isolated Web Worker.
 */
class WorkerSandbox {
    constructor() {
        this.workerBlobUrl = null;
        this._initWorkerBlob();
    }

    /**
     * Initializes the Blob URL for the worker script.
     * @private
     */
    _initWorkerBlob() {
        if (typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
            const blob = new Blob([WORKER_TEMPLATE], { type: 'application/javascript' });
            this.workerBlobUrl = URL.createObjectURL(blob);
        }
    }

    /**
     * Executes code in a dedicated worker thread.
     * @param {string} code - The JavaScript code to execute
     * @param {Object} state - The initial state injected into the sandbox
     * @param {Object} options - Execution options
     * @param {string} options.nodeId - Identifier for the node
     * @param {number} options.timeoutMs - Maximum execution time in milliseconds
     * @returns {Promise<Object>} Execution results including state mutations and logs
     */
    async execute(code, state, { nodeId = 'ANONYMOUS_NODE', timeoutMs = 5000 } = {}) {
        if (!this.workerBlobUrl) {
            throw new SandboxError('Web Workers are not supported in this environment.', nodeId);
        }

        return new Promise((resolve, reject) => {
            const worker = new Worker(this.workerBlobUrl);
            const sessionId = generateSessionId();
            let timeoutId;

            const cleanup = () => {
                clearTimeout(timeoutId);
                worker.terminate();
            };

            worker.onmessage = (e) => {
                cleanup();
                const { result, stateMutations, logs, error, sessionId: returnedSessionId } = e.data;
                
                if (returnedSessionId !== sessionId) return;

                if (error) {
                    const err = new SandboxError(`Execution failed: ${error.message}`, nodeId);
                    err.stack = error.stack;
                    err.originalName = error.name;
                    reject(err);
                } else {
                    resolve({
                        result,
                        finalState: stateMutations,
                        logs,
                        executionTime: Date.now() - startTime
                    });
                }
            };

            worker.onerror = (err) => {
                cleanup();
                reject(new SandboxError(`Worker error: ${err.message}`, nodeId));
            };

            // Set hard timeout to prevent infinite loops (Halting Problem mitigation)
            timeoutId = setTimeout(() => {
                cleanup();
                reject(new SandboxTimeoutError(timeoutMs, nodeId));
            }, timeoutMs);

            const startTime = Date.now();
            
            // Pass deeply cloned state to prevent main thread reference leakage
            worker.postMessage({
                code,
                state: safeClone(state),
                sessionId,
                nodeId
            });
        });
    }

    /**
     * Cleans up the Blob URL to prevent memory leaks.
     */
    destroy() {
        if (this.workerBlobUrl && typeof URL !== 'undefined') {
            URL.revokeObjectURL(this.workerBlobUrl);
            this.workerBlobUrl = null;
        }
    }
}

// ============================================================================
// PROXY-BASED SANDBOX (SYNCHRONOUS / LIGHTWEIGHT ISOLATION)
// ============================================================================

/**
 * Manages execution of node logic using a Proxy-based membrane.
 * Runs on the main thread but restricts scope using `with` and Proxies.
 */
class ProxySandbox {
    /**
     * Executes code in a proxied environment.
     * @param {string} code - The JavaScript code to execute
     * @param {Object} state - The initial state injected into the sandbox
     * @param {Object} options - Execution options
     * @param {string} options.nodeId - Identifier for the node
     * @returns {Object} Execution results including side-effects and logs
     */
    execute(code, state, { nodeId = 'ANONYMOUS_NODE' } = {}) {
        const startTime = Date.now();
        const tracker = new SideEffectTracker(state);
        const proxiedState = tracker.createMembrane();
        
        const logs = [];
        const mockConsole = {
            log: (...args) => logs.push({ level: 'log', message: args.join(' '), timestamp: Date.now() }),
            info: (...args) => logs.push({ level: 'info', message: args.join(' '), timestamp: Date.now() }),
            warn: (...args) => logs.push({ level: 'warn', message: args.join(' '), timestamp: Date.now() }),
            error: (...args) => logs.push({ level: 'error', message: args.join(' '), timestamp: Date.now() }),
            debug: (...args) => logs.push({ level: 'debug', message: args.join(' '), timestamp: Date.now() })
        };

        // Create the global sandbox context
        const sandboxContext = {
            state: proxiedState,
            console: mockConsole,
            Math: Math,
            Date: Date,
            JSON: JSON,
            parseInt: parseInt,
            parseFloat: parseFloat,
            isNaN: isNaN,
            isFinite: isFinite,
            decodeURI: decodeURI,
            decodeURIComponent: decodeURIComponent,
            encodeURI: encodeURI,
            encodeURIComponent: encodeURIComponent,
            // Explicitly undefined to block access
            window: undefined,
            document: undefined,
            globalThis: undefined,
            fetch: undefined,
            XMLHttpRequest: undefined,
            eval: undefined,
            Function: undefined
        };

        // The trap prevents escaping the 'with' block by always claiming properties exist
        const contextProxy = new Proxy(sandboxContext, {
            has: (target, key) => true,
            get: (target, key) => {
                if (key === Symbol.unscopables) return undefined;
                return target[key];
            },
            set: (target, key, value) => {
                // If they try to set a global, we capture it as a side effect on the context
                target[key] = value;
                return true;
            }
        });

        let result;
        let executionError = null;

        try {
            // Using 'new Function' with 'with' creates a lexical boundary
            // where all variable lookups hit the contextProxy first.
            const executor = new Function('sandbox', `
                with(sandbox) {
                    return (function() {
                        "use strict";
                        ${code}
                    })();
                }
            `);

            result = executor(contextProxy);
            
        } catch (error) {
            executionError = new SandboxError(`Proxy execution failed: ${error.message}`, nodeId);
            executionError.stack = error.stack;
        }

        return {
            result,
            sideEffects: tracker.getSideEffects(),
            logs,
            error: executionError,
            executionTime: Date.now() - startTime
        };
    }
}

// ============================================================================
// MAIN ORCHESTRATOR: NODE EXECUTION WRAPPER
// ============================================================================

/**
 * The primary interface for executing Node logic within the Decide Engine.
 * Automatically chooses the best isolation strategy based on configuration.
 */
class NodeExecutionWrapper {
    /**
     * @param {Object} config - Global sandbox configuration
     * @param {boolean} [config.useWorkers=true] - Prefer Web Workers for hard isolation
     * @param {number} [config.defaultTimeout=5000] - Default max execution time
     */
    constructor(config = {}) {
        this.useWorkers = config.useWorkers !== false;
        this.defaultTimeout = config.defaultTimeout || 5000;
        
        if (this.useWorkers) {
            try {
                this.workerPool = new WorkerSandbox();
            } catch (e) {
                console.warn('[Decide Engine] Web Workers unavailable, falling back to Proxy Membrane sandbox.', e);
                this.useWorkers = false;
            }
        }
        
        this.proxySandbox = new ProxySandbox();
    }

    /**
     * Executes the logic of a specific decision node safely.
     * 
     * @param {Object} node - The node definition
     * @param {string} node.id - Unique node identifier
     * @param {string} node.logic - The JavaScript code string to execute
     * @param {Object} context - The shared system state/context
     * @param {Object} [options] - Execution overrides
     * @param {boolean} [options.forceSync=false] - Force Proxy sandbox instead of Worker
     * @param {number} [options.timeout] - Specific timeout for this node
     * 
     * @returns {Promise<Object>} The execution envelope containing results and safely captured side-effects
     */
    async executeNode(node, context, options = {}) {
        if (!node || !node.logic) {
            throw new SandboxError('Invalid node definition: missing logic.', node?.id);
        }

        const nodeId = node.id || 'UNKNOWN_NODE';
        const timeoutMs = options.timeout || this.defaultTimeout;
        const forceSync = options.forceSync || false;

        const executionRecord = {
            nodeId,
            timestamp: new Date().toISOString(),
            success: false,
            result: null,
            stateDiff: null,
            logs: [],
            error: null,
            executionTimeMs: 0,
            isolationMethod: ''
        };

        try {
            if (this.useWorkers && !forceSync) {
                // Hard Isolation (Async/Worker)
                executionRecord.isolationMethod = 'WebWorker';
                const output = await this.workerPool.execute(node.logic, context, { nodeId, timeoutMs });
                
                executionRecord.success = true;
                executionRecord.result = output.result;
                // For workers, we compute a basic diff or just return the mutated state
                // Since the state was cloned, the global state is untouched.
                executionRecord.stateDiff = { modifiedState: output.finalState }; 
                executionRecord.logs = output.logs;
                executionRecord.executionTimeMs = output.executionTime;

            } else {
                // Soft Isolation (Sync/Proxy Membrane)
                executionRecord.isolationMethod = 'ProxyMembrane';
                const output = this.proxySandbox.execute(node.logic, context, { nodeId });
                
                if (output.error) throw output.error;

                executionRecord.success = true;
                executionRecord.result = output.result;
                executionRecord.stateDiff = output.sideEffects;
                executionRecord.logs = output.logs;
                executionRecord.executionTimeMs = output.executionTime;
            }
        } catch (error) {
            executionRecord.success = false;
            executionRecord.error = {
                name: error.name || 'Error',
                message: error.message,
                stack: error.stack
            };
        }

        return executionRecord;
    }

    /**
     * Applies verified side-effects back to the main global state.
     * Should only be called after consensus/verification in the Decide Engine.
     * 
     * @param {Object} mainState - The actual global state object to mutate
     * @param {Object} stateDiff - The diff object generated by the sandbox
     */
    applyVerifiedSideEffects(mainState, stateDiff) {
        if (!stateDiff) return;

        // Apply Proxy Membrane Diff
        if (stateDiff.addedOrModified || stateDiff.deleted) {
            // Process additions and modifications
            const applyDeep = (target, source) => {
                for (const key in source) {
                    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        if (!target[key]) target[key] = {};
                        applyDeep(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            };
            
            if (stateDiff.addedOrModified) {
                applyDeep(mainState, stateDiff.addedOrModified);
            }

            // Process deletions
            if (Array.isArray(stateDiff.deleted)) {
                for (const path of stateDiff.deleted) {
                    const parts = path.split('.');
                    let current = mainState;
                    for (let i = 0; i < parts.length - 1; i++) {
                        if (current[parts[i]] === undefined) break;
                        current = current[parts[i]];
                    }
                    if (current) {
                        delete current[parts[parts.length - 1]];
                    }
                }
            }
        } 
        // Apply Worker Full-State Override (Merge)
        else if (stateDiff.modifiedState) {
            Object.assign(mainState, stateDiff.modifiedState);
        }
    }

    /**
     * Destroys underlying resources (like Worker Blob URLs) to free memory.
     */
    teardown() {
        if (this.workerPool) {
            this.workerPool.destroy();
        }
    }
}

// Export for browser (attach to window/global if modules aren't used, or module.exports)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NodeExecutionWrapper, SandboxError, SandboxTimeoutError };
} else if (typeof window !== 'undefined') {
    window.DecideEngine = window.DecideEngine || {};
    window.DecideEngine.NodeExecutionWrapper = NodeExecutionWrapper;
    window.DecideEngine.SandboxError = SandboxError;
}