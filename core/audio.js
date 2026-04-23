/**
 * @fileoverview Decide Engine - Core Audio System
 * @module core/audio
 * @description
 * High-performance, AAA-ready Web Audio API wrapper integrated with the Decide Engine ECS
 * and Asset Pipeline. Provides comprehensive support for 3D spatialization, audio routing
 * (buses), dynamic asset loading, pausing/resuming, and entity-component synchronization.
 * 
 * Features:
 * - Master, SFX, UI, and Music buses with independent gain control.
 * - 3D Spatial Audio using PannerNodes (HRTF and equalpower panning).
 * - ECS Integration: AudioComponent and AudioSystem for automatic spatial updates.
 * - Asset Pipeline: Asynchronous audio buffer decoding and caching.
 * - Accurate pause/resume/stop functionality tracking playback offsets.
 * - Fallback handling for legacy browsers and strict autoplay policy management.
 */

'use strict';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const AUDIO_STATE = {
    UNINITIALIZED: 'uninitialized',
    SUSPENDED: 'suspended',
    RUNNING: 'running',
    CLOSED: 'closed'
};

const PANNING_MODEL = {
    EQUALPOWER: 'equalpower',
    HRTF: 'HRTF' // High quality 3D audio
};

const DISTANCE_MODEL = {
    LINEAR: 'linear',
    INVERSE: 'inverse',
    EXPONENTIAL: 'exponential'
};

const DEFAULT_SPATIAL_CONFIG = {
    panningModel: PANNING_MODEL.HRTF,
    distanceModel: DISTANCE_MODEL.INVERSE,
    refDistance: 1.0,
    maxDistance: 10000.0,
    rolloffFactor: 1.0,
    coneInnerAngle: 360,
    coneOuterAngle: 360,
    coneOuterGain: 0
};

// ============================================================================
// AUDIO BUS SYSTEM
// ============================================================================

/**
 * Represents a routing bus for audio signals (e.g., Master, SFX, Music).
 * Allows grouping of sounds and applying collective volume or effects.
 */
export class AudioBus {
    /**
     * @param {AudioContext} context - The Web Audio API context.
     * @param {string} name - The identifier for this bus.
     * @param {AudioNode} destination - The node this bus connects to.
     */
    constructor(context, name, destination) {
        this.context = context;
        this.name = name;
        this.gainNode = context.createGain();
        this.gainNode.connect(destination);
        this._volume = 1.0;
        this._muted = false;
    }

    /**
     * Sets the volume of the bus.
     * @param {number} value - Volume level (0.0 to 1.0+).
     * @param {number} [rampTime=0.05] - Time to ramp to the new volume to prevent clicks.
     */
    setVolume(value, rampTime = 0.05) {
        this._volume = Math.max(0, value);
        const targetGain = this._muted ? 0 : this._volume;
        this.gainNode.gain.setTargetAtTime(targetGain, this.context.currentTime, rampTime);
    }

    /**
     * Gets the current unmuted volume.
     * @returns {number}
     */
    getVolume() {
        return this._volume;
    }

    /**
     * Mutes or unmutes the bus.
     * @param {boolean} isMuted 
     */
    setMuted(isMuted) {
        this._muted = isMuted;
        this.setVolume(this._volume);
    }

    /**
     * Returns the underlying Web Audio node for connection.
     * @returns {GainNode}
     */
    getInputNode() {
        return this.gainNode;
    }
}

// ============================================================================
// AUDIO ASSET MANAGER
// ============================================================================

/**
 * Handles fetching, decoding, and caching of audio files.
 */
export class AudioResourceManager {
    /**
     * @param {AudioContext} context 
     */
    constructor(context) {
        this.context = context;
        /** @type {Map<string, AudioBuffer>} */
        this.buffers = new Map();
        /** @type {Map<string, Promise<AudioBuffer>>} */
        this.loadingPromises = new Map();
    }

