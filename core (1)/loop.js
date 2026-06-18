/**
 * @fileoverview Decide Engine - Core Real-Time Game Loop and Frame Scheduler
 * @module core/loop
 * @description 
 * Transforms the execution model from a batch pipeline to a continuous real-time 
 * simulation environment. This module provides a AAA-grade game loop implementation 
 * featuring fixed-timestep physics updates, variable-timestep rendering, interpolation, 
 * performance metrics, and a frame-synchronized task scheduler.
 * 
 * Features:
 * - Deterministic fixed updates (Spiral of Death prevention).
 * - Variable updates with interpolation alpha for smooth rendering.
 * - Frame-synchronized Scheduler (Time-based and Frame-based).
 * - Coroutine management for spanning logic across multiple frames.
 * - Subsystem phase registration (PreUpdate, FixedUpdate, Update, LateUpdate, Render).
 * - Robust error boundaries to maintain simulation stability.
 * 
 * @version 3.0.0-beast
 */

"use strict";

// -----------------------------------------------------------------------------
// Constants & Configuration
// -----------------------------------------------------------------------------

const DEFAULT_FIXED_TIMESTEP = 1000 / 60; // 60Hz physics/logic updates (16.666ms)
const MAX_ACCUMULATOR = 1000 / 10;        // Prevent spiral of death (max 100ms accumulation)
const METRICS_SAMPLE_SIZE = 60;           // Number of frames for rolling average metrics

/**
 * Loop Execution Phases
 * Ensures strict ordering of subsystem execution.
 * @enum {number}
 */
export const LoopPhase = {
    PRE_UPDATE: 0,
    FIXED_UPDATE: 1,
    UPDATE: 2,
    LATE_UPDATE: 3,
    PRE_RENDER: 4,
    RENDER: 5,
    POST_RENDER: 6
};

// -----------------------------------------------------------------------------
// Time Management
// -----------------------------------------------------------------------------

/**
 * Engine Time Context
 * Exposes simulation and real-world time metrics to all subsystems.
 */
export class Time {
    constructor() {
        /** @type {number} Total elapsed simulation time in milliseconds */
        this.time = 0;
        /** @type {number} Unscaled total elapsed real time in milliseconds */
        this.realTime = 0;
        /** @type {number} Time elapsed since the last variable update in seconds */
        this.deltaTime = 0;
        /** @type {number} Unscaled time elapsed since last variable update in seconds */
        this.unscaledDeltaTime = 0;
        /** @type {number} The fixed interval for physics updates in seconds */
        this.fixedDeltaTime = DEFAULT_FIXED_TIMESTEP / 1000;
        /** @type {number} Time scale multiplier (1.0 = normal, 0.5 = slow motion, 0 = paused) */
        this.timeScale = 1.0;
        /** @type {number} Total number of frames rendered since loop start */
        this.frameCount = 0;
        /** @type {number} Interpolation factor (0.0 to 1.0) for rendering between fixed steps */
        this.alpha = 0;
    }

    /**
     * Updates the time context for the current frame.
     * @param {number} dtMs - Delta time in milliseconds.
     * @param {number} currentRealTime - Current high-res timestamp.
     */
    update(dtMs, currentRealTime) {
        this.unscaledDeltaTime = dtMs / 1000;
        this.deltaTime = this.unscaledDeltaTime * this.timeScale;
        this.realTime = currentRealTime;
        this.time += dtMs * this.timeScale;
        this.frameCount++;
    }
}

// -----------------------------------------------------------------------------
// Performance Metrics
// -----------------------------------------------------------------------------

/**
 * Loop Metrics Tracker
 * Maintains rolling averages of frame times, FPS, and execution costs.
 */
export class LoopMetrics {
    constructor() {
        this.fps = 0;
        this.frameTime = 0;
        this.updateTime = 0;
        this.renderTime = 0;
        this.memoryUsage = 0;

        this._frameTimes = new Float64Array(METRICS_SAMPLE_SIZE);
        this._frameIndex = 0;
        this._lastFpsTime = 0;
        this._frameCountSinceLastFps = 0;
    }

    /**
     * Records a frame's total execution time.
     * @param {number} durationMs - How long the frame took to process.
     * @param {number} timestamp - Current high-res time.
     */
    recordFrame(durationMs, timestamp) {
        this.frameTime = durationMs;
        this._frameTimes[this._frameIndex] = durationMs;
        this._frameIndex = (this._frameIndex + 1) % METRICS_SAMPLE_SIZE;

        this._frameCountSinceLastFps++;
        if (timestamp - this._lastFpsTime >= 1000) {
            this.fps = (this._frameCountSinceLastFps * 1000) / (timestamp - this._lastFpsTime);
            this._frameCountSinceLastFps = 0;
            this._lastFpsTime = timestamp;
            this._updateMemoryStats();
        }
    }

