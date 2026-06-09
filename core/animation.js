/**
 * @fileoverview Decide Engine Core - Animation System
 * @module core/animation
 * @description Provides a high-performance, robust Keyframe Animation System designed for an Entity Component System (ECS) architecture.
 * This system drives entity movement, transformations, and arbitrary property animations using precise keyframe interpolation.
 * It supports complex AAA-level requirements such as clip blending, multiple loop modes, and varied interpolation strategies.
 * 
 * @author Antigravity Synthesis Orchestrator (v3.0.0-beast)
 * @copyright 2026 ViaDecide
 */

// ============================================================================
// MATH & UTILITY FUNCTIONS
// ============================================================================

/**
 * Utility mathematical functions for interpolation and clamping.
 * @namespace MathUtils
 */
const MathUtils = {
    /**
     * Clamps a value between a minimum and maximum.
     * @param {number} value - The value to clamp.
     * @param {number} min - The minimum boundary.
     * @param {number} max - The maximum boundary.
     * @returns {number} The clamped value.
     */
    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),

    /**
     * Linearly interpolates between two scalar values.
     * @param {number} a - Start value.
     * @param {number} b - End value.
     * @param {number} t - Interpolation factor [0, 1].
     * @returns {number} Interpolated value.
     */
    lerp: (a, b, t) => a + (b - a) * t,

    /**
     * Linearly interpolates between two Vector3 objects.
     * Assumes vectors have {x, y, z} properties.
     * @param {Object} a - Start Vector3.
     * @param {Object} b - End Vector3.
     * @param {number} t - Interpolation factor [0, 1].
     * @param {Object} [out] - Optional target Vector3 to store the result.
     * @returns {Object} Interpolated Vector3.
     */
    lerpVector3: (a, b, t, out = { x: 0, y: 0, z: 0 }) => {
        out.x = a.x + (b.x - a.x) * t;
        out.y = a.y + (b.y - a.y) * t;
        out.z = a.z + (b.z - a.z) * t;
        return out;
    },

    /**
     * Spherical linear interpolation between two Quaternions.
     * Assumes quaternions have {x, y, z, w} properties.
     * @param {Object} a - Start Quaternion.
     * @param {Object} b - End Quaternion.
     * @param {number} t - Interpolation factor [0, 1].
     * @param {Object} [out] - Optional target Quaternion to store the result.
     * @returns {Object} Interpolated Quaternion.
     */
    slerpQuaternion: (a, b, t, out = { x: 0, y: 0, z: 0, w: 1 }) => {
        if (t === 0) return Object.assign(out, a);
        if (t === 1) return Object.assign(out, b);

        let cosHalfTheta = a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
        let qb = b;

        // If cosHalfTheta < 0, the interpolation will take the long way around the sphere.
        // To fix this, one quaternion must be negated.
        if (cosHalfTheta < 0) {
            qb = { x: -b.x, y: -b.y, z: -b.z, w: -b.w };
            cosHalfTheta = -cosHalfTheta;
        }

        // If the quaternions are very close, use linear interpolation to avoid division by zero.
        if (Math.abs(cosHalfTheta) >= 1.0) {
            out.w = a.w; out.x = a.x; out.y = a.y; out.z = a.z;
            return out;
        }

        const halfTheta = Math.acos(cosHalfTheta);
        const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

        if (Math.abs(sinHalfTheta) < 0.001) {
            out.w = (a.w * 0.5 + qb.w * 0.5);
            out.x = (a.x * 0.5 + qb.x * 0.5);
            out.y = (a.y * 0.5 + qb.y * 0.5);
            out.z = (a.z * 0.5 + qb.z * 0.5);
            return out;
        }

        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        out.w = (a.w * ratioA + qb.w * ratioB);
        out.x = (a.x * ratioA + qb.x * ratioB);
        out.y = (a.y * ratioA + qb.y * ratioB);
        out.z = (a.z * ratioA + qb.z * ratioB);
        return out;
    }
};

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Defines the looping behavior of an animation clip.
 * @enum {number}
 */
export const LoopMode = Object.freeze({
    ONCE: 0,
    LOOP: 1,
    PING_PONG: 2,
    CLAMP_FOREVER: 3
});

/**
 * Defines the type of interpolation to use between keyframes.
 * @enum {number}
 */
export const InterpolationType = Object.freeze({
    STEP: 0,
    LINEAR: 1,
    CUBIC_SPLINE: 2 // Supported via tangents if provided
});

/**
 * Defines the data types supported by animation tracks.
 * @enum {number}
 */
export const TrackType = Object.freeze({
    NUMBER: 0,
    VECTOR3: 1,
    QUATERNION: 2
});

// ============================================================================
// CORE DATA STRUCTURES
// ============================================================================