    /**
     * Loads an audio file from a URL and decodes it.
     * @param {string} id - Unique identifier for the asset.
     * @param {string} url - The URL of the audio file.
     * @returns {Promise<AudioBuffer>}
     */
    async load(id, url) {
        if (this.buffers.has(id)) {
            return this.buffers.get(id);
        }

        if (this.loadingPromises.has(id)) {
            return this.loadingPromises.get(id);
        }

        const loadPromise = (async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch audio asset: ${url} (Status: ${response.status})`);
                }
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                this.buffers.set(id, audioBuffer);
                this.loadingPromises.delete(id);
                return audioBuffer;
            } catch (error) {
                console.error(`[AudioResourceManager] Error loading audio '${id}':`, error);
                this.loadingPromises.delete(id);
                throw error;
            }
        })();

        this.loadingPromises.set(id, loadPromise);
        return loadPromise;
    }

    /**
     * Retrieves a cached AudioBuffer.
     * @param {string} id 
     * @returns {AudioBuffer|null}
     */
    get(id) {
        return this.buffers.get(id) || null;
    }

    /**
     * Removes an AudioBuffer from the cache.
     * @param {string} id 
     */
    unload(id) {
        this.buffers.delete(id);
    }
}

// ============================================================================
// SOUND INSTANCE
// ============================================================================

/**
 * Represents a single playing instance of a sound.
 * Handles pausing, resuming, looping, and spatialization nodes.
 */
export class SoundInstance {
    /**
     * @param {AudioEngine} engine - Reference to the main audio engine.
     * @param {AudioBuffer} buffer - The decoded audio data.
     * @param {Object} options - Playback configuration.
     */
    constructor(engine, buffer, options = {}) {
        this.engine = engine;
        this.context = engine.context;
        this.buffer = buffer;
        
        this.id = options.id || crypto.randomUUID();
        this.bus = options.bus ? engine.getBus(options.bus) : engine.getBus('sfx');
        
        this.volume = options.volume !== undefined ? options.volume : 1.0;
        this.loop = !!options.loop;
        this.playbackRate = options.playbackRate || 1.0;
        this.isSpatial = !!options.spatial;

        // Playback state tracking for pause/resume
        this.startTime = 0;
        this.pausedAt = 0;
        this.isPlaying = false;
        this.isPaused = false;
        
        // Web Audio Nodes
        this.sourceNode = null;
        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = this.volume;
        
        this.pannerNode = null;
        
        if (this.isSpatial) {
            this._setupSpatialNode(options.spatialConfig || {});
            this.gainNode.connect(this.pannerNode);
            this.pannerNode.connect(this.bus.getInputNode());
        } else {
            this.gainNode.connect(this.bus.getInputNode());
        }

        // Callbacks
        this.onEnded = options.onEnded || null;
        this._handleEnded = this._handleEnded.bind(this);
    }

    /**
     * @private
     * @param {Object} config 
     */
    _setupSpatialNode(config) {
        this.pannerNode = this.context.createPanner();
        this.pannerNode.panningModel = config.panningModel || DEFAULT_SPATIAL_CONFIG.panningModel;
        this.pannerNode.distanceModel = config.distanceModel || DEFAULT_SPATIAL_CONFIG.distanceModel;
        this.pannerNode.refDistance = config.refDistance !== undefined ? config.refDistance : DEFAULT_SPATIAL_CONFIG.refDistance;
        this.pannerNode.maxDistance = config.maxDistance !== undefined ? config.maxDistance : DEFAULT_SPATIAL_CONFIG.maxDistance;
        this.pannerNode.rolloffFactor = config.rolloffFactor !== undefined ? config.rolloffFactor : DEFAULT_SPATIAL_CONFIG.rolloffFactor;
        this.pannerNode.coneInnerAngle = config.coneInnerAngle !== undefined ? config.coneInnerAngle : DEFAULT_SPATIAL_CONFIG.coneInnerAngle;
        this.pannerNode.coneOuterAngle = config.coneOuterAngle !== undefined ? config.coneOuterAngle : DEFAULT_SPATIAL_CONFIG.coneOuterAngle;
        this.pannerNode.coneOuterGain = config.coneOuterGain !== undefined ? config.coneOuterGain : DEFAULT_SPATIAL_CONFIG.coneOuterGain;
    }

    /**
     * Starts or resumes playback.
     */
    play() {
        if (this.isPlaying) return;

        this.sourceNode = this.context.createBufferSource();
        this.sourceNode.buffer = this.buffer;
        this.sourceNode.loop = this.loop;
        this.sourceNode.playbackRate.value = this.playbackRate;
        
        this.sourceNode.connect(this.gainNode);
        this.sourceNode.onended = this._handleEnded;

        const offset = this.isPaused ? this.pausedAt : 0;
        this.startTime = this.context.currentTime - offset;
        
        this.sourceNode.start(0, offset);
        
        this.isPlaying = true;
        this.isPaused = false;
    }

    /**
     * Pauses playback, saving the current offset.
     */
    pause() {
        if (!this.isPlaying) return;

        this.sourceNode.onended = null; // Prevent triggering onEnded callback
        this.sourceNode.stop();
        this.pausedAt = (this.context.currentTime - this.startTime) % this.buffer.duration;
        
        this.isPlaying = false;
        this.isPaused = true;
    }

    /**
     * Stops playback entirely and resets the offset.
     */
    stop() {
        if (this.isPlaying && this.sourceNode) {
            this.sourceNode.onended = null;
            this.sourceNode.stop();
        }
        
        this.isPlaying = false;
        this.isPaused = false;
        this.pausedAt = 0;
        this.startTime = 0;
        
        if (this.onEnded) this.onEnded(this);
    }

    /**
     * Updates spatial position and orientation.
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} [ox=0] Orientation X
     * @param {number} [oy=0] Orientation Y
     * @param {number} [oz=1] Orientation Z
     */
    setPosition(x, y, z, ox = 0, oy = 0, oz = 1) {
        if (!this.isSpatial || !this.pannerNode) return;

        // Use modern AudioParam automation if available, fallback to legacy
        if (this.pannerNode.positionX) {
            const time = this.context.currentTime + 0.01;
            this.pannerNode.positionX.linearRampToValueAtTime(x, time);
            this.pannerNode.positionY.linearRampToValueAtTime(y, time);
            this.pannerNode.positionZ.linearRampToValueAtTime(z, time);
            this.pannerNode.orientationX.linearRampToValueAtTime(ox, time);
            this.pannerNode.orientationY.linearRampToValueAtTime(oy, time);
            this.pannerNode.orientationZ.linearRampToValueAtTime(oz, time);
        } else {
            this.pannerNode.setPosition(x, y, z);
            this.pannerNode.setOrientation(ox, oy, oz);
        }
    }

    /**
     * Sets the volume of this specific instance.
     * @param {number} volume 
     */
    setVolume(volume) {
        this.volume = volume;
        this.gainNode.gain.setTargetAtTime(volume, this.context.currentTime, 0.05);
    }

    /**
     * @private
     */
    _handleEnded() {
        if (!this.loop) {
            this.isPlaying = false;
            if (this.onEnded) this.onEnded(this);
            this.engine.removeActiveInstance(this.id);
        }
    }

    /**
     * Cleans up Web Audio nodes.
     */
    destroy() {
        this.stop();
        this.gainNode.disconnect();
        if (this.pannerNode) {
            this.pannerNode.disconnect();
        }
    }
}

// ============================================================================
// MAIN AUDIO ENGINE
// ============================================================================

/**
 * The core orchestrator for the Decide Engine Audio System.
 */
export class AudioEngine {
    constructor() {
        /** @type {AudioContext|null} */
        this.context = null;
        
        /** @type {Map<string, AudioBus>} */
        this.buses = new Map();
        
        /** @type {AudioResourceManager|null} */
        this.resources = null;
        
        /** @type {Map<string, SoundInstance>} */
        this.activeInstances = new Map();

        this.initialized = false;
        this.globalMuted = false;

        // Listener properties
        this.listenerPosition = { x: 0, y: 0, z: 0 };
        this.listenerForward = { x: 0, y: 0, z: -1 };
        this.listenerUp = { x: 0, y: 1, z: 0 };
    }

    /**
     * Initializes the Web Audio API. Must be called after a user interaction
     * to comply with browser autoplay policies.
     */
    init() {
        if (this.initialized) return;

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            console.error("[AudioEngine] Web Audio API is not supported in this browser.");
            return;
        }

        try {
            this.context = new AudioContextClass();
            this.resources = new AudioResourceManager(this.context);

            // Create default routing buses
            this.createBus('master', this.context.destination);
            this.createBus('sfx', this.getBus('master').getInputNode());
            this.createBus('music', this.getBus('master').getInputNode());
            this.createBus('ui', this.getBus('master').getInputNode());

            this.initialized = true;
            console.log("[AudioEngine] Initialized successfully. State:", this.context.state);

            // Handle suspended state (autoplay policy)
            if (this.context.state === AUDIO_STATE.SUSPENDED) {
                const resumeContext = () => {
                    this.context.resume().then(() => {
                        console.log("[AudioEngine] Context resumed via user interaction.");
                        document.removeEventListener('click', resumeContext);
                        document.removeEventListener('touchstart', resumeContext);
                        document.removeEventListener('keydown', resumeContext);
                    });
                };
                document.addEventListener('click', resumeContext);
                document.addEventListener('touchstart', resumeContext);
                document.addEventListener('keydown', resumeContext);
            }

        } catch (error) {
            console.error("[AudioEngine] Failed to initialize:", error);
        }
    }

    /**
     * Creates a new audio bus.
     * @param {string} name 
     * @param {AudioNode} destination 
     * @returns {AudioBus}
     */
    createBus(name, destination) {
        if (this.buses.has(name)) {
            console.warn(`[AudioEngine] Bus '${name}' already exists.`);
            return this.buses.get(name);
        }
        const bus = new AudioBus(this.context, name, destination);
        this.buses.set(name, bus);
        return bus;
    }

    /**
     * Retrieves an existing bus.
     * @param {string} name 
     * @returns {AudioBus}
     */
    getBus(name) {
        return this.buses.get(name) || this.buses.get('master');
    }

    /**
     * Preloads an audio asset.
     * @param {string} id 
     * @param {string} url 
     * @returns {Promise<AudioBuffer>}
     */
    loadAsset(id, url) {
        if (!this.initialized) throw new Error("AudioEngine not initialized.");
        return this.resources.load(id, url);
    }

    /**
     * Plays a sound.
     * @param {string} assetId - The ID of the loaded audio asset.
     * @param {Object} options - Playback options (volume, loop, spatial, etc.).
     * @returns {SoundInstance|null}
     */
    play(assetId, options = {}) {
        if (!this.initialized) {
            console.warn("[AudioEngine] Cannot play sound, engine not initialized.");
            return null;
        }

        const buffer = this.resources.get(assetId);
        if (!buffer) {
            console.warn(`[AudioEngine] Asset '${assetId}' not loaded.`);
            return null;
        }

        const instance = new SoundInstance(this, buffer, options);
        this.activeInstances.set(instance.id, instance);
        instance.play();

        return instance;
    }

    /**
     * Stops all active sound instances.
     */
    stopAll() {
        this.activeInstances.forEach(instance => instance.stop());
        this.activeInstances.clear();
    }

    /**
     * Pauses all active sound instances.
     */
    pauseAll() {
        this.activeInstances.forEach(instance => instance.pause());
    }

    /**
     * Resumes all paused sound instances.
     */
    resumeAll() {
        this.activeInstances.forEach(instance => {
            if (instance.isPaused) instance.play();
        });
    }

    /**
     * Global mute toggle.
     * @param {boolean} isMuted 
     */
    setMuted(isMuted) {
        this.globalMuted = isMuted;
        this.getBus('master').setMuted(isMuted);
    }

    /**
     * Updates the global listener position and orientation for 3D spatialization.
     * @param {Object} position - {x, y, z}
     * @param {Object} forward - {x, y, z}
     * @param {Object} up - {x, y, z}
     */
    setListenerTransform(position, forward, up) {
        if (!this.initialized) return;

        this.listenerPosition = position;
        this.listenerForward = forward;
        this.listenerUp = up;

        const listener = this.context.listener;
        const time = this.context.currentTime + 0.01;

        if (listener.positionX) {
            listener.positionX.linearRampToValueAtTime(position.x, time);
            listener.positionY.linearRampToValueAtTime(position.y, time);
            listener.positionZ.linearRampToValueAtTime(position.z, time);
            listener.forwardX.linearRampToValueAtTime(forward.x, time);
            listener.forwardY.linearRampToValueAtTime(forward.y, time);
            listener.forwardZ.linearRampToValueAtTime(forward.z, time);
            listener.upX.linearRampToValueAtTime(up.x, time);
            listener.upY.linearRampToValueAtTime(up.y, time);
            listener.upZ.linearRampToValueAtTime(up.z, time);
        } else {
            // Legacy fallback
            listener.setPosition(position.x, position.y, position.z);
            listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
        }
    }

    /**
     * Removes an instance from tracking. Called internally by SoundInstance.
     * @param {string} id 
     */
    removeActiveInstance(id) {
        const instance = this.activeInstances.get(id);
        if (instance) {
            instance.destroy();
            this.activeInstances.delete(id);
        }
    }
}

// ============================================================================
// ECS INTEGRATION: COMPONENTS & SYSTEMS
// ============================================================================

/**
 * ECS Component representing an audio source attached to an entity.
 */
export class AudioComponent {
    /**
     * @param {Object} config 
     * @param {string} config.assetId - The ID of the loaded audio asset.
     * @param {boolean} [config.playOnStart=false] - Auto-play when component is created.
     * @param {boolean} [config.loop=false] - Loop the audio.
     * @param {number} [config.volume=1.0] - Local volume.
     * @param {string} [config.bus='sfx'] - Target routing bus.
     * @param {boolean} [config.spatial=true] - Enable 3D spatialization.
     * @param {Object} [config.spatialConfig] - Overrides for spatial properties.
     */
    constructor(config) {
        this.assetId = config.assetId;
        this.playOnStart = !!config.playOnStart;
        this.loop = !!config.loop;
        this.volume = config.volume !== undefined ? config.volume : 1.0;
        this.bus = config.bus || 'sfx';
        
        this.spatial = config.spatial !== undefined ? config.spatial : true;
        this.spatialConfig = config.spatialConfig || {};

        /** @type {SoundInstance|null} */
        this.instance = null;
        this.isPlaying = false;
        
        // Internal flag to track initialization
        this._initialized = false;
    }
}

/**
 * ECS Component representing the Audio Listener (usually attached to a Camera or Player).
 */
export class AudioListenerComponent {
    constructor() {
        this.active = true;
    }
}

/**
 * ECS System to manage AudioComponents and synchronize 3D transforms.
 * Assumes the existence of a standard TransformComponent { position: {x,y,z}, rotation: {x,y,z,w} }
 */
export class AudioSystem {
    /**
     * @param {AudioEngine} audioEngine 
     */
    constructor(audioEngine) {
        this.engine = audioEngine;
    }

    /**
     * ECS Update loop.
     * @param {number} deltaTime 
     * @param {Array<Object>} entities - Array of ECS entities.
     */
    update(deltaTime, entities) {
        if (!this.engine.initialized) return;

        let listenerEntity = null;

        // 1. Find the active listener and update engine
        for (const entity of entities) {
            if (entity.hasComponent(AudioListenerComponent) && entity.hasComponent('TransformComponent')) {
                const listenerComp = entity.getComponent(AudioListenerComponent);
                if (listenerComp.active) {
                    listenerEntity = entity;
                    break;
                }
            }
        }

        if (listenerEntity) {
            const transform = listenerEntity.getComponent('TransformComponent');
            // Mocking forward/up vector extraction from transform rotation (quaternion or Euler)
            // In a real implementation, calculate these from the transform's world matrix.
            const forward = this._getForwardVector(transform.rotation);
            const up = this._getUpVector(transform.rotation);
            this.engine.setListenerTransform(transform.position, forward, up);
        }

        // 2. Update all AudioComponents
        for (const entity of entities) {
            if (!entity.hasComponent(AudioComponent)) continue;

            const audioComp = entity.getComponent(AudioComponent);

            // Initialize and Auto-play
            if (!audioComp._initialized) {
                if (audioComp.playOnStart) {
                    this._playEntityAudio(audioComp, entity);
                }
                audioComp._initialized = true;
            }

            // Sync Spatial Transform
            if (audioComp.spatial && audioComp.instance && audioComp.instance.isPlaying) {
                if (entity.hasComponent('TransformComponent')) {
                    const transform = entity.getComponent('TransformComponent');
                    const forward = this._getForwardVector(transform.rotation);
                    audioComp.instance.setPosition(
                        transform.position.x, 
                        transform.position.y, 
                        transform.position.z,
                        forward.x,
                        forward.y,
                        forward.z
                    );
                }
            }
        }
    }

    /**
     * Triggers playback for a specific component.
     * @param {AudioComponent} audioComp 
     * @param {Object} entity 
     */
    _playEntityAudio(audioComp, entity) {
        audioComp.instance = this.engine.play(audioComp.assetId, {
            loop: audioComp.loop,
            volume: audioComp.volume,
            bus: audioComp.bus,
            spatial: audioComp.spatial,
            spatialConfig: audioComp.spatialConfig,
            onEnded: () => { audioComp.isPlaying = false; }
        });

        if (audioComp.instance) {
            audioComp.isPlaying = true;
            
            // Set initial position immediately
            if (audioComp.spatial && entity.hasComponent('TransformComponent')) {
                const transform = entity.getComponent('TransformComponent');
                const forward = this._getForwardVector(transform.rotation);
                audioComp.instance.setPosition(
                    transform.position.x, 
                    transform.position.y, 
                    transform.position.z,
                    forward.x,
                    forward.y,
                    forward.z
                );
            }
        }
    }

    /**
     * Utility to extract forward vector from rotation.
     * Placeholder: implement based on engine's specific Math library.
     * @private
     */
    _getForwardVector(rotation) {
        // Fallback stub: assuming no rotation means facing -Z
        return { x: 0, y: 0, z: -1 }; 
    }

    /**
     * Utility to extract up vector from rotation.
     * Placeholder: implement based on engine's specific Math library.
     * @private
     */
    _getUpVector(rotation) {
        // Fallback stub: assuming no rotation means UP is +Y
        return { x: 0, y: 1, z: 0 };
    }
}

// Export singleton instance for global access if required by the architecture
export const GlobalAudioEngine = new AudioEngine();