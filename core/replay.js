/**
 * @fileoverview Decide Engine - Execution State Persistence and Replay System
 * @module core/replay
 * @description Provides a comprehensive, deterministic execution recorder and replay engine.
 * Ensures all tool chains and decision workflows are reproducible, debuggable, and verifiable.
 * Features include IndexedDB persistence, cryptographic state hashing, drift detection, 
 * and deep execution inspection.
 * 
 * @version 3.0.0-beast
 * @author Antigravity Beast-Mode
 */

// ============================================================================
// UTILITIES & HELPERS
// ============================================================================

/**
 * Generates a version 4 UUID.
 * @returns {string} A valid UUIDv4 string.
 */
function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Performs a deep equality check between two values.
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} True if deeply equal, false otherwise.
 */
function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || typeof a !== 'object' || b == null || typeof b !== 'object') return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (let key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }

    return true;
}

/**
 * Performs a deep clone of a serializable object.
 * @param {*} obj - The object to clone.
 * @returns {*} The cloned object.
 */
function deepClone(obj) {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Generates a SHA-256 hash of a serializable object to detect state tampering or drift.
 * @param {*} obj - The object to hash.
 * @returns {Promise<string>} The hex representation of the SHA-256 hash.
 */
async function generateStateHash(obj) {
    if (!crypto || !crypto.subtle) {
        console.warn('Crypto.subtle API not available. Falling back to string length hash.');
        return `fallback-hash-${JSON.stringify(obj).length}`;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(obj || {}));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

/**
 * Custom error class for Replay System specific errors.
 */
export class ReplayError extends Error {
    /**
     * @param {string} message - Error description.
     * @param {string} code - Error code for programmatic handling.
     * @param {Object} [details] - Additional contextual data.
     */
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'ReplayError';
        this.code = code;
        this.details = details;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ReplayError);
        }
    }
}

// ============================================================================
// DATABASE MANAGER (IndexedDB)
// ============================================================================

/**
 * Manages persistence of execution logs using IndexedDB.
 */
class ReplayDatabaseManager {
    constructor() {
        this.dbName = 'DecideEngineReplayDB';
        this.dbVersion = 1;
        this.db = null;
        this.initPromise = this._initDB();
    }

    /**
     * Initializes the IndexedDB connection and schema.
     * @returns {Promise<void>}
     * @private
     */
    _initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store for high-level execution sessions
                if (!db.objectStoreNames.contains('executions')) {
                    const execStore = db.createObjectStore('executions', { keyPath: 'id' });
                    execStore.createIndex('timestamp', 'timestamp', { unique: false });
                    execStore.createIndex('status', 'status', { unique: false });
                    execStore.createIndex('workflowName', 'workflowName', { unique: false });
                }