    /**
     * Calculates the average frame time over the sample window.
     * @returns {number} Average frame time in ms.
     */
    getAverageFrameTime() {
        let sum = 0;
        for (let i = 0; i < METRICS_SAMPLE_SIZE; i++) {
            sum += this._frameTimes[i];
        }
        return sum / METRICS_SAMPLE_SIZE;
    }

    /**
     * Attempts to read JS heap size if the environment supports it.
     * @private
     */
    _updateMemoryStats() {
        if (typeof performance !== 'undefined' && performance.memory) {
            // Convert to MB
            this.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
        }
    }
}

// -----------------------------------------------------------------------------
// Frame Scheduler & Coroutines
// -----------------------------------------------------------------------------

/**
 * Task representing a delayed or repeating execution synchronized with the game loop.
 */
class ScheduledTask {
    /**
     * @param {Function} callback - Function to execute.
     * @param {number} delay - Delay before execution.
     * @param {boolean} isFrameBased - If true, delay is in frames, else in milliseconds.
     * @param {boolean} repeat - If true, task repeats after execution.
     */
    constructor(callback, delay, isFrameBased, repeat = false) {
        this.id = Symbol('ScheduledTask');
        this.callback = callback;
        this.delay = delay;
        this.isFrameBased = isFrameBased;
        this.repeat = repeat;
        this.target = 0; // Set by scheduler
        this.active = true;
    }
}

/**
 * Frame Scheduler
 * Replaces setTimeout/setInterval with deterministic, engine-time synchronized scheduling.
 */
export class FrameScheduler {
    /**
     * @param {Time} timeContext - Reference to the engine's Time object.
     */
    constructor(timeContext) {
        this.time = timeContext;
        /** @type {Map<Symbol, ScheduledTask>} */
        this.tasks = new Map();
        /** @type {Set<Generator>} */
        this.coroutines = new Set();
    }

    /**
     * Schedules a task to run after a certain amount of engine time (scaled).
     * @param {Function} callback - Function to execute.
     * @param {number} delayMs - Delay in milliseconds.
     * @returns {Symbol} Task ID for cancellation.
     */
    scheduleTime(callback, delayMs) {
        const task = new ScheduledTask(callback, delayMs, false);
        task.target = this.time.time + delayMs;
        this.tasks.set(task.id, task);
        return task.id;
    }

    /**
     * Schedules a task to run after a specific number of frames.
     * @param {Function} callback - Function to execute.
     * @param {number} frames - Number of frames to wait.
     * @returns {Symbol} Task ID for cancellation.
     */
    scheduleFrames(callback, frames) {
        const task = new ScheduledTask(callback, frames, true);
        task.target = this.time.frameCount + frames;
        this.tasks.set(task.id, task);
        return task.id;
    }

    /**
     * Cancels a scheduled task.
     * @param {Symbol} taskId - The ID of the task to cancel.
     * @returns {boolean} True if task was found and cancelled.
     */
    cancelTask(taskId) {
        return this.tasks.delete(taskId);
    }

    /**
     * Starts a coroutine (Generator function) that yields execution across frames.
     * @param {Generator} generator - The generator to run.
     */
    startCoroutine(generator) {
        this.coroutines.add(generator);
    }

    /**
     * Stops a running coroutine.
     * @param {Generator} generator - The generator to stop.
     */
    stopCoroutine(generator) {
        this.coroutines.delete(generator);
    }

    /**
     * Processes all scheduled tasks and coroutines for the current frame.
     * Called automatically by the EngineLoop.
     */
    update() {
        // 1. Process standard scheduled tasks
        for (const [id, task] of this.tasks.entries()) {
            if (!task.active) continue;

            const isReady = task.isFrameBased 
                ? this.time.frameCount >= task.target 
                : this.time.time >= task.target;

            if (isReady) {
                try {
                    task.callback();
                } catch (error) {
                    console.error(`[FrameScheduler] Error in scheduled task ${id.toString()}:`, error);
                }

                if (task.repeat) {
                    task.target = task.isFrameBased 
                        ? this.time.frameCount + task.delay 
                        : this.time.time + task.delay;
                } else {
                    this.tasks.delete(id);
                }
            }
        }

        // 2. Process Coroutines
        for (const coroutine of this.coroutines) {
            try {
                const result = coroutine.next();
                if (result.done) {
                    this.coroutines.delete(coroutine);
                }
            } catch (error) {
                console.error(`[FrameScheduler] Error in coroutine:`, error);
                this.coroutines.delete(coroutine);
            }
        }
    }
}