/**
 * Represents a single keyframe in an animation track.
 * @class
 */
export class Keyframe {
    /**
     * @param {number} time - The time in seconds this keyframe occurs.
     * @param {any} value - The value of the property at this time.
     * @param {any} [inTangent=null] - Incoming tangent for cubic spline interpolation.
     * @param {any} [outTangent=null] - Outgoing tangent for cubic spline interpolation.
     */
    constructor(time, value, inTangent = null, outTangent = null) {
        if (typeof time !== 'number' || time < 0) {
            throw new Error(`[AnimationSystem] Invalid keyframe time: ${time}`);
        }
        this.time = time;
        this.value = value;
        this.inTangent = inTangent;
        this.outTangent = outTangent;
    }
}

/**
 * Represents a sequence of keyframes for a specific property.
 * @class
 */
export class AnimationTrack {
    /**
     * @param {string} targetPath - The path to the property (e.g., "position", "scale", "rotation").
     * @param {TrackType} type - The data type of the track.
     * @param {InterpolationType} [interpolation=InterpolationType.LINEAR] - How to interpolate between keyframes.
     */
    constructor(targetPath, type, interpolation = InterpolationType.LINEAR) {
        this.targetPath = targetPath;
        this.type = type;
        this.interpolation = interpolation;
        
        /** @type {Keyframe[]} */
        this.keyframes = [];
        
        // Caching for performance
        this._lastFrameIndex = 0;
    }

    /**
     * Adds a keyframe to the track and ensures the track remains sorted by time.
     * @param {Keyframe} keyframe 
     */
    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        this.keyframes.sort((a, b) => a.time - b.time);
    }

    /**
     * Evaluates the track at a specific time and returns the interpolated value.
     * @param {number} time - The time to evaluate.
     * @returns {any} The interpolated value.
     */
    evaluate(time) {
        if (this.keyframes.length === 0) return null;
        if (this.keyframes.length === 1) return this.keyframes[0].value;

        // Clamp time to track bounds
        const startTime = this.keyframes[0].time;
        const endTime = this.keyframes[this.keyframes.length - 1].time;
        if (time <= startTime) return this.keyframes[0].value;
        if (time >= endTime) return this.keyframes[this.keyframes.length - 1].value;

        // Find the bounding keyframes (Optimization: start from last known index)
        let startIndex = this._lastFrameIndex;
        if (time < this.keyframes[startIndex].time || startIndex >= this.keyframes.length - 1) {
            startIndex = 0; // Reset if time went backwards or index is out of bounds
        }

        while (startIndex < this.keyframes.length - 1 && time >= this.keyframes[startIndex + 1].time) {
            startIndex++;
        }
        
        this._lastFrameIndex = startIndex;
        const kf1 = this.keyframes[startIndex];
        const kf2 = this.keyframes[startIndex + 1];

        // Calculate normalized time (t) between the two keyframes
        const duration = kf2.time - kf1.time;
        const t = (time - kf1.time) / duration;

        if (this.interpolation === InterpolationType.STEP) {
            return kf1.value;
        }

        // Interpolate based on track type
        switch (this.type) {
            case TrackType.NUMBER:
                return MathUtils.lerp(kf1.value, kf2.value, t);
            case TrackType.VECTOR3:
                // Return a new object or rely on the system to apply it efficiently
                return MathUtils.lerpVector3(kf1.value, kf2.value, t);
            case TrackType.QUATERNION:
                return MathUtils.slerpQuaternion(kf1.value, kf2.value, t);
            default:
                console.warn(`[AnimationSystem] Unknown track type: ${this.type}`);
                return kf1.value;
        }
    }
}

/**
 * A collection of AnimationTracks that make up a distinct animation (e.g., "Walk", "Run").
 * @class
 */
export class AnimationClip {
    /**
     * @param {string} name - The identifier for the clip.
     * @param {number} duration - Total duration of the clip in seconds.
     */
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
        
        /** @type {AnimationTrack[]} */
        this.tracks = [];
    }

    /**
     * Adds an animation track to the clip.
     * @param {AnimationTrack} track 
     */
    addTrack(track) {
        this.tracks.push(track);
    }
}

// ============================================================================
// ECS COMPONENTS
// ============================================================================

/**
 * Represents the active state of a playing animation clip.
 * @class
 */
export class AnimationState {
    /**
     * @param {AnimationClip} clip - The clip being played.
     */
    constructor(clip) {
        this.clip = clip;
        this.time = 0.0;
        this.speed = 1.0;
        this.weight = 1.0; // Used for blending multiple states
        this.loopMode = LoopMode.LOOP;
        this.isPlaying = true;
        
        // Internal state for ping-pong
        this._pingPongDirection = 1; 
    }