                // Store for individual execution steps within a session
                if (!db.objectStoreNames.contains('steps')) {
                    const stepStore = db.createObjectStore('steps', { keyPath: 'id' });
                    stepStore.createIndex('executionId', 'executionId', { unique: false });
                    stepStore.createIndex('sequenceNumber', 'sequenceNumber', { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject(new ReplayError('Failed to initialize Replay IndexedDB', 'DB_INIT_FAILED', { error: event.target.error }));
            };
        });
    }

    /**
     * Ensures the database is initialized before performing operations.
     * @returns {Promise<void>}
     */
    async ensureReady() {
        await this.initPromise;
        if (!this.db) throw new ReplayError('Database not ready', 'DB_NOT_READY');
    }

    /**
     * Saves an execution record.
     * @param {Object} execution - The execution record to save.
     * @returns {Promise<void>}
     */
    async saveExecution(execution) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['executions'], 'readwrite');
            const store = transaction.objectStore('executions');
            const request = store.put(execution);
            
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(new ReplayError('Failed to save execution', 'DB_SAVE_EXEC_FAILED', { error: e.target.error }));
        });
    }

    /**
     * Saves an individual execution step.
     * @param {Object} step - The step record to save.
     * @returns {Promise<void>}
     */
    async saveStep(step) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['steps'], 'readwrite');
            const store = transaction.objectStore('steps');
            const request = store.put(step);
            
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(new ReplayError('Failed to save step', 'DB_SAVE_STEP_FAILED', { error: e.target.error }));
        });
    }

    /**
     * Retrieves an execution record by ID.
     * @param {string} id - The execution ID.
     * @returns {Promise<Object>}
     */
    async getExecution(id) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['executions'], 'readonly');
            const store = transaction.objectStore('executions');
            const request = store.get(id);
            
            request.onsuccess = () => {
                if (request.result) resolve(request.result);
                else reject(new ReplayError(`Execution ${id} not found`, 'EXECUTION_NOT_FOUND', { id }));
            };
            request.onerror = (e) => reject(new ReplayError('Failed to get execution', 'DB_GET_EXEC_FAILED', { error: e.target.error }));
        });
    }

    /**
     * Retrieves all steps for a given execution ID, ordered by sequence number.
     * @param {string} executionId - The execution ID.
     * @returns {Promise<Array<Object>>}
     */
    async getStepsForExecution(executionId) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['steps'], 'readonly');
            const store = transaction.objectStore('steps');
            const index = store.index('executionId');
            const request = index.getAll(executionId);
            
            request.onsuccess = () => {
                const steps = request.result || [];
                steps.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                resolve(steps);
            };
            request.onerror = (e) => reject(new ReplayError('Failed to get steps', 'DB_GET_STEPS_FAILED', { error: e.target.error }));
        });
    }

    /**
     * Retrieves all executions, optionally paginated or filtered.
     * @param {number} [limit=100] - Max records to return.
     * @returns {Promise<Array<Object>>}
     */
    async getAllExecutions(limit = 100) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['executions'], 'readonly');
            const store = transaction.objectStore('executions');
            const index = store.index('timestamp');
            const request = index.openCursor(null, 'prev'); // Descending order
            
            const results = [];
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && results.length < limit) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = (e) => reject(new ReplayError('Failed to list executions', 'DB_LIST_EXEC_FAILED', { error: e.target.error }));
        });
    }

    /**
     * Clears all replay data.
     * @returns {Promise<void>}
     */
    async clearAll() {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['executions', 'steps'], 'readwrite');
            transaction.objectStore('executions').clear();
            transaction.objectStore('steps').clear();
            
            transaction.oncomplete = () => resolve();
            transaction.onerror = (e) => reject(new ReplayError('Failed to clear database', 'DB_CLEAR_FAILED', { error: e.target.error }));
        });
    }
}

// ============================================================================
// EXECUTION RECORDER
// ============================================================================

/**
 * Handles the interception and recording of tool executions.
 */
export class ExecutionRecorder {
    /**
     * @param {ReplayDatabaseManager} dbManager - Injected database manager.
     */
    constructor(dbManager) {
        this.dbManager = dbManager;
        this.activeExecutions = new Map();
    }

    /**
     * Starts a new execution recording session.
     * @param {string} workflowName - Name of the workflow or tool chain.
     * @param {Object} metadata - Contextual data (user ID, environment, etc.).
     * @returns {Promise<string>} The unique execution ID.
     */
    async startExecution(workflowName, metadata = {}) {
        const id = generateUUID();
        const execution = {
            id,
            workflowName,
            metadata: deepClone(metadata),
            timestamp: Date.now(),
            status: 'RUNNING',
            totalSteps: 0,
            durationMs: 0,
            error: null
        };

        await this.dbManager.saveExecution(execution);
        
        this.activeExecutions.set(id, {
            ...execution,
            startTime: performance.now(),
            stepCounter: 0
        });

        return id;
    }