// -----------------------------------------------------------------------------
// Core Engine Loop
// -----------------------------------------------------------------------------

/**
 * Real-Time Engine Loop Orchestrator
 * Manages the lifecycle, timing, and execution order of all engine subsystems.
 */
export class EngineLoop {
    constructor() {
        // State
        this.isRunning = false;
        this.isPaused = false;
        this.frameId = null;
        this.lastTimestamp = 0;
        this.accumulator = 0;

        // Core Components
        this.time = new Time();
        this.metrics = new LoopMetrics();
        this.scheduler = new FrameScheduler(this.time);

        // Subsystem Registry (Array of Arrays, indexed by LoopPhase)
        /** @type {Array<Array<{name: string, callback: Function, context: any}>>} */
        this.systems = Array.from({ length: Object.keys(LoopPhase).length }, () => []);

        // Bindings for requestAnimationFrame
        this._tickBound = this._tick.bind(this);
        
        // Environment feature detection
        this._perfTimer = typeof performance !== 'undefined' ? performance : Date;
        
        // Error handling configuration
        this.errorThreshold = 5; // Max errors before pausing the loop
        this._errorCount = 0;
    }

    /**
     * Registers a subsystem callback to a specific phase of the game loop.
     * @param {number} phase - The LoopPhase enum value.
     * @param {string} name - Identifier for the system (used in debugging/errors).
     * @param {Function} callback - The function to execute.
     * @param {any} [context=null] - The 'this' context for the callback.
     */
    subscribe(phase, name, callback, context = null) {
        if (!this.systems[phase]) {
            throw new Error(`[EngineLoop] Invalid loop phase: ${phase}`);
        }
        
        // Prevent duplicate subscriptions
        const exists = this.systems[phase].some(s => s.name === name && s.callback === callback);
        if (!exists) {
            this.systems[phase].push({ name, callback, context });
            // Sort by priority if we ever add priority fields, for now insertion order.
        }
    }

    /**
     * Unregisters a subsystem from a specific phase.
     * @param {number} phase - The LoopPhase enum value.
     * @param {string} name - Identifier for the system.
     */
    unsubscribe(phase, name) {
        if (!this.systems[phase]) return;
        this.systems[phase] = this.systems[phase].filter(s => s.name !== name);
    }

    /**
     * Starts the simulation loop.
     */
    start() {
        if (this.isRunning) return;

        console.log("[EngineLoop] Starting Real-Time Simulation...");
        this.isRunning = true;
        this.isPaused = false;
        this._errorCount = 0;
        
        // Reset timing
        this.lastTimestamp = this._perfTimer.now();
        this.accumulator = 0;
        
        // Kick off the loop
        this.frameId = requestAnimationFrame(this._tickBound);
    }