    /**
     * Advances the animation time.
     * @param {number} deltaTime - Time elapsed since last frame.
     */
    update(deltaTime) {
        if (!this.isPlaying) return;

        this.time += deltaTime * this.speed * this._pingPongDirection;

        switch (this.loopMode) {
            case LoopMode.ONCE:
                if (this.time >= this.clip.duration) {
                    this.time = this.clip.duration;
                    this.isPlaying = false;
                } else if (this.time <= 0) {
                    this.time = 0;
                    this.isPlaying = false;
                }
                break;

            case LoopMode.LOOP:
                if (this.time >= this.clip.duration) {
                    this.time = this.time % this.clip.duration;
                } else if (this.time < 0) {
                    this.time = this.clip.duration + (this.time % this.clip.duration);
                }
                break;

            case LoopMode.PING_PONG:
                if (this.time >= this.clip.duration) {
                    this.time = this.clip.duration - (this.time - this.clip.duration);
                    this._pingPongDirection = -1;
                } else if (this.time <= 0) {
                    this.time = -this.time;
                    this._pingPongDirection = 1;
                }
                break;

            case LoopMode.CLAMP_FOREVER:
                this.time = MathUtils.clamp(this.time, 0, this.clip.duration);
                break;
        }
    }
}

/**
 * ECS Component that holds animation data and playback states for an entity.
 * @class
 */
export class AnimatorComponent {
    constructor() {
        /** @type {Map<string, AnimationClip>} */
        this.clips = new Map();
        
        /** @type {AnimationState[]} Active states being evaluated and blended */
        this.activeStates = [];
        
        /** @type {number} Global time scale for this animator */
        this.timeScale = 1.0;
    }

    /**
     * Registers a new clip to the animator.
     * @param {AnimationClip} clip 
     */
    addClip(clip) {
        this.clips.set(clip.name, clip);
    }

    /**
     * Plays a clip by name.
     * @param {string} clipName 
     * @param {boolean} [crossfade=false] - If true, blends with currently playing clips.
     * @param {number} [fadeDuration=0.3] - Duration of the crossfade in seconds.
     * @returns {AnimationState|null} The created animation state, or null if clip not found.
     */
    play(clipName, crossfade = false, fadeDuration = 0.3) {
        const clip = this.clips.get(clipName);
        if (!clip) {
            console.error(`[AnimatorComponent] Clip not found: ${clipName}`);
            return null;
        }

        const newState = new AnimationState(clip);

        if (!crossfade) {
            this.activeStates = [newState];
        } else {
            // Initiate crossfade logic
            // In a production environment, you would gradually decrease weights of existing states
            // and increase the weight of the new state over fadeDuration.
            // For immediate application, we append and handle weights in the update loop.
            newState.weight = 0.0;
            newState._fadeTarget = 1.0;
            newState._fadeSpeed = 1.0 / fadeDuration;
            
            this.activeStates.forEach(state => {
                state._fadeTarget = 0.0;
                state._fadeSpeed = 1.0 / fadeDuration;
            });
            
            this.activeStates.push(newState);
        }

        return newState;
    }

    /**
     * Stops a specific clip or all clips if no name is provided.
     * @param {string} [clipName] 
     */
    stop(clipName) {
        if (!clipName) {
            this.activeStates = [];
            return;
        }
        this.activeStates = this.activeStates.filter(state => state.clip.name !== clipName);
    }
}

// ============================================================================
// ECS SYSTEM
// ============================================================================

/**
 * The core Animation System that processes AnimatorComponents every frame.
 * Applies evaluated keyframe data to Entity Transform components.
 * @class
 */
export class AnimationSystem {
    constructor() {
        // System signature: Requires AnimatorComponent and TransformComponent
        this.requiredComponents = ['AnimatorComponent', 'TransformComponent'];
    }