    /**
     * Records a single step (tool execution) within an active execution session.
     * @param {string} executionId - The ID of the active execution.
     * @param {string} toolName - The identifier of the tool being executed.
     * @param {Object} inputs - The arguments/inputs provided to the tool.
     * @param {Function} executionBlock - An async function containing the actual tool logic.
     * @returns {Promise<*>} The output of the execution block.
     */
    async recordStep(executionId, toolName, inputs, executionBlock) {
        const session = this.activeExecutions.get(executionId);
        if (!session) {
            throw new ReplayError(`Execution session ${executionId} is not active.`, 'SESSION_NOT_ACTIVE');
        }

        const stepId = generateUUID();
        const sequenceNumber = session.stepCounter++;
        const startTime = performance.now();
        const stateBeforeHash = await generateStateHash(inputs);

        let outputs = null;
        let stepError = null;
        let status = 'SUCCESS';

        try {
            // Execute the actual tool logic
            outputs = await executionBlock();
        } catch (error) {
            stepError = {
                message: error.message,
                stack: error.stack,
                name: error.name
            };
            status = 'FAILED';
            throw error; // Re-throw to not break the actual application flow
        } finally {
            const endTime = performance.now();
            const durationMs = endTime - startTime;
            const stateAfterHash = await generateStateHash(outputs);

            const stepRecord = {
                id: stepId,
                executionId,
                sequenceNumber,
                toolName,
                inputs: deepClone(inputs),
                outputs: deepClone(outputs),
                stateBeforeHash,
                stateAfterHash,
                status,
                error: stepError,
                durationMs,
                timestamp: Date.now()
            };

            // Fire and forget save to not block the main execution thread heavily
            this.dbManager.saveStep(stepRecord).catch(e => {
                console.error('Failed to persist step record asynchronously', e);
            });

            session.totalSteps = session.stepCounter;
        }

        return outputs;
    }

    /**
     * Completes an execution session.
     * @param {string} executionId - The ID of the execution to complete.
     * @param {string} [finalStatus='COMPLETED'] - The final status (COMPLETED, FAILED, ABORTED).
     * @param {Error} [error=null] - Optional error if the workflow failed at a macro level.
     * @returns {Promise<void>}
     */
    async completeExecution(executionId, finalStatus = 'COMPLETED', error = null) {
        const session = this.activeExecutions.get(executionId);
        if (!session) return;

        const endTime = performance.now();
        
        const finalExecutionRecord = {
            id: session.id,
            workflowName: session.workflowName,
            metadata: session.metadata,
            timestamp: session.timestamp,
            status: finalStatus,
            totalSteps: session.totalSteps,
            durationMs: endTime - session.startTime,
            error: error ? { message: error.message, stack: error.stack } : null
        };

        await this.dbManager.saveExecution(finalExecutionRecord);
        this.activeExecutions.delete(executionId);
    }
}

// ============================================================================
// REPLAY ENGINE
// ============================================================================

/**
 * Handles deterministic replay of recorded executions and detects drift.
 */
export class ReplayEngine {
    /**
     * @param {ReplayDatabaseManager} dbManager - Injected database manager.
     */
    constructor(dbManager) {
        this.dbManager = dbManager;
        this.toolRegistry = new Map();
        
        // EventTarget for emitting replay progress events
        this.events = new EventTarget();
    }

    /**
     * Registers a tool handler that can be invoked during a replay.
     * @param {string} toolName - The unique identifier of the tool.
     * @param {Function} handler - The async function that implements the tool logic.
     */
    registerTool(toolName, handler) {
        if (typeof handler !== 'function') {
            throw new ReplayError(`Handler for tool ${toolName} must be a function`, 'INVALID_TOOL_HANDLER');
        }
        this.toolRegistry.set(toolName, handler);
    }