    /**
     * Halts the simulation loop completely.
     */
    stop() {
        if (!this.isRunning) return;
        
        console.log("[EngineLoop] Stopping Simulation.");
        this.isRunning = false;
        
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    /**
     * Pauses the simulation (time stops, but render loop may continue to draw static frames).
     */
    pause() {
        this.isPaused = true;
        this.time.timeScale = 0;
        console.log("[EngineLoop] Simulation Paused.");
    }

    /**
     * Resumes the simulation.
     */
    resume() {
        this.isPaused = false;
        this.time.timeScale = 1.0;
        this.lastTimestamp = this._perfTimer.now(); // Prevent large dt jump
        console.log("[EngineLoop] Simulation Resumed.");
    }

    /**
     * Manually steps the simulation forward by one fixed timestep.
     * Useful for debugging or deterministic replay when paused.
     */
    step() {
        if (!this.isPaused) {
            console.warn("[EngineLoop] Step called while simulation is running. Ignoring.");
            return;
        }
        
        // Force a fixed update cycle
        this.time.timeScale = 1.0;
        this.time.update(DEFAULT_FIXED_TIMESTEP, this._perfTimer.now());
        this._executePhase(LoopPhase.PRE_UPDATE);
        this._executePhase(LoopPhase.FIXED_UPDATE);
        this._executePhase(LoopPhase.UPDATE);
        this._executePhase(LoopPhase.LATE_UPDATE);
        this._executePhase(LoopPhase.PRE_RENDER);
        this._executePhase(LoopPhase.RENDER);
        this._executePhase(LoopPhase.POST_RENDER);
        this.time.timeScale = 0.0;
    }

    /**
     * The core loop tick, called by requestAnimationFrame.
     * @param {number} currentTimestamp - Provided by rAF.
     * @private
     */
    _tick(currentTimestamp) {
        if (!this.isRunning) return;

        const startTickTime = this._perfTimer.now();

        // 1. Calculate Delta Time
        let frameTimeMs = currentTimestamp - this.lastTimestamp;
        this.lastTimestamp = currentTimestamp;

        // Prevent spiral of death (e.g., user switched browser tabs)
        if (frameTimeMs > MAX_ACCUMULATOR) {
            frameTimeMs = MAX_ACCUMULATOR;
        }

        // 2. Update Time Context
        this.time.update(frameTimeMs, currentTimestamp);

        // 3. Accumulate Time for Fixed Updates
        this.accumulator += frameTimeMs * this.time.timeScale;

        try {
            // 4. Pre-Update Phase (Input gathering, etc.)
            this._executePhase(LoopPhase.PRE_UPDATE);

            // 5. Fixed Update Phase (Physics, deterministic logic)
            // Consume accumulator in discrete fixed steps
            while (this.accumulator >= DEFAULT_FIXED_TIMESTEP) {
                this._executePhase(LoopPhase.FIXED_UPDATE);
                this.accumulator -= DEFAULT_FIXED_TIMESTEP;
            }

            // Calculate interpolation alpha for rendering (how far we are between fixed steps)
            this.time.alpha = this.accumulator / DEFAULT_FIXED_TIMESTEP;

            // 6. Variable Update Phase (Game logic, animations)
            const updateStartTime = this._perfTimer.now();
            
            this.scheduler.update(); // Process scheduled tasks/coroutines
            this._executePhase(LoopPhase.UPDATE);
            this._executePhase(LoopPhase.LATE_UPDATE);
            
            this.metrics.updateTime = this._perfTimer.now() - updateStartTime;

            // 7. Render Phase
            const renderStartTime = this._perfTimer.now();
            
            this._executePhase(LoopPhase.PRE_RENDER);
            this._executePhase(LoopPhase.RENDER);
            this._executePhase(LoopPhase.POST_RENDER);
            
            this.metrics.renderTime = this._perfTimer.now() - renderStartTime;

            // Reset error count on successful frame
            this._errorCount = 0;

        } catch (error) {
            this._handleLoopFatalError(error);
        }

        // 8. Record Metrics
        const endTickTime = this._perfTimer.now();
        this.metrics.recordFrame(endTickTime - startTickTime, currentTimestamp);

        // 9. Request Next Frame
        if (this.isRunning) {
            this.frameId = requestAnimationFrame(this._tickBound);
        }
    }

    /**
     * Executes all registered callbacks for a specific phase.
     * @param {number} phase - The LoopPhase to execute.
     * @private
     */
    _executePhase(phase) {
        const systems = this.systems[phase];
        for (let i = 0; i < systems.length; i++) {
            const system = systems[i];
            try {
                if (system.context) {
                    system.callback.call(system.context, this.time);
                } else {
                    system.callback(this.time);
                }
            } catch (error) {
                console.error(`[EngineLoop] Subsystem Error in phase ${phase} [${system.name}]:`, error);
                this._errorCount++;
                
                if (this._errorCount >= this.errorThreshold) {
                    throw new Error(`[EngineLoop] Error threshold exceeded due to failing subsystem: ${system.name}`);
                }
            }
        }
    }

    /**
     * Handles fatal errors that escape subsystem boundaries.
     * @param {Error} error 
     * @private
     */
    _handleLoopFatalError(error) {
        console.error("[EngineLoop] FATAL ERROR: Loop execution aborted to prevent crash loop.", error);
        this.pause(); // Pause rather than stop to allow state inspection
        
        // Dispatch event to global bus if available, or window
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('engine:fatal_error', { 
                detail: { error: error, time: this.time.time } 
            }));
        }
    }
}

// -----------------------------------------------------------------------------
// Singleton Export
// -----------------------------------------------------------------------------

/**
 * Global instance of the EngineLoop.
 * Most applications will only need a single loop instance.
 * @type {EngineLoop}
 */
export const MainLoop = new EngineLoop();

// Export default for standard imports
export default MainLoop;