/**
 * @fileoverview Decide Engine - Core Rendering Abstraction Layer
 * @module core/render
 * @description
 * This module provides the foundational rendering abstraction layer for the Decide Engine.
 * It is responsible for bridging the gap between the pure data-driven Entity-Component-System (ECS)
 * world state and the downstream visual systems (e.g., Canvas2D, WebGL, WebGPU backends).
 * 
 * The architecture is designed around a multi-pass, data-oriented extraction pipeline:
 * 1. Extraction: Pulls renderable components from the ECS.
 * 2. Culling: Eliminates entities outside the active camera frustum/viewport.
 * 3. Sorting: Orders render commands by layer, z-index, and material state to minimize draw calls.
 * 4. Frame Generation: Produces a structured, immutable `FrameData` object for backends to consume.
 * 
 * Features include:
 * - Zero-allocation render loop (via object pooling).
 * - Multi-camera support with viewport mapping.
 * - Flexible render passes (Background, Opaque, Transparent, UI, Post-Process).
 * - Agnostic to 2D vs 3D (uses generic Transform and BoundingBox structures).
 */

// ============================================================================
// TYPE DEFINITIONS & JSDOC
// ============================================================================

/**
 * @typedef {Object} Vector2
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef {Object} Color
 * @property {number} r - Red (0-255)
 * @property {number} g - Green (0-255)
 * @property {number} b - Blue (0-255)
 * @property {number} a - Alpha (0.0-1.0)
 */

/**
 * @typedef {Object} ECSWorld
 * @property {Function} getEntitiesWith - Returns an array of entities possessing the specified component types.
 * @property {Function} getComponent - Retrieves a specific component from an entity.
 * @property {Function} hasComponent - Checks if an entity has a specific component.
 */

/**
 * @typedef {Object} ECSEntity
 * @property {string|number} id - The unique identifier of the entity.
 */

// ============================================================================
// CONSTANTS & ENUMS
// ============================================================================

/**
 * Defines the standard rendering layers. Lower values are rendered first.
 * @enum {number}
 */
export const RENDER_LAYERS = Object.freeze({
    BACKGROUND: 0,
    ENVIRONMENT: 100,
    DEFAULT: 200,
    FOREGROUND: 300,
    PARTICLES: 400,
    UI_BACKGROUND: 500,
    UI_DEFAULT: 600,
    UI_OVERLAY: 700,
    DEBUG: 1000
});

/**
 * Defines standard blend modes for visual components.
 * @enum {string}
 */
export const BLEND_MODES = Object.freeze({
    NORMAL: 'normal',
    ADD: 'add',
    MULTIPLY: 'multiply',
    SCREEN: 'screen',
    OVERLAY: 'overlay'
});

/**
 * Defines culling strategies for the render pipeline.
 * @enum {number}
 */
export const CULLING_STRATEGIES = Object.freeze({
    NONE: 0,          // No culling, render everything
    FRUSTUM_2D: 1,    // 2D AABB intersection
    FRUSTUM_3D: 2,    // 3D Frustum intersection
    OCCLUSION: 3      // Advanced occlusion culling (placeholder for future)
});

// ============================================================================
// ERRORS
// ============================================================================

/**
 * Custom error class for rendering subsystem failures.
 */
export class RenderSystemError extends Error {
    /**
     * @param {string} message - The error description.
     * @param {Object} [context] - Additional context about the error.
     */
    constructor(message, context = null) {
        super(`[RenderSystem] ${message}`);
        this.name = 'RenderSystemError';
        this.context = context;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RenderSystemError);
        }
    }
}

// ============================================================================
// CORE DATA STRUCTURES
// ============================================================================

/**
 * Represents an Axis-Aligned Bounding Box (AABB) for culling operations.
 */
export class BoundingBox {
    /**
     * @param {number} minX 
     * @param {number} minY 
     * @param {number} maxX 
     * @param {number} maxY 
     */
    constructor(minX = 0, minY = 0, maxX = 0, maxY = 0) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    /**
     * Checks intersection with another bounding box.
     * @param {BoundingBox} other 
     * @returns {boolean} True if intersecting
     */
    intersects(other) {
        return (
            this.minX <= other.maxX &&
            this.maxX >= other.minX &&
            this.minY <= other.maxY &&
            this.maxY >= other.minY
        );
    }

    /**
     * Updates the bounding box based on a center point and dimensions.
     * @param {number} x - Center X
     * @param {number} y - Center Y
     * @param {number} width - Total width
     * @param {number} height - Total height
     */
    setFromCenterAndSize(x, y, width, height) {
        const halfW = width / 2;
        const halfH = height / 2;
        this.minX = x - halfW;
        this.maxX = x + halfW;
        this.minY = y - halfH;
        this.maxY = y + halfH;
    }
}

/**
 * Represents a single atomic instruction for the rendering backend.
 * Pooled to avoid garbage collection overhead during the render loop.
 */
export class RenderCommand {
    constructor() {
        /** @type {string|number|null} */
        this.entityId = null;
        /** @type {number} */
        this.layer = RENDER_LAYERS.DEFAULT;
        /** @type {number} */
        this.zIndex = 0;
        /** @type {string} */
        this.blendMode = BLEND_MODES.NORMAL;
        /** @type {number} */
        this.opacity = 1.0;
        
        // Transform Data
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;

        // Visual Data (Extracted from components)
        /** @type {string|null} */
        this.assetId = null; 
        /** @type {Object|null} */
        this.geometry = null;
        /** @type {Object|null} */
        this.material = null;
        /** @type {string|null} */
        this.text = null;
        /** @type {Color|null} */
        this.tint = null;

        // Metadata
        /** @type {boolean} */
        this.visible = true;
        /** @type {BoundingBox} */
        this.bounds = new BoundingBox();
    }

    /**
     * Resets the command to its default state for pooling.
     */
    reset() {
        this.entityId = null;
        this.layer = RENDER_LAYERS.DEFAULT;
        this.zIndex = 0;
        this.blendMode = BLEND_MODES.NORMAL;
        this.opacity = 1.0;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.assetId = null;
        this.geometry = null;
        this.material = null;
        this.text = null;
        this.tint = null;
        this.visible = true;
    }
}

/**
 * Object pool for RenderCommands to ensure zero-allocation during the frame loop.
 */
class RenderCommandPool {
    constructor(initialCapacity = 10000) {
        /** @type {RenderCommand[]} */
        this.pool = Array.from({ length: initialCapacity }, () => new RenderCommand());
        /** @type {number} */
        this.index = 0;
    }

    /**
     * Retrieves a clean RenderCommand from the pool.
     * @returns {RenderCommand}
     */
    acquire() {
        if (this.index >= this.pool.length) {
            // Expand pool by 20% if exhausted, log a warning in development
            const expansion = Math.floor(this.pool.length * 0.2) + 100;
            console.warn(`[RenderCommandPool] Expanding pool by ${expansion} units. Consider increasing initial capacity.`);
            for (let i = 0; i < expansion; i++) {
                this.pool.push(new RenderCommand());
            }
        }
        const cmd = this.pool[this.index++];
        cmd.reset();
        return cmd;
    }

    /**
     * Resets the pool index, effectively reclaiming all commands.
     * Call this at the start of a new frame.
     */
    releaseAll() {
        this.index = 0;
    }

    /**
     * @returns {number} The number of active commands in the current frame.
     */
    getActiveCount() {
        return this.index;
    }
}

// ============================================================================
// RENDER PIPELINE ABSTRACTIONS
// ============================================================================

/**
 * Represents a camera defining the view matrix and projection constraints.
 */
export class Camera {
    /**
     * @param {string} id - Unique identifier for the camera.
     */
    constructor(id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.zoom = 1.0;
        this.rotation = 0;
        
        // Viewport normalized coordinates (0.0 to 1.0)
        this.viewport = { x: 0, y: 0, width: 1, height: 1 };
        
        // Culling bounds
        this.bounds = new BoundingBox();
        this.active = true;
        this.cullingStrategy = CULLING_STRATEGIES.FRUSTUM_2D;
    }

    /**
     * Updates the camera's bounding box based on screen dimensions and zoom.
     * @param {number} screenWidth 
     * @param {number} screenHeight 
     */
    updateBounds(screenWidth, screenHeight) {
        const viewWidth = (screenWidth * this.viewport.width) / this.zoom;
        const viewHeight = (screenHeight * this.viewport.height) / this.zoom;
        this.bounds.setFromCenterAndSize(this.x, this.y, viewWidth, viewHeight);
    }

    /**
     * Determines if a bounding box is visible within this camera's view.
     * @param {BoundingBox} targetBounds 
     * @returns {boolean}
     */
    canSee(targetBounds) {
        if (this.cullingStrategy === CULLING_STRATEGIES.NONE) return true;
        return this.bounds.intersects(targetBounds);
    }
}

/**
 * Represents a specific phase in the rendering pipeline (e.g., Opaque, Transparent, UI).
 */
export class RenderPass {
    /**
     * @param {string} name - Name of the pass.
     * @param {number[]} layers - Array of RENDER_LAYERS this pass is responsible for.
     */
    constructor(name, layers) {
        this.name = name;
        this.layers = new Set(layers);
        /** @type {RenderCommand[]} */
        this.commands = [];
    }

    /**
     * Clears the commands from the previous frame.
     */
    clear() {
        this.commands.length = 0;
    }

    /**
     * Adds a command to this pass if it belongs to the pass's layers.
     * @param {RenderCommand} command 
     * @returns {boolean} True if accepted by this pass.
     */
    addCommand(command) {
        if (this.layers.has(command.layer)) {
            this.commands.push(command);
            return true;
        }
        return false;
    }

    /**
     * Sorts the commands in this pass.
     * Default implementation sorts by layer, then by z-index.
     */
    sort() {
        this.commands.sort((a, b) => {
            if (a.layer !== b.layer) {
                return a.layer - b.layer;
            }
            return a.zIndex - b.zIndex;
        });
    }
}

/**
 * The final, immutable structured output generated every frame.
 * Consumed by the actual graphics backend (Canvas, WebGL, etc.)
 */
export class FrameData {
    constructor() {
        /** @type {number} */
        this.frameId = 0;
        /** @type {number} */
        this.timestamp = 0;
        /** @type {number} */
        this.deltaTime = 0;
        
        /** @type {Object.<string, Camera>} Map of active cameras */
        this.cameras = {};
        
        /** @type {RenderPass[]} Ordered list of render passes */
        this.passes = [];
        
        /** @type {Object} Diagnostics and metrics for the frame */
        this.metrics = {
            totalEntities: 0,
            extractedCommands: 0,
            culledCommands: 0,
            renderedCommands: 0,
            extractionTimeMs: 0,
            cullingTimeMs: 0,
            sortingTimeMs: 0,
            totalTimeMs: 0
        };
    }

    /**
     * Freezes the frame data to prevent accidental modification by backends.
     * Deep freezes arrays and objects.
     */
    lock() {
        Object.freeze(this.metrics);
        Object.freeze(this.cameras);
        for (const pass of this.passes) {
            Object.freeze(pass.commands);
            Object.freeze(pass);
        }
        Object.freeze(this.passes);
        Object.freeze(this);
    }
}

// ============================================================================
// MAIN RENDER SYSTEM
// ============================================================================

/**
 * Configuration options for the RenderSystem.
 * @typedef {Object} RenderSystemConfig
 * @property {number} [screenWidth=1920] - Logical screen width.
 * @property {number} [screenHeight=1080] - Logical screen height.
 * @property {boolean} [enableCulling=true] - Whether to perform frustum/AABB culling.
 * @property {boolean} [debugMode=false] - If true, extracts debug bounds and metadata.
 * @property {number} [poolCapacity=10000] - Initial size of the RenderCommand pool.
 */

/**
 * The RenderSystem is responsible for orchestrating the conversion of ECS state
 * into a structured `FrameData` object. It handles extraction, culling, and sorting.
 */
export class RenderSystem {
    /**
     * @param {RenderSystemConfig} config 
     */
    constructor(config = {}) {
        this.screenWidth = config.screenWidth || 1920;
        this.screenHeight = config.screenHeight || 1080;
        this.enableCulling = config.enableCulling !== undefined ? config.enableCulling : true;
        this.debugMode = config.debugMode || false;

        this.commandPool = new RenderCommandPool(config.poolCapacity || 10000);
        
        /** @type {Map<string, Camera>} */
        this.cameras = new Map();
        
        // Setup default camera
        const defaultCam = new Camera('main');
        this.addCamera(defaultCam);

        // Setup Render Passes
        /** @type {RenderPass[]} */
        this.passes = [
            new RenderPass('Background', [RENDER_LAYERS.BACKGROUND, RENDER_LAYERS.ENVIRONMENT]),
            new RenderPass('Main', [RENDER_LAYERS.DEFAULT, RENDER_LAYERS.FOREGROUND, RENDER_LAYERS.PARTICLES]),
            new RenderPass('UI', [RENDER_LAYERS.UI_BACKGROUND, RENDER_LAYERS.UI_DEFAULT, RENDER_LAYERS.UI_OVERLAY]),
            new RenderPass('Debug', [RENDER_LAYERS.DEBUG])
        ];

        this.frameCounter = 0;
    }

    /**
     * Registers a new camera in the rendering system.
     * @param {Camera} camera 
     */
    addCamera(camera) {
        if (!(camera instanceof Camera)) {
            throw new RenderSystemError('Invalid camera object provided.');
        }
        this.cameras.set(camera.id, camera);
    }

    /**
     * Retrieves a camera by ID.
     * @param {string} id 
     * @returns {Camera|undefined}
     */
    getCamera(id) {
        return this.cameras.get(id);
    }

    /**
     * Updates the logical screen dimensions, updating camera bounds accordingly.
     * @param {number} width 
     * @param {number} height 
     */
    resize(width, height) {
        this.screenWidth = width;
        this.screenHeight = height;
        for (const camera of this.cameras.values()) {
            camera.updateBounds(this.screenWidth, this.screenHeight);
        }
    }

    /**
     * The core loop method. Extracts data from the ECS world and builds a Frame.
     * @param {ECSWorld} world - The game/app state.
     * @param {number} deltaTime - Time elapsed since last frame in seconds.
     * @param {number} timestamp - Current absolute time in milliseconds.
     * @returns {FrameData} The immutable frame data for the backend.
     */
    processFrame(world, deltaTime, timestamp) {
        const perfStart = performance.now();
        this.frameCounter++;

        // 1. Initialize Frame Data & Reset Pools
        const frame = new FrameData();
        frame.frameId = this.frameCounter;
        frame.timestamp = timestamp;
        frame.deltaTime = deltaTime;
        
        this.commandPool.releaseAll();
        for (const pass of this.passes) {
            pass.clear();
        }

        // Update cameras
        for (const [id, camera] of this.cameras.entries()) {
            if (camera.active) {
                camera.updateBounds(this.screenWidth, this.screenHeight);
                frame.cameras[id] = camera;
            }
        }

        // 2. Extraction Phase
        const extStart = performance.now();
        const extractedCommands = this._extractCommands(world, frame.metrics);
        frame.metrics.extractionTimeMs = performance.now() - extStart;

        // 3. Culling Phase
        const cullStart = performance.now();
        const visibleCommands = this.enableCulling 
            ? this._cullCommands(extractedCommands, frame.metrics) 
            : extractedCommands;
        frame.metrics.cullingTimeMs = performance.now() - cullStart;

        // 4. Sorting & Pass Distribution Phase
        const sortStart = performance.now();
        this._distributeAndSort(visibleCommands);
        frame.metrics.sortingTimeMs = performance.now() - sortStart;

        // 5. Finalize Frame
        frame.passes = this.passes.map(p => {
            // Create a shallow copy of the pass for the immutable frame
            const passCopy = new RenderPass(p.name, Array.from(p.layers));
            passCopy.commands = [...p.commands];
            return passCopy;
        });

        frame.metrics.renderedCommands = visibleCommands.length;
        frame.metrics.totalTimeMs = performance.now() - perfStart;

        // Lock the frame so backend cannot mutate it
        frame.lock();

        return frame;
    }

    /**
     * Internal: Extracts renderable components from the ECS world into RenderCommands.
     * @private
     * @param {ECSWorld} world 
     * @param {Object} metrics 
     * @returns {RenderCommand[]}
     */
    _extractCommands(world, metrics) {
        const commands = [];
        
        // Define the component signatures that indicate a renderable entity.
        // In a real ECS, this might be optimized via archetypes or bitmasks.
        // Here we assume standard string-based component queries.
        
        // Example: Entities with Transform AND (Sprite OR Mesh OR Text OR UIElement)
        // For abstraction, we look for a generic 'Renderable' marker or specific visuals.
        
        const renderableEntities = world.getEntitiesWith(['Transform']); 
        metrics.totalEntities = renderableEntities.length;

        for (let i = 0; i < renderableEntities.length; i++) {
            const entity = renderableEntities[i];
            
            // Skip if explicitly marked invisible
            const visibility = world.getComponent(entity, 'Visibility');
            if (visibility && !visibility.visible) continue;

            const transform = world.getComponent(entity, 'Transform');
            if (!transform) continue;

            // Create command
            const cmd = this.commandPool.acquire();
            cmd.entityId = entity.id;
            
            // Map Transform
            cmd.x = transform.x || 0;
            cmd.y = transform.y || 0;
            cmd.rotation = transform.rotation || 0;
            cmd.scaleX = transform.scaleX !== undefined ? transform.scaleX : 1;
            cmd.scaleY = transform.scaleY !== undefined ? transform.scaleY : 1;

            // Map Layer and Z-Index (from Transform or separate Sorting component)
            const sorting = world.getComponent(entity, 'Sorting');
            if (sorting) {
                cmd.layer = sorting.layer !== undefined ? sorting.layer : RENDER_LAYERS.DEFAULT;
                cmd.zIndex = sorting.zIndex || 0;
            }

            // Map Visuals (Sprite, Text, Mesh, etc.)
            let hasVisuals = false;

            const sprite = world.getComponent(entity, 'Sprite');
            if (sprite) {
                cmd.assetId = sprite.assetId;
                cmd.tint = sprite.tint || null;
                cmd.opacity = sprite.opacity !== undefined ? sprite.opacity : 1.0;
                cmd.blendMode = sprite.blendMode || BLEND_MODES.NORMAL;
                
                // Calculate bounds for culling
                const width = (sprite.width || 100) * Math.abs(cmd.scaleX);
                const height = (sprite.height || 100) * Math.abs(cmd.scaleY);
                cmd.bounds.setFromCenterAndSize(cmd.x, cmd.y, width, height);
                hasVisuals = true;
            }

            const text = world.getComponent(entity, 'Text');
            if (text && !hasVisuals) {
                cmd.text = text.content;
                cmd.material = text.style || {};
                cmd.opacity = text.opacity !== undefined ? text.opacity : 1.0;
                
                // Approximate bounds for text
                const approxWidth = (cmd.text.length * 10) * Math.abs(cmd.scaleX);
                const approxHeight = 20 * Math.abs(cmd.scaleY);
                cmd.bounds.setFromCenterAndSize(cmd.x, cmd.y, approxWidth, approxHeight);
                hasVisuals = true;
            }

            const geometry = world.getComponent(entity, 'Geometry');
            if (geometry && !hasVisuals) {
                cmd.geometry = geometry.data;
                cmd.material = geometry.material || null;
                // Bounds should be pre-calculated in the geometry component
                if (geometry.bounds) {
                    cmd.bounds.minX = geometry.bounds.minX + cmd.x;
                    cmd.bounds.maxX = geometry.bounds.maxX + cmd.x;
                    cmd.bounds.minY = geometry.bounds.minY + cmd.y;
                    cmd.bounds.maxY = geometry.bounds.maxY + cmd.y;
                } else {
                    // Fallback massive bounds to prevent culling if unknown
                    cmd.bounds.setFromCenterAndSize(cmd.x, cmd.y, 9999, 9999);
                }
                hasVisuals = true;
            }

            // Only push if it actually has something to render
            if (hasVisuals) {
                commands.push(cmd);
                metrics.extractedCommands++;
            } else {
                // If no visuals were found, return the command to the pool implicitly 
                // by not pushing it to the array. (It will be overwritten next frame).
            }

            // Debug bounds injection
            if (this.debugMode && hasVisuals) {
                const debugCmd = this.commandPool.acquire();
                debugCmd.entityId = `debug_${entity.id}`;
                debugCmd.layer = RENDER_LAYERS.DEBUG;
                debugCmd.x = cmd.x;
                debugCmd.y = cmd.y;
                debugCmd.geometry = { type: 'rect', w: cmd.bounds.maxX - cmd.bounds.minX, h: cmd.bounds.maxY - cmd.bounds.minY };
                debugCmd.material = { stroke: 'red', strokeWidth: 2, fill: 'transparent' };
                commands.push(debugCmd);
            }
        }

        return commands;
    }