    /**
     * Replays a specific execution by ID, executing tools with historical inputs and comparing outputs.
     * @param {string} executionId - The ID of the execution to replay.
     * @returns {Promise<Object>} Replay report containing drift analysis.
     */
    async replayExecution(executionId) {
        const originalExecution = await this.dbManager.getExecution(executionId);
        const steps = await this.dbManager.getStepsForExecution(executionId);

        if (!steps || steps.length === 0) {
            throw new ReplayError(`No steps found for execution ${executionId}`, 'EMPTY_EXECUTION');
        }

        const report = {
            executionId,
            workflowName: originalExecution.workflowName,
            originalStatus: originalExecution.status,
            replayTimestamp: Date.now(),
            totalSteps: steps.length,
            driftDetected: false,
            stepReports: [],
            status: 'SUCCESS'
        };

        this.events.dispatchEvent(new CustomEvent('replayStart', { detail: { executionId, totalSteps: steps.length } }));

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepReport = await this._replayStep(step);
            
            report.stepReports.push(stepReport);
            
            this.events.dispatchEvent(new CustomEvent('replayStepComplete', { detail: { stepReport, index: i } }));

            if (stepReport.hasDrift) {
                report.driftDetected = true;
            }

            if (stepReport.status === 'FAILED') {
                report.status = 'FAILED';
                break; // Stop replay on first failure to maintain deterministic state chain
            }
        }

        this.events.dispatchEvent(new CustomEvent('replayComplete', { detail: report }));
        return report;
    }

    /**
     * Replays a single step and compares results.
     * @param {Object} step - The historical step record.
     * @returns {Promise<Object>} The step replay report.
     * @private
     */
    async _replayStep(step) {
        const handler = this.toolRegistry.get(step.toolName);
        
        const stepReport = {
            stepId: step.id,
            toolName: step.toolName,
            sequenceNumber: step.sequenceNumber,
            status: 'SUCCESS',
            hasDrift: false,
            driftDetails: null,
            durationMs: 0,
            error: null
        };

        if (!handler) {
            stepReport.status = 'FAILED';
            stepReport.error = `Tool handler not registered for: ${step.toolName}`;
            return stepReport;
        }

        const startTime = performance.now();
        let replayOutputs = null;
        let replayError = null;

        try {
            // Execute the registered handler with the exact historical inputs
            replayOutputs = await handler(deepClone(step.inputs));
        } catch (error) {
            replayError = error;
            stepReport.status = 'FAILED';
            stepReport.error = {
                message: error.message,
                stack: error.stack
            };
        } finally {
            stepReport.durationMs = performance.now() - startTime;
        }

        // Drift Analysis
        if (stepReport.status === 'SUCCESS' && step.status === 'SUCCESS') {
            const isDeepEqual = deepEqual(step.outputs, replayOutputs);
            const replayHash = await generateStateHash(replayOutputs);
            const originalHash = step.stateAfterHash;

            if (!isDeepEqual || replayHash !== originalHash) {
                stepReport.hasDrift = true;
                stepReport.driftDetails = {
                    originalHash,
                    replayHash,
                    originalOutputs: step.outputs,
                    replayOutputs: replayOutputs
                };
            }
        } else if (stepReport.status !== step.status) {
            // State mismatch: Original succeeded, replay failed (or vice versa)
            stepReport.hasDrift = true;
            stepReport.driftDetails = {
                type: 'STATUS_MISMATCH',
                originalStatus: step.status,
                replayStatus: stepReport.status,
                originalError: step.error,
                replayError: stepReport.error
            };
        }

        return stepReport;
    }
}

// ============================================================================
// EXPORT / IMPORT UTILITIES
// ============================================================================

/**
 * Handles serialization and deserialization of execution state for portability.
 */
export class ReplayExporter {
    /**
     * @param {ReplayDatabaseManager} dbManager 
     */
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Exports a full execution (session + steps) as a JSON string.
     * @param {string} executionId 
     * @returns {Promise<string>}
     */
    async exportExecution(executionId) {
        const execution = await this.dbManager.getExecution(executionId);
        const steps = await this.dbManager.getStepsForExecution(executionId);

        const payload = {
            version: '3.0.0-beast',
            exportTimestamp: Date.now(),
            execution,
            steps
        };

        return JSON.stringify(payload, null, 2);
    }