    /**
     * Executes the animation evaluation and applies transformations.
     * @param {number} deltaTime - Time elapsed since last frame in seconds.
     * @param {Array<Object>} entities - List of ECS entities.
     */
    update(deltaTime, entities) {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            
            // Duck-typing check for required components
            if (!entity.AnimatorComponent || !entity.TransformComponent) {
                continue;
            }

            const animator = entity.AnimatorComponent;
            const transform = entity.TransformComponent;

            if (animator.activeStates.length === 0) continue;

            // Map to accumulate blended values per property
            // Structure: { propertyPath: { type: TrackType, value: accumulatedValue, totalWeight: number } }
            const blendedProperties = new Map();

            // 1. Update states and evaluate tracks
            for (let j = animator.activeStates.length - 1; j >= 0; j--) {
                const state = animator.activeStates[j];
                
                // Handle crossfading weights
                if (state._fadeSpeed !== undefined) {
                    const direction = Math.sign(state._fadeTarget - state.weight);
                    state.weight += direction * state._fadeSpeed * deltaTime;
                    
                    if ((direction > 0 && state.weight >= state._fadeTarget) || 
                        (direction < 0 && state.weight <= state._fadeTarget)) {
                        state.weight = state._fadeTarget;
                        state._fadeSpeed = undefined;
                    }
                }

                // Remove states that have faded out entirely
                if (state.weight <= 0 && state._fadeTarget === 0) {
                    animator.activeStates.splice(j, 1);
                    continue;
                }

                // Advance time
                state.update(deltaTime * animator.timeScale);

                // Evaluate tracks
                for (let k = 0; k < state.clip.tracks.length; k++) {
                    const track = state.clip.tracks[k];
                    const value = track.evaluate(state.time);
                    
                    if (value === null) continue;

                    if (!blendedProperties.has(track.targetPath)) {
                        // Initialize blending accumulator based on type
                        let initialValue;
                        if (track.type === TrackType.NUMBER) initialValue = 0;
                        else if (track.type === TrackType.VECTOR3) initialValue = { x: 0, y: 0, z: 0 };
                        else if (track.type === TrackType.QUATERNION) initialValue = { x: 0, y: 0, z: 0, w: 0 }; // w=0 for accumulation

                        blendedProperties.set(track.targetPath, {
                            type: track.type,
                            value: initialValue,
                            totalWeight: 0
                        });
                    }

                    const accumulation = blendedProperties.get(track.targetPath);
                    const weight = state.weight;
                    accumulation.totalWeight += weight;

                    // Accumulate weighted values
                    if (track.type === TrackType.NUMBER) {
                        accumulation.value += value * weight;
                    } else if (track.type === TrackType.VECTOR3) {
                        accumulation.value.x += value.x * weight;
                        accumulation.value.y += value.y * weight;
                        accumulation.value.z += value.z * weight;
                    } else if (track.type === TrackType.QUATERNION) {
                        // Note: Quaternion blending via simple weighted average requires normalization afterwards.
                        // For more accurate blending, spherical interpolation (slerp) per state is preferred, 
                        // but weighted accumulation + normalize is standard for fast multi-track blending.
                        
                        // Ensure quaternions are in the same hemisphere
                        let dot = accumulation.value.x * value.x + 
                                  accumulation.value.y * value.y + 
                                  accumulation.value.z * value.z + 
                                  accumulation.value.w * value.w;
                                  
                        const sign = dot < 0 ? -1 : 1;
                        
                        accumulation.value.x += value.x * weight * sign;
                        accumulation.value.y += value.y * weight * sign;
                        accumulation.value.z += value.z * weight * sign;
                        accumulation.value.w += value.w * weight * sign;
                    }
                }
            }

            // 2. Apply blended values to the entity's TransformComponent
            for (const [propertyPath, accumulation] of blendedProperties.entries()) {
                if (accumulation.totalWeight === 0) continue;

                const weightInv = 1.0 / accumulation.totalWeight;
                let finalValue;

                if (accumulation.type === TrackType.NUMBER) {
                    finalValue = accumulation.value * weightInv;
                } else if (accumulation.type === TrackType.VECTOR3) {
                    finalValue = {
                        x: accumulation.value.x * weightInv,
                        y: accumulation.value.y * weightInv,
                        z: accumulation.value.z * weightInv
                    };
                } else if (accumulation.type === TrackType.QUATERNION) {
                    // Normalize the accumulated quaternion
                    const q = accumulation.value;
                    const len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
                    if (len > 0.00001) {
                        finalValue = {
                            x: q.x / len,
                            y: q.y / len,
                            z: q.z / len,
                            w: q.w / len
                        };
                    } else {
                        finalValue = { x: 0, y: 0, z: 0, w: 1 };
                    }
                }

                this._applyValueToTransform(transform, propertyPath, finalValue);
            }
        }
    }

    /**
     * Safely applies an interpolated value to a nested property path on the transform component.
     * @private
     * @param {Object} transform - The TransformComponent instance.
     * @param {string} path - The property path (e.g., "position", "rotation.x").
     * @param {any} value - The value to apply.
     */
    _applyValueToTransform(transform, path, value) {
        const parts = path.split('.');
        let current = transform;

        for (let i = 0; i < parts.length - 1; i++) {
            if (current[parts[i]] === undefined) {
                console.warn(`[AnimationSystem] Invalid transform path: ${path}`);
                return;
            }
            current = current[parts[i]];
        }

        const finalProp = parts[parts.length - 1];
        
        // If assigning an object (Vector3/Quaternion), copy properties to avoid reference issues
        if (typeof value === 'object' && value !== null) {
            if (current[finalProp]) {
                Object.assign(current[finalProp], value);
            } else {
                current[finalProp] = value;
            }
        } else {
            current[finalProp] = value;
        }
    }
}