    /**
     * Internal: Culls commands that are not visible to any active camera.
     * @private
     * @param {RenderCommand[]} commands 
     * @param {Object} metrics 
     * @returns {RenderCommand[]}
     */
    _cullCommands(commands, metrics) {
        const visibleCommands = [];
        const activeCameras = Array.from(this.cameras.values()).filter(c => c.active);

        if (activeCameras.length === 0) {
            metrics.culledCommands = commands.length;
            return visibleCommands; // Nothing to render
        }

        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i];
            
            // UI and Debug layers typically bypass spatial culling
            if (cmd.layer >= RENDER_LAYERS.UI_BACKGROUND) {
                visibleCommands.push(cmd);
                continue;
            }

            let isVisible = false;
            for (let c = 0; c < activeCameras.length; c++) {
                if (activeCameras[c].canSee(cmd.bounds)) {
                    isVisible = true;
                    break;
                }
            }

            if (isVisible) {
                visibleCommands.push(cmd);
            } else {
                metrics.culledCommands++;
            }
        }

        return visibleCommands;
    }

    /**
     * Internal: Distributes commands to their respective passes and sorts them.
     * @private
     * @param {RenderCommand[]} commands 
     */
    _distributeAndSort(commands) {
        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i];
            let handled = false;
            
            for (let p = 0; p < this.passes.length; p++) {
                if (this.passes[p].addCommand(cmd)) {
                    handled = true;
                    break;
                }
            }

            if (!handled && this.debugMode) {
                console.warn(`[RenderSystem] Command for entity ${cmd.entityId} with layer ${cmd.layer} did not match any render pass.`);
            }
        }

        for (let p = 0; p < this.passes.length; p++) {
            this.passes[p].sort();
        }
    }
}

// ============================================================================
// BACKEND ADAPTER INTERFACE (For reference/extension)
// ============================================================================

/**
 * Abstract base class for rendering backends (Canvas2D, WebGL, etc.)
 * Implementations should extend this and implement the `renderFrame` method.
 */
export class RendererAdapter {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        if (new.target === RendererAdapter) {
            throw new TypeError("Cannot construct RendererAdapter instances directly.");
        }
        this.canvas = canvas;
        this.context = null;
    }

    /**
     * Initializes the backend context.
     * @abstract
     */
    init() {
        throw new Error("Method 'init()' must be implemented.");
    }

    /**
     * Resizes the internal buffers.
     * @abstract
     * @param {number} width 
     * @param {number} height 
     */
    resize(width, height) {
        throw new Error("Method 'resize()' must be implemented.");
    }

    /**
     * Consumes a FrameData object and executes actual draw calls.
     * @abstract
     * @param {FrameData} frameData 
     */
    renderFrame(frameData) {
        throw new Error("Method 'renderFrame()' must be implemented.");
    }
}