    /**
     * Imports an execution payload into the database.
     * @param {string} jsonString 
     * @returns {Promise<string>} The imported execution ID.
     */
    async importExecution(jsonString) {
        try {
            const payload = JSON.parse(jsonString);
            
            if (!payload.execution || !payload.execution.id || !Array.isArray(payload.steps)) {
                throw new ReplayError('Invalid import payload format', 'INVALID_IMPORT_FORMAT');
            }

            // To avoid conflicts, we generate a new ID for the imported execution
            const newExecutionId = `imported-${generateUUID()}`;
            const execution = { ...payload.execution, id: newExecutionId, imported: true };
            
            await this.dbManager.saveExecution(execution);

            for (const step of payload.steps) {
                const newStep = { ...step, executionId: newExecutionId, id: generateUUID() };
                await this.dbManager.saveStep(newStep);
            }

            return newExecutionId;
        } catch (error) {
            if (error instanceof ReplayError) throw error;
            throw new ReplayError(`Failed to import execution: ${error.message}`, 'IMPORT_FAILED');
        }
    }
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

/**
 * The primary facade for the Decide Engine Replay System.
 * Combines Recorder, Engine, Database, and Exporter into a unified API.
 */
export class ReplaySystem {
    constructor() {
        this.db = new ReplayDatabaseManager();
        this.recorder = new ExecutionRecorder(this.db);
        this.engine = new ReplayEngine(this.db);
        this.exporter = new ReplayExporter(this.db);
        this._initialized = false;
    }

    /**
     * Initializes the Replay System. Must be called before use.
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this._initialized) return;
        await this.db.ensureReady();
        this._initialized = true;
        console.info('[ReplaySystem] Initialized successfully. Ready for deterministic tracing.');
    }

    /**
     * Wraps a tool function to automatically record its execution.
     * @param {string} toolName - Name of the tool.
     * @param {Function} toolFunction - The async function to wrap.
     * @returns {Function} The wrapped function.
     */
    wrapTool(toolName, toolFunction) {
        // Register for replay capability automatically
        this.engine.registerTool(toolName, toolFunction);

        // Return wrapped function for runtime interception
        return async (executionId, inputs) => {
            if (!executionId) {
                console.warn(`[ReplaySystem] Tool ${toolName} executed without executionId. Bypassing recorder.`);
                return await toolFunction(inputs);
            }
            return await this.recorder.recordStep(executionId, toolName, inputs, async () => {
                return await toolFunction(inputs);
            });
        };
    }

    /**
     * Starts a new recorded workflow.
     * @param {string} name - Workflow name.
     * @param {Object} [metadata] - Optional metadata.
     * @returns {Promise<string>} Execution ID.
     */
    start(name, metadata) {
        return this.recorder.startExecution(name, metadata);
    }

    /**
     * Completes a recorded workflow.
     * @param {string} executionId 
     * @param {string} status 
     * @param {Error} [error] 
     */
    complete(executionId, status, error) {
        return this.recorder.completeExecution(executionId, status, error);
    }

    /**
     * Replays a historical workflow to check for drift.
     * @param {string} executionId 
     * @returns {Promise<Object>} Replay report.
     */
    replay(executionId) {
        return this.engine.replayExecution(executionId);
    }

    /**
     * Gets a list of historical executions.
     * @param {number} limit 
     * @returns {Promise<Array<Object>>}
     */
    getHistory(limit = 50) {
        return this.db.getAllExecutions(limit);
    }

    /**
     * Subscribe to replay events (replayStart, replayStepComplete, replayComplete).
     * @param {string} eventName 
     * @param {Function} callback 
     */
    on(eventName, callback) {
        this.engine.events.addEventListener(eventName, (e) => callback(e.detail));
    }
}

// Export a singleton instance for global usage within the Decide Engine dashboard
export const replaySystem = new ReplaySystem();