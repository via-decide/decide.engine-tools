/**
 * @fileoverview Decide Engine - Core Graphics Backend
 * @module core/graphics
 * @description
 * High-performance WebGL-based graphics backend for the Decide Engine.
 * This module is responsible for transforming abstract render commands into real GPU draw calls,
 * managing the WebGL context, shader programs, buffers, textures, and rendering state.
 * It provides a robust abstraction layer over WebGL 1.0 and 2.0 to ensure maximum compatibility
 * and performance across different browser environments within the unified dashboard.
 * 
 * @version 3.0.0-beast
 * @author ViaDecide Antigravity Synthesis Orchestrator
 */

/**
 * Custom error class for Graphics-related exceptions.
 * @class
 * @extends Error
 */
class GraphicsError extends Error {
    /**
     * @param {string} message - The error message.
     * @param {Object} [details] - Additional contextual details about the error.
     */
    constructor(message, details = null) {
        super(message);
        this.name = 'GraphicsError';
        this.details = details;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GraphicsError);
        }
    }
}

/**
 * Enum for Render Command Types.
 * @readonly
 * @enum {number}
 */
export const CommandType = {
    CLEAR: 0,
    BIND_SHADER: 1,
    SET_UNIFORM: 2,
    BIND_VERTEX_ARRAY: 3,
    BIND_TEXTURE: 4,
    DRAW_ARRAYS: 5,
    DRAW_ELEMENTS: 6,
    UPDATE_VIEWPORT: 7,
    SET_BLEND_MODE: 8,
    SET_DEPTH_TEST: 9,
    SET_CULL_FACE: 10
};

/**
 * Enum for Blend Modes to keep abstract from raw WebGL constants.
 * @readonly
 * @enum {number}
 */
export const BlendMode = {
    NONE: 0,
    ALPHA: 1,
    ADDITIVE: 2,
    MULTIPLY: 3
};

/**
 * Configuration options for the Graphics Backend.
 * @typedef {Object} GraphicsConfig
 * @property {boolean} [alpha=true] - Whether the canvas contains an alpha buffer.
 * @property {boolean} [antialias=true] - Whether to perform anti-aliasing.
 * @property {boolean} [depth=true] - Whether the drawing buffer has a depth buffer of at least 16 bits.
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - Fail context creation if performance would be poor.
 * @property {boolean} [premultipliedAlpha=true] - Whether the color channels are premultiplied by the alpha channel.
 * @property {boolean} [preserveDrawingBuffer=false] - Whether to preserve the buffers until cleared or overwritten.
 * @property {boolean} [stencil=false] - Whether the drawing buffer has a stencil buffer of at least 8 bits.
 * @property {number} [pixelRatio=window.devicePixelRatio] - The pixel ratio to scale the canvas rendering surface.
 */

/**
 * The primary Graphics Backend Engine.
 * Manages the WebGL state machine, resource caching, and command execution.
 * @class
 */
export class DecideGraphicsBackend {
    /**
     * Initializes a new instance of the DecideGraphicsBackend.
     * @param {HTMLCanvasElement|string} canvas - The canvas element or its DOM ID.
     * @param {GraphicsConfig} [config={}] - Configuration options for the WebGL context.
     * @throws {GraphicsError} If the canvas cannot be found or WebGL is not supported.
     */
    constructor(canvas, config = {}) {
        /** @type {HTMLCanvasElement} */
        this.canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

        if (!this.canvas || !(this.canvas instanceof HTMLCanvasElement)) {
            throw new GraphicsError('Invalid canvas element provided to GraphicsBackend.');
        }

        /** @type {GraphicsConfig} */
        this.config = {
            alpha: true,
            antialias: true,
            depth: true,
            failIfMajorPerformanceCaveat: false,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            stencil: false,
            pixelRatio: window.devicePixelRatio || 1,
            ...config
        };

        /** @type {WebGLRenderingContext|WebGL2RenderingContext} */
        this.gl = null;
        
        /** @type {boolean} */
        this.isWebGL2 = false;

        /** @type {Object<string, *>} Cached WebGL extensions */
        this.extensions = {};

        /** @type {Object} Capabilities of the current GPU/Context */
        this.caps = {
            maxTextureSize: 0,
            maxRenderBufferSize: 0,
            maxTextureImageUnits: 0,
            maxVertexAttribs: 0,
            maxVertexUniformVectors: 0,
            maxFragmentUniformVectors: 0,
            vendor: '',
            renderer: ''
        };

        // Internal State Cache to minimize redundant WebGL calls
        this._state = {
            currentProgram: null,
            currentVao: null,
            boundTextures: new Array(16).fill(null),
            activeTextureUnit: 0,
            blendMode: null,
            depthTest: null,
            cullFace: null,
            viewport: { x: 0, y: 0, width: 0, height: 0 },
            clearColor: [0, 0, 0, 0]
        };

        // Resource Registries
        this._programs = new Map();
        this._buffers = new Map();
        this._textures = new Map();
        this._vaos = new Map();

        // Bind context loss handlers
        this._handleContextLost = this._handleContextLost.bind(this);
        this._handleContextRestored = this._handleContextRestored.bind(this);

        this.canvas.addEventListener('webglcontextlost', this._handleContextLost, false);
        this.canvas.addEventListener('webglcontextrestored', this._handleContextRestored, false);

        this._initializeContext();
    }

    /**
     * Attempts to initialize the WebGL context, preferring WebGL2 with a fallback to WebGL1.
     * @private
     * @throws {GraphicsError} If WebGL initialization fails completely.
     */
    _initializeContext() {
        const contextAttributes = {
            alpha: this.config.alpha,
            antialias: this.config.antialias,
            depth: this.config.depth,
            failIfMajorPerformanceCaveat: this.config.failIfMajorPerformanceCaveat,
            premultipliedAlpha: this.config.premultipliedAlpha,
            preserveDrawingBuffer: this.config.preserveDrawingBuffer,
            stencil: this.config.stencil
        };

        // Attempt WebGL 2 first
        this.gl = this.canvas.getContext('webgl2', contextAttributes);
        if (this.gl) {
            this.isWebGL2 = true;
            console.info('[DecideGraphicsBackend] WebGL 2.0 context initialized successfully.');
        } else {
            // Fallback to WebGL 1
            const gl1Names = ['webgl', 'experimental-webgl'];
            for (const name of gl1Names) {
                this.gl = this.canvas.getContext(name, contextAttributes);
                if (this.gl) {
                    this.isWebGL2 = false;
                    console.warn(`[DecideGraphicsBackend] WebGL 2.0 not supported. Fallback to ${name} successful.`);
                    break;
                }
            }
        }

        if (!this.gl) {
            throw new GraphicsError('Failed to initialize WebGL context. Your browser or hardware may not support it.');
        }

        this._loadExtensions();
        this._extractCapabilities();
        this._setupDefaultState();
        this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    /**
     * Loads necessary WebGL extensions depending on the context version.
     * @private
     */
    _loadExtensions() {
        const gl = this.gl;
        const requireExtension = (name) => {
            const ext = gl.getExtension(name);
            if (ext) this.extensions[name] = ext;
            return ext;
        };

        if (!this.isWebGL2) {
            // Essential polyfills for WebGL 1 to behave more like WebGL 2
            requireExtension('OES_vertex_array_object');
            requireExtension('ANGLE_instanced_arrays');
            requireExtension('OES_element_index_uint');
            requireExtension('OES_standard_derivatives');
            requireExtension('WEBGL_depth_texture');
        }

        // Extensions useful for both
        requireExtension('EXT_texture_filter_anisotropic');
        requireExtension('WEBGL_lose_context');
        requireExtension('WEBGL_debug_renderer_info');
    }

    /**
     * Extracts and caches hardware capabilities.
     * @private
     */
    _extractCapabilities() {
        const gl = this.gl;
        this.caps.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.caps.maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        this.caps.maxTextureImageUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this.caps.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this.caps.maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this.caps.maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

        const debugInfo = this.extensions['WEBGL_debug_renderer_info'];
        if (debugInfo) {
            this.caps.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            this.caps.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        } else {
            this.caps.vendor = gl.getParameter(gl.VENDOR);
            this.caps.renderer = gl.getParameter(gl.RENDERER);
        }
    }

    /**
     * Sets up the default WebGL state machine configuration.
     * @private
     */
    _setupDefaultState() {
        const gl = this.gl;
        
        // Default Clear Color (Transparent Black)
        this.setClearColor(0.0, 0.0, 0.0, 0.0);
        
        // Enable Depth Testing by default
        this.setDepthTest(true);
        gl.depthFunc(gl.LEQUAL);

        // Enable Culling by default
        this.setCullFace(true);
        gl.cullFace(gl.BACK);

        // Setup default blending (Alpha blending)
        this.setBlendMode(BlendMode.ALPHA);
    }

    /**
     * Handles the WebGL context lost event.
     * @private
     * @param {Event} event 
     */
    _handleContextLost(event) {
        event.preventDefault();
        console.error('[DecideGraphicsBackend] WebGL Context Lost! Rendering paused.');
        // In a full engine, we would notify the main loop to pause rendering
    }

    /**
     * Handles the WebGL context restored event.
     * @private
     */
    _handleContextRestored() {
        console.info('[DecideGraphicsBackend] WebGL Context Restored. Reinitializing resources...');
        this._initializeContext();
        // Here we would typically trigger an event for the engine to reload all textures, buffers, and shaders.
    }

    /**
     * Resizes the canvas rendering surface and updates the WebGL viewport.
     * @param {number} width - Logical width in pixels.
     * @param {number} height - Logical height in pixels.
     */
    resize(width, height) {
        const targetWidth = Math.floor(width * this.config.pixelRatio);
        const targetHeight = Math.floor(height * this.config.pixelRatio);

        if (this.canvas.width !== targetWidth || this.canvas.height !== targetHeight) {
            this.canvas.width = targetWidth;
            this.canvas.height = targetHeight;
            
            // CSS size
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
        }

        this.setViewport(0, 0, targetWidth, targetHeight);
    }

    /**
     * Clears the active frame buffer.
     * @param {boolean} [color=true] - Clear color buffer.
     * @param {boolean} [depth=true] - Clear depth buffer.
     * @param {boolean} [stencil=false] - Clear stencil buffer.
     */
    clear(color = true, depth = true, stencil = false) {
        const gl = this.gl;
        let mask = 0;
        if (color) mask |= gl.COLOR_BUFFER_BIT;
        if (depth) mask |= gl.DEPTH_BUFFER_BIT;
        if (stencil) mask |= gl.STENCIL_BUFFER_BIT;
        
        if (mask !== 0) {
            gl.clear(mask);
        }
    }

    /**
     * Sets the clear color. Caches the state to prevent redundant calls.
     * @param {number} r - Red channel (0.0 - 1.0)
     * @param {number} g - Green channel (0.0 - 1.0)
     * @param {number} b - Blue channel (0.0 - 1.0)
     * @param {number} a - Alpha channel (0.0 - 1.0)
     */
    setClearColor(r, g, b, a) {
        const cc = this._state.clearColor;
        if (cc[0] !== r || cc[1] !== g || cc[2] !== b || cc[3] !== a) {
            this.gl.clearColor(r, g, b, a);
            cc[0] = r; cc[1] = g; cc[2] = b; cc[3] = a;
        }
    }

    /**
     * Updates the WebGL viewport.
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    setViewport(x, y, width, height) {
        const vp = this._state.viewport;
        if (vp.x !== x || vp.y !== y || vp.width !== width || vp.height !== height) {
            this.gl.viewport(x, y, width, height);
            vp.x = x; vp.y = y; vp.width = width; vp.height = height;
        }
    }

    /**
     * Toggles depth testing.
     * @param {boolean} enabled 
     */
    setDepthTest(enabled) {
        if (this._state.depthTest !== enabled) {
            if (enabled) this.gl.enable(this.gl.DEPTH_TEST);
            else this.gl.disable(this.gl.DEPTH_TEST);
            this._state.depthTest = enabled;
        }
    }

    /**
     * Toggles face culling.
     * @param {boolean} enabled 
     */
    setCullFace(enabled) {
        if (this._state.cullFace !== enabled) {
            if (enabled) this.gl.enable(this.gl.CULL_FACE);
            else this.gl.disable(this.gl.CULL_FACE);
            this._state.cullFace = enabled;
        }
    }

    /**
     * Configures the blending mode.
     * @param {number} mode - Use BlendMode enum.
     */
    setBlendMode(mode) {
        if (this._state.blendMode === mode) return;

        const gl = this.gl;
        if (mode === BlendMode.NONE) {
            gl.disable(gl.BLEND);
        } else {
            gl.enable(gl.BLEND);
            switch (mode) {
                case BlendMode.ALPHA:
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case BlendMode.ADDITIVE:
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                    break;
                case BlendMode.MULTIPLY:
                    gl.blendFunc(gl.DST_COLOR, gl.ZERO);
                    break;
                default:
                    console.warn(`[DecideGraphicsBackend] Unknown blend mode: ${mode}`);
            }
        }
        this._state.blendMode = mode;
    }

    // ============================================================================
    // RESOURCE CREATION & MANAGEMENT
    // ============================================================================

    /**
     * Compiles a shader from source.
     * @private
     * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @param {string} source - GLSL source code
     * @returns {WebGLShader} Compiled shader
     * @throws {GraphicsError} If compilation fails
     */
    _compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            const typeName = type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment';
            throw new GraphicsError(`Failed to compile ${typeName} shader:\n${info}\nSource:\n${source}`);
        }
        return shader;
    }

    /**
     * Creates, links, and caches a WebGL shader program.
     * @param {string} id - Unique identifier for the shader program.
     * @param {string} vertexSource - Vertex shader GLSL source.
     * @param {string} fragmentSource - Fragment shader GLSL source.
     * @returns {Object} The internal program representation.
     */
    createProgram(id, vertexSource, fragmentSource) {
        if (this._programs.has(id)) {
            console.warn(`[DecideGraphicsBackend] Program with ID '${id}' already exists. Overwriting.`);
            this.deleteProgram(id);
        }

        const gl = this.gl;
        const vertexShader = this._compileShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this._compileShader(gl.FRAGMENT_SHADER, fragmentSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new GraphicsError(`Failed to link shader program '${id}':\n${info}`);
        }

        // Clean up individual shaders as they are now linked
        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        // Introspect active uniforms and attributes for faster binding later
        const uniforms = {};
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; ++i) {
            const info = gl.getActiveUniform(program, i);
            if (!info) continue;
            uniforms[info.name] = {
                location: gl.getUniformLocation(program, info.name),
                type: info.type,
                size: info.size
            };
        }

        const attributes = {};
        const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttribs; ++i) {
            const info = gl.getActiveAttrib(program, i);
            if (!info) continue;
            attributes[info.name] = {
                location: gl.getAttribLocation(program, info.name),
                type: info.type,
                size: info.size
            };
        }

        const programData = { id, glProgram: program, uniforms, attributes };
        this._programs.set(id, programData);
        return programData;
    }

    /**
     * Binds a shader program for rendering.
     * @param {string} id - The ID of the program to bind.
     */
    bindProgram(id) {
        const programData = this._programs.get(id);
        if (!programData) throw new GraphicsError(`Cannot bind unknown program: ${id}`);

        if (this._state.currentProgram !== programData.glProgram) {
            this.gl.useProgram(programData.glProgram);
            this._state.currentProgram = programData.glProgram;
        }
    }

    /**
     * Creates a Vertex Array Object (VAO) to encapsulate buffer and attribute states.
     * Gracefully handles WebGL 1 fallback via OES_vertex_array_object.
     * @param {string} id - Unique identifier for the VAO.
     * @returns {WebGLVertexArrayObject|Object} The created VAO.
     */
    createVertexArray(id) {
        let vao;
        if (this.isWebGL2) {
            vao = this.gl.createVertexArray();
        } else {
            const ext = this.extensions['OES_vertex_array_object'];
            if (ext) {
                vao = ext.createVertexArrayOES();
            } else {
                throw new GraphicsError('Vertex Array Objects are not supported on this device.');
            }
        }
        this._vaos.set(id, vao);
        return vao;
    }

    /**
     * Binds a Vertex Array Object.
     * @param {string} id - The ID of the VAO to bind. Pass null to unbind.
     */
    bindVertexArray(id) {
        if (id === null) {
            if (this.isWebGL2) this.gl.bindVertexArray(null);
            else this.extensions['OES_vertex_array_object'].bindVertexArrayOES(null);
            this._state.currentVao = null;
            return;
        }

        const vao = this._vaos.get(id);
        if (!vao) throw new GraphicsError(`Cannot bind unknown VAO: ${id}`);

        if (this._state.currentVao !== vao) {
            if (this.isWebGL2) this.gl.bindVertexArray(vao);
            else this.extensions['OES_vertex_array_object'].bindVertexArrayOES(vao);
            this._state.currentVao = vao;
        }
    }

    /**
     * Creates a WebGL Buffer (VBO/IBO).
     * @param {string} id - Unique identifier.
     * @param {ArrayBufferView} data - The typed array containing the data.
     * @param {number} target - gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER.
     * @param {number} usage - gl.STATIC_DRAW, gl.DYNAMIC_DRAW, etc.
     */
    createBuffer(id, data, target, usage) {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, data, usage);
        this._buffers.set(id, { glBuffer: buffer, target, usage, byteLength: data.byteLength });
        // Unbind to prevent accidental modification
        gl.bindBuffer(target, null);
    }

    /**
     * Creates a WebGL Texture from an image source.
     * @param {string} id - Unique identifier.
     * @param {HTMLImageElement|HTMLCanvasElement|ImageData|null} source - Image source.
     * @param {Object} options - Texture parameters.
     */
    createTexture(id, source, options = {}) {
        const gl = this.gl;
        const texture = gl.createTexture();
        
        const target = options.target || gl.TEXTURE_2D;
        const internalFormat = options.internalFormat || gl.RGBA;
        const format = options.format || gl.RGBA;
        const type = options.type || gl.UNSIGNED_BYTE;
        
        gl.bindTexture(target, texture);

        // Default parameters
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, options.wrapS || gl.CLAMP_TO_EDGE);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, options.wrapT || gl.CLAMP_TO_EDGE);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, options.minFilter || gl.LINEAR);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, options.magFilter || gl.LINEAR);

        if (source) {
            gl.texImage2D(target, 0, internalFormat, format, type, source);
            if (options.generateMipmaps) {
                gl.generateMipmap(target);
            }
        } else if (options.width && options.height) {
            // Create empty texture
            gl.texImage2D(target, 0, internalFormat, options.width, options.height, 0, format, type, null);
        }

        gl.bindTexture(target, null);
        this._textures.set(id, { glTexture: texture, target, width: options.width, height: options.height });
    }

    /**
     * Binds a texture to a specific texture unit.
     * @param {string} id - The ID of the texture.
     * @param {number} unit - The texture unit index (0-31).
     */
    bindTexture(id, unit = 0) {
        const gl = this.gl;
        const texData = this._textures.get(id);
        if (!texData) throw new GraphicsError(`Cannot bind unknown texture: ${id}`);

        if (this._state.activeTextureUnit !== unit) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            this._state.activeTextureUnit = unit;
        }

        if (this._state.boundTextures[unit] !== texData.glTexture) {
            gl.bindTexture(texData.target, texData.glTexture);
            this._state.boundTextures[unit] = texData.glTexture;
        }
    }

    // ============================================================================
    // COMMAND EXECUTION PIPELINE
    // ============================================================================

    /**
     * Executes an array of abstract render commands sequentially.
     * This is the core bridge between the engine's higher-level logic and the GPU.
     * 
     * Command Schema Example:
     * {
     *   type: CommandType.DRAW_ELEMENTS,
     *   mode: gl.TRIANGLES,
     *   count: 6,
     *   dataType: gl.UNSIGNED_SHORT,
     *   offset: 0
     * }
     * 
     * @param {Array<Object>} commandQueue - The list of commands to execute.
     */
    executeRenderCommands(commandQueue) {
        const gl = this.gl;
        const len = commandQueue.length;

        for (let i = 0; i < len; i++) {
            const cmd = commandQueue[i];

            switch (cmd.type) {
                case CommandType.CLEAR:
                    this.clear(cmd.color, cmd.depth, cmd.stencil);
                    break;

                case CommandType.BIND_SHADER:
                    this.bindProgram(cmd.id);
                    break;

                case CommandType.BIND_VERTEX_ARRAY:
                    this.bindVertexArray(cmd.id);
                    break;

                case CommandType.BIND_TEXTURE:
                    this.bindTexture(cmd.id, cmd.unit);
                    break;

                case CommandType.SET_UNIFORM:
                    this._applyUniform(cmd.name, cmd.value, cmd.uniformType);
                    break;

                case CommandType.UPDATE_VIEWPORT:
                    this.setViewport(cmd.x, cmd.y, cmd.width, cmd.height);
                    break;

                case CommandType.SET_BLEND_MODE:
                    this.setBlendMode(cmd.mode);
                    break;

                case CommandType.SET_DEPTH_TEST:
                    this.setDepthTest(cmd.enabled);
                    break;

                case CommandType.SET_CULL_FACE:
                    this.setCullFace(cmd.enabled);
                    break;

                case CommandType.DRAW_ARRAYS:
                    gl.drawArrays(cmd.mode, cmd.first, cmd.count);
                    break;

                case CommandType.DRAW_ELEMENTS:
                    gl.drawElements(cmd.mode, cmd.count, cmd.dataType, cmd.offset);
                    break;

                default:
                    console.warn(`[DecideGraphicsBackend] Unrecognized command type: ${cmd.type}`);
                    break;
            }
        }
    }

    /**
     * Applies a uniform value to the currently bound shader program.
     * @private
     * @param {string} name - Uniform name.
     * @param {number|Array<number>|Float32Array} value - The data to upload.
     * @param {string} type - String representation of the uniform type (e.g., '1f', '3fv', 'Matrix4fv').
     */
    _applyUniform(name, value, type) {
        const gl = this.gl;
        const currentProg = this._state.currentProgram;
        if (!currentProg) {
            console.warn(`[DecideGraphicsBackend] Attempted to set uniform '${name}' without a bound program.`);
            return;
        }

        // Find program data by looking up the glProgram reference
        // In a hyper-optimized path, the command would pass the cached location directly.
        // For robustness, we look it up.
        let progData = null;
        for (const data of this._programs.values()) {
            if (data.glProgram === currentProg) {
                progData = data;
                break;
            }
        }

        if (!progData || !progData.uniforms[name]) return; // Uniform optimized out or doesn't exist

        const location = progData.uniforms[name].location;

        switch (type) {
            case '1i': gl.uniform1i(location, value); break;
            case '1f': gl.uniform1f(location, value); break;
            case '2fv': gl.uniform2fv(location, value); break;
            case '3fv': gl.uniform3fv(location, value); break;
            case '4fv': gl.uniform4fv(location, value); break;
            case 'Matrix3fv': gl.uniformMatrix3fv(location, false, value); break;
            case 'Matrix4fv': gl.uniformMatrix4fv(location, false, value); break;
            default:
                console.warn(`[DecideGraphicsBackend] Unsupported uniform type: ${type}`);
        }
    }

    /**
     * Destroys the graphics context and releases all GPU resources.
     * Critical for preventing memory leaks in single-page applications.
     */
    dispose() {
        console.info('[DecideGraphicsBackend] Disposing graphics resources...');
        const gl = this.gl;

        // Delete all Programs
        for (const prog of this._programs.values()) {
            gl.deleteProgram(prog.glProgram);
        }
        this._programs.clear();

        // Delete all Buffers
        for (const buf of this._buffers.values()) {
            gl.deleteBuffer(buf.glBuffer);
        }
        this._buffers.clear();

        // Delete all Textures
        for (const tex of this._textures.values()) {
            gl.deleteTexture(tex.glTexture);
        }
        this._textures.clear();

        // Delete all VAOs
        for (const vao of this._vaos.values()) {
            if (this.isWebGL2) gl.deleteVertexArray(vao);
            else this.extensions['OES_vertex_array_object'].deleteVertexArrayOES(vao);
        }
        this._vaos.clear();

        // Remove event listeners
        this.canvas.removeEventListener('webglcontextlost', this._handleContextLost);
        this.canvas.removeEventListener('webglcontextrestored', this._handleContextRestored);

        // Attempt to lose context to free up hardware resources immediately
        const loseCtxExt = this.extensions['WEBGL_lose_context'];
        if (loseCtxExt) {
            loseCtxExt.loseContext();
        }

        this.gl = null;
    }
}