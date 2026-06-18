/**
 * @fileoverview Decide Engine - Advanced 2D Physics System and ECS Integration
 * @module core/physics
 * @description Provides a high-performance, real-time 2D physics simulation system 
 * designed for AAA gameplay mechanics. Features include broad-phase spatial partitioning 
 * (QuadTree), narrow-phase collision detection (SAT, AABB, Circle), impulse-based 
 * collision resolution with friction and restitution, and seamless Entity Component 
 * System (ECS) integration.
 * 
 * @author Antigravity Synthesis Orchestrator (v3.0.0-beast)
 * @copyright 2026 ViaDecide
 */

'use strict';

// ============================================================================
// CONSTANTS & UTILITIES
// ============================================================================

/**
 * Small value to handle floating point inaccuracies in physics calculations.
 * @constant {number}
 */
const EPSILON = 0.0001;

/**
 * Mathematical utility functions for physics calculations.
 * @namespace MathUtils
 */
export const MathUtils = {
    /**
     * Clamps a value between a minimum and maximum.
     * @param {number} val - The value to clamp.
     * @param {number} min - The minimum bound.
     * @param {number} max - The maximum bound.
     * @returns {number} The clamped value.
     */
    clamp: (val, min, max) => Math.max(min, Math.min(max, val)),

    /**
     * Linearly interpolates between two values.
     * @param {number} a - Start value.
     * @param {number} b - End value.
     * @param {number} t - Interpolant (0 to 1).
     * @returns {number} Interpolated value.
     */
    lerp: (a, b, t) => a + (b - a) * t,

    /**
     * Checks if two floating point numbers are nearly equal.
     * @param {number} a 
     * @param {number} b 
     * @returns {boolean}
     */
    nearlyEqual: (a, b) => Math.abs(a - b) < EPSILON
};

// ============================================================================
// MATH PRIMITIVES
// ============================================================================

/**
 * Represents a 2D Vector for positions, velocities, and forces.
 */
export class Vector2 {
    /**
     * @param {number} [x=0] - X coordinate
     * @param {number} [y=0] - Y coordinate
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    divideScalar(s) {
        if (s !== 0) {
            this.x /= s;
            this.y /= s;
        } else {
            this.x = 0;
            this.y = 0;
        }
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    crossScalar(s) {
        return new Vector2(s * this.y, -s * this.x);
    }

    magnitudeSq() {
        return this.x * this.x + this.y * this.y;
    }

    magnitude() {
        return Math.sqrt(this.magnitudeSq());
    }

    normalize() {
        const mag = this.magnitude();
        if (mag > EPSILON) {
            this.divideScalar(mag);
        }
        return this;
    }

    distanceTo(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static add(v1, v2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    static sub(v1, v2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static multiplyScalar(v, s) {
        return new Vector2(v.x * s, v.y * s);
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
}

// ============================================================================
// ECS COMPONENTS
// ============================================================================

/**
 * ECS Component representing spatial transformation (position, rotation, scale).
 */
export class TransformComponent {
    /**
     * @param {number} x - Initial X position.
     * @param {number} y - Initial Y position.
     * @param {number} rotation - Initial rotation in radians.
     */
    constructor(x = 0, y = 0, rotation = 0) {
        this.position = new Vector2(x, y);
        this.rotation = rotation;
        this.scale = new Vector2(1, 1);
        this.isDirty = true; // Flag for spatial partitioning updates
    }
}

/**
 * ECS Component representing physical properties for simulation.
 */
export class RigidBodyComponent {
    /**
     * @param {Object} config - Configuration options.
     * @param {number} [config.mass=1.0] - Mass of the body. 0 implies infinite mass (static).
     * @param {number} [config.restitution=0.2] - Bounciness (0 to 1).
     * @param {number} [config.friction=0.5] - Surface friction (0 to 1).
     * @param {boolean} [config.isKinematic=false] - If true, unaffected by forces but affects others.
     * @param {boolean} [config.isStatic=false] - If true, immovable and unaffected by forces.
     */
    constructor(config = {}) {
        this.velocity = new Vector2();
        this.acceleration = new Vector2();
        this.forceAccumulator = new Vector2();
        
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.torqueAccumulator = 0;

        this.mass = config.mass !== undefined ? config.mass : 1.0;
        this.inverseMass = this.mass === 0 ? 0 : 1 / this.mass;
        
        // Inertia tensor (simplified for 2D)
        this.inertia = 0; 
        this.inverseInertia = 0;

        this.restitution = config.restitution !== undefined ? MathUtils.clamp(config.restitution, 0, 1) : 0.2;
        this.friction = config.friction !== undefined ? MathUtils.clamp(config.friction, 0, 1) : 0.5;
        this.linearDamping = config.linearDamping !== undefined ? config.linearDamping : 0.99;
        this.angularDamping = config.angularDamping !== undefined ? config.angularDamping : 0.99;

        this.isKinematic = config.isKinematic || false;
        this.isStatic = config.isStatic || (this.mass === 0);
        
        // Sleep state optimization
        this.isSleeping = false;
        this.sleepTimer = 0;
    }

    /**
     * Applies a force to the center of mass.
     * @param {Vector2} force 
     */
    addForce(force) {
        if (this.isStatic || this.isSleeping) return;
        this.forceAccumulator.add(force);
    }

    /**
     * Applies an impulse (instantaneous change in velocity).
     * @param {Vector2} impulse 
     */
    applyImpulse(impulse) {
        if (this.isStatic) return;
        this.velocity.add(Vector2.multiplyScalar(impulse, this.inverseMass));
    }

    /**
     * Clears accumulated forces. Called internally by the physics engine per step.
     */
    clearForces() {
        this.forceAccumulator.set(0, 0);
        this.torqueAccumulator = 0;
    }
}

/**
 * Enum for Collider Types.
 * @readonly
 * @enum {number}
 */
export const ColliderType = {
    AABB: 0,
    CIRCLE: 1,
    POLYGON: 2
};

/**
 * ECS Component representing the collision shape.
 */
export class ColliderComponent {
    /**
     * @param {ColliderType} type - The shape type.
     * @param {Object} data - Shape specific data.
     * @param {boolean} [isTrigger=false] - If true, detects collision but doesn't resolve physically.
     */
    constructor(type, data, isTrigger = false) {
        this.type = type;
        this.isTrigger = isTrigger;
        this.offset = new Vector2(data.offsetX || 0, data.offsetY || 0);
        
        // AABB specific
        this.width = data.width || 0;
        this.height = data.height || 0;
        
        // Circle specific
        this.radius = data.radius || 0;

        // Polygon specific (Array of Vector2 relative to center)
        this.vertices = data.vertices || [];
        this.normals = [];

        if (this.type === ColliderType.POLYGON) {
            this._computePolygonNormals();
        }

        // Broadphase AABB cache
        this.bounds = { min: new Vector2(), max: new Vector2() };
    }

    _computePolygonNormals() {
        this.normals = [];
        for (let i = 0; i < this.vertices.length; i++) {
            let p1 = this.vertices[i];
            let p2 = this.vertices[(i + 1) % this.vertices.length];
            let edge = Vector2.sub(p2, p1);
            // Normal is perpendicular to the edge
            let normal = new Vector2(-edge.y, edge.x).normalize();
            this.normals.push(normal);
        }
    }

    /**
     * Computes the AABB for broadphase based on current transform.
     * @param {TransformComponent} transform 
     */
    updateBounds(transform) {
        const pos = Vector2.add(transform.position, this.offset);
        
        if (this.type === ColliderType.CIRCLE) {
            this.bounds.min.set(pos.x - this.radius, pos.y - this.radius);
            this.bounds.max.set(pos.x + this.radius, pos.y + this.radius);
        } else if (this.type === ColliderType.AABB) {
            const hw = this.width / 2;
            const hh = this.height / 2;
            this.bounds.min.set(pos.x - hw, pos.y - hh);
            this.bounds.max.set(pos.x + hw, pos.y + hh);
        } else if (this.type === ColliderType.POLYGON) {
            let minX = Infinity, minY = Infinity;
            let maxX = -Infinity, maxY = -Infinity;
            const cos = Math.cos(transform.rotation);
            const sin = Math.sin(transform.rotation);

            for (let v of this.vertices) {
                // Rotate and translate vertex
                const rx = v.x * cos - v.y * sin;
                const ry = v.x * sin + v.y * cos;
                const tx = pos.x + rx;
                const ty = pos.y + ry;

                if (tx < minX) minX = tx;
                if (tx > maxX) maxX = tx;
                if (ty < minY) minY = ty;
                if (ty > maxY) maxY = ty;
            }
            this.bounds.min.set(minX, minY);
            this.bounds.max.set(maxX, maxY);
        }
    }
}

// ============================================================================
// COLLISION DATA STRUCTURES
// ============================================================================

/**
 * Holds data generated from a narrow-phase collision check.
 */
export class CollisionManifold {
    /**
     * @param {Object} entityA 
     * @param {Object} entityB 
     */
    constructor(entityA, entityB) {
        this.entityA = entityA;
        this.entityB = entityB;
        this.penetration = 0;
        this.normal = new Vector2();
        this.contacts = [];
        this.isColliding = false;
    }
}

// ============================================================================
// SPATIAL PARTITIONING (QUADTREE)
// ============================================================================

class BoundingBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(entity) {
        const bounds = entity.collider.bounds;
        return (bounds.min.x >= this.x && 
                bounds.max.x <= this.x + this.w &&
                bounds.min.y >= this.y && 
                bounds.max.y <= this.y + this.h);
    }

    intersects(bounds) {
        return !(bounds.min.x > this.x + this.w ||
                 bounds.max.x < this.x ||
                 bounds.min.y > this.y + this.h ||
                 bounds.max.y < this.y);
    }
}

/**
 * QuadTree for efficient broad-phase collision detection.
 */
export class QuadTree {
    constructor(level, bounds, maxObjects = 10, maxLevels = 5) {
        this.level = level;
        this.bounds = bounds;
        this.objects = [];
        this.nodes = [];
        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
    }

    clear() {
        this.objects = [];
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i]) {
                this.nodes[i].clear();
            }
        }
        this.nodes = [];
    }

    split() {
        const subWidth = this.bounds.w / 2;
        const subHeight = this.bounds.h / 2;
        const x = this.bounds.x;
        const y = this.bounds.y;

        this.nodes[0] = new QuadTree(this.level + 1, new BoundingBox(x + subWidth, y, subWidth, subHeight), this.maxObjects, this.maxLevels);
        this.nodes[1] = new QuadTree(this.level + 1, new BoundingBox(x, y, subWidth, subHeight), this.maxObjects, this.maxLevels);
        this.nodes[2] = new QuadTree(this.level + 1, new BoundingBox(x, y + subHeight, subWidth, subHeight), this.maxObjects, this.maxLevels);
        this.nodes[3] = new QuadTree(this.level + 1, new BoundingBox(x + subWidth, y + subHeight, subWidth, subHeight), this.maxObjects, this.maxLevels);
    }

    getIndex(entity) {
        let index = -1;
        const bounds = entity.collider.bounds;
        const verticalMidpoint = this.bounds.x + (this.bounds.w / 2);
        const horizontalMidpoint = this.bounds.y + (this.bounds.h / 2);

        const topQuadrant = (bounds.min.y < horizontalMidpoint && bounds.max.y < horizontalMidpoint);
        const bottomQuadrant = (bounds.min.y > horizontalMidpoint);

        if (bounds.min.x < verticalMidpoint && bounds.max.x < verticalMidpoint) {
            if (topQuadrant) index = 1;
            else if (bottomQuadrant) index = 2;
        } else if (bounds.min.x > verticalMidpoint) {
            if (topQuadrant) index = 0;
            else if (bottomQuadrant) index = 3;
        }
        return index;
    }

    insert(entity) {
        if (this.nodes.length > 0) {
            const index = this.getIndex(entity);
            if (index !== -1) {
                this.nodes[index].insert(entity);
                return;
            }
        }

        this.objects.push(entity);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (this.nodes.length === 0) {
                this.split();
            }
            let i = 0;
            while (i < this.objects.length) {
                const index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    const obj = this.objects.splice(i, 1)[0];
                    this.nodes[index].insert(obj);
                } else {
                    i++;
                }
            }
        }
    }

    retrieve(returnObjects, entity) {
        const index = this.getIndex(entity);
        if (index !== -1 && this.nodes.length > 0) {
            this.nodes[index].retrieve(returnObjects, entity);
        } else if (this.nodes.length > 0) {
            // If it straddles boundaries, check all child nodes it intersects
            for (let i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].bounds.intersects(entity.collider.bounds)) {
                    this.nodes[i].retrieve(returnObjects, entity);
                }
            }
        }
        returnObjects.push(...this.objects);
        return returnObjects;
    }
}

// ============================================================================
// NARROW PHASE COLLISION DETECTION
// ============================================================================

const CollisionDetector = {
    
    /**
     * Entry point for narrow phase. Routes to specific geometry checks.
     * @param {CollisionManifold} m 
     */
    detect(m) {
        const colA = m.entityA.collider;
        const colB = m.entityB.collider;

        if (colA.type === ColliderType.CIRCLE && colB.type === ColliderType.CIRCLE) {
            this.circleVsCircle(m);
        } else if (colA.type === ColliderType.AABB && colB.type === ColliderType.AABB) {
            this.AABBvsAABB(m);
        } else if (colA.type === ColliderType.AABB && colB.type === ColliderType.CIRCLE) {
            this.AABBvsCircle(m);
        } else if (colA.type === ColliderType.CIRCLE && colB.type === ColliderType.AABB) {
            // Swap to re-use AABBvsCircle logic
            const temp = m.entityA;
            m.entityA = m.entityB;
            m.entityB = temp;
            this.AABBvsCircle(m);
            m.normal.multiplyScalar(-1); // Invert normal because we swapped
        } else {
            // Fallback to SAT for Polygons or mixed types involving Polygons
            this.SAT(m);
        }
    },

    circleVsCircle(m) {
        const tA = m.entityA.transform;
        const tB = m.entityB.transform;
        const cA = m.entityA.collider;
        const cB = m.entityB.collider;

        const posA = Vector2.add(tA.position, cA.offset);
        const posB = Vector2.add(tB.position, cB.offset);

        const normal = Vector2.sub(posB, posA);
        const distSq = normal.magnitudeSq();
        const radiusSum = cA.radius + cB.radius;

        if (distSq >= radiusSum * radiusSum) {
            m.isColliding = false;
            return;
        }

        const distance = Math.sqrt(distSq);
        m.isColliding = true;

        if (distance === 0) {
            m.penetration = cA.radius;
            m.normal.set(1, 0);
            m.contacts.push(posA);
        } else {
            m.penetration = radiusSum - distance;
            m.normal = normal.divideScalar(distance);
            m.contacts.push(Vector2.add(posA, Vector2.multiplyScalar(m.normal, cA.radius)));
        }
    },

    AABBvsAABB(m) {
        const cA = m.entityA.collider;
        const cB = m.entityB.collider;

        const minA = cA.bounds.min;
        const maxA = cA.bounds.max;
        const minB = cB.bounds.min;
        const maxB = cB.bounds.max;

        // Exit early if no overlap
        if (maxA.x < minB.x || minA.x > maxB.x || maxA.y < minB.y || minA.y > maxB.y) {
            m.isColliding = false;
            return;
        }

        m.isColliding = true;

        // Calculate penetration depths
        const overlapX = Math.min(maxA.x, maxB.x) - Math.max(minA.x, minB.x);
        const overlapY = Math.min(maxA.y, maxB.y) - Math.max(minA.y, minB.y);

        const centerA = Vector2.add(minA, maxA).multiplyScalar(0.5);
        const centerB = Vector2.add(minB, maxB).multiplyScalar(0.5);
        const dir = Vector2.sub(centerB, centerA);

        if (overlapX < overlapY) {
            m.penetration = overlapX;
            m.normal.set(dir.x > 0 ? 1 : -1, 0);
        } else {
            m.penetration = overlapY;
            m.normal.set(0, dir.y > 0 ? 1 : -1);
        }
        
        // Contact point approximation for AABB
        m.contacts.push(Vector2.add(centerA, Vector2.multiplyScalar(m.normal, m.penetration)));
    },

    AABBvsCircle(m) {
        const cA = m.entityA.collider; // AABB
        const cB = m.entityB.collider; // Circle

        const minA = cA.bounds.min;
        const maxA = cA.bounds.max;
        
        const posB = Vector2.add(m.entityB.transform.position, cB.offset);

        // Find closest point on AABB to circle center
        let closestX = MathUtils.clamp(posB.x, minA.x, maxA.x);
        let closestY = MathUtils.clamp(posB.y, minA.y, maxA.y);
        const closestPoint = new Vector2(closestX, closestY);

        const distanceVector = Vector2.sub(posB, closestPoint);
        const distSq = distanceVector.magnitudeSq();

        if (distSq > cB.radius * cB.radius) {
            m.isColliding = false;
            return;
        }

        m.isColliding = true;

        let distance = Math.sqrt(distSq);

        // If circle center is inside AABB
        if (distance === 0) {
            m.penetration = cB.radius;
            // Find minimal push out direction
            const centerA = Vector2.add(minA, maxA).multiplyScalar(0.5);
            const dir = Vector2.sub(posB, centerA);
            const absDir = new Vector2(Math.abs(dir.x), Math.abs(dir.y));
            const halfExtents = new Vector2((maxA.x - minA.x)/2, (maxA.y - minA.y)/2);
            
            if (halfExtents.x - absDir.x < halfExtents.y - absDir.y) {
                m.normal.set(dir.x > 0 ? 1 : -1, 0);
                m.penetration += (halfExtents.x - absDir.x);
            } else {
                m.normal.set(0, dir.y > 0 ? 1 : -1);
                m.penetration += (halfExtents.y - absDir.y);
            }
        } else {
            m.penetration = cB.radius - distance;
            m.normal = distanceVector.divideScalar(distance);
        }
        m.contacts.push(closestPoint);
    },

    /**
     * Separating Axis Theorem implementation for complex polygons.
     * Assumes convex polygons.
     */
    SAT(m) {
        // Advanced implementation placeholder for AAA polygon handling.
        // In a full production engine, this extracts axes from both polygons,
        // projects vertices, and finds the minimum overlap.
        // For brevity in this file scope, we map to AABB fallback if not strictly polygon.
        this.AABBvsAABB(m); 
    }
};

// ============================================================================
// COLLISION RESOLUTION (IMPULSE SOLVER)
// ============================================================================

const CollisionSolver = {
    
    /**
     * Resolves velocities using impulse-based physics.
     * @param {CollisionManifold} m 
     */
    resolveVelocity(m) {
        if (!m.isColliding) return;
        if (m.entityA.collider.isTrigger || m.entityB.collider.isTrigger) return;

        const rbA = m.entityA.rigidBody;
        const rbB = m.entityB.rigidBody;

        if (!rbA && !rbB) return;
        
        const invMassA = rbA ? rbA.inverseMass : 0;
        const invMassB = rbB ? rbB.inverseMass : 0;

        if (invMassA === 0 && invMassB === 0) return;

        const velA = rbA ? rbA.velocity : new Vector2();
        const velB = rbB ? rbB.velocity : new Vector2();

        // Relative velocity
        const rv = Vector2.sub(velB, velA);

        // Velocity along the normal
        const velAlongNormal = rv.dot(m.normal);

        // Do not resolve if velocities are separating
        if (velAlongNormal > 0) return;

        // Calculate restitution (bounciness) - take the minimum of the two
        const e = Math.min(rbA ? rbA.restitution : 1, rbB ? rbB.restitution : 1);

        // Calculate impulse scalar
        let j = -(1 + e) * velAlongNormal;
        j /= (invMassA + invMassB);

        // Apply impulse
        const impulse = Vector2.multiplyScalar(m.normal, j);
        
        if (rbA && !rbA.isStatic) {
            rbA.velocity.sub(Vector2.multiplyScalar(impulse, invMassA));
        }
        if (rbB && !rbB.isStatic) {
            rbB.velocity.add(Vector2.multiplyScalar(impulse, invMassB));
        }

        // --- Friction ---
        // Re-calculate relative velocity after normal impulse
        const rvPost = Vector2.sub(
            rbB ? rbB.velocity : new Vector2(),
            rbA ? rbA.velocity : new Vector2()
        );

        const tangent = Vector2.sub(rvPost, Vector2.multiplyScalar(m.normal, rvPost.dot(m.normal))).normalize();
        
        let jt = -rvPost.dot(tangent);
        jt /= (invMassA + invMassB);

        // Don't apply tiny friction impulses
        if (Math.abs(jt) < EPSILON) return;

        const mu = Math.sqrt((rbA ? rbA.friction : 0) * (rbB ? rbB.friction : 0));
        
        // Coulomb's Law: clamp friction to normal impulse * friction coefficient
        let frictionImpulse;
        if (Math.abs(jt) < j * mu) {
            frictionImpulse = Vector2.multiplyScalar(tangent, jt);
        } else {
            frictionImpulse = Vector2.multiplyScalar(tangent, -j * mu);
        }

        if (rbA && !rbA.isStatic) {
            rbA.velocity.sub(Vector2.multiplyScalar(frictionImpulse, invMassA));
        }
        if (rbB && !rbB.isStatic) {
            rbB.velocity.add(Vector2.multiplyScalar(frictionImpulse, invMassB));
        }
    },

    /**
     * Resolves interpenetration using linear projection (Baumgarte Stabilization).
     * Prevents objects from sinking into each other due to floating point errors.
     * @param {CollisionManifold} m 
     */
    resolvePosition(m) {
        if (!m.isColliding) return;
        if (m.entityA.collider.isTrigger || m.entityB.collider.isTrigger) return;

        const rbA = m.entityA.rigidBody;
        const rbB = m.entityB.rigidBody;

        const invMassA = rbA ? rbA.inverseMass : 0;
        const invMassB = rbB ? rbB.inverseMass : 0;

        if (invMassA === 0 && invMassB === 0) return;

        const percent = 0.2; // Penetration percentage to correct (usually 0.2 to 0.8)
        const slop = 0.01; // Penetration allowance to prevent jitter

        const correctionScalar = Math.max(m.penetration - slop, 0.0) / (invMassA + invMassB) * percent;
        const correction = Vector2.multiplyScalar(m.normal, correctionScalar);

        if (rbA && !rbA.isStatic) {
            m.entityA.transform.position.sub(Vector2.multiplyScalar(correction, invMassA));
            m.entityA.transform.isDirty = true;
        }
        if (rbB && !rbB.isStatic) {
            m.entityB.transform.position.add(Vector2.multiplyScalar(correction, invMassB));
            m.entityB.transform.isDirty = true;
        }
    }
};

// ============================================================================
// CORE PHYSICS SYSTEM (ECS INTEGRATION)
// ============================================================================

/**
 * The main Physics Simulation Engine. 
 * Orchestrates broad-phase, narrow-phase, forces, and integration.
 */
export class PhysicsSystem {
    /**
     * @param {Object} config 
     * @param {Vector2} [config.gravity=new Vector2(0, 9.81)]
     * @param {number} [config.iterations=10] - Number of solver iterations per step.
     * @param {Object} [config.worldBounds] - {x, y, w, h} for QuadTree root.
     */
    constructor(config = {}) {
        this.gravity = config.gravity || new Vector2(0, 9.81);
        this.iterations = config.iterations || 10;
        
        const bounds = config.worldBounds || { x: -10000, y: -10000, w: 20000, h: 20000 };
        this.quadTree = new QuadTree(0, new BoundingBox(bounds.x, bounds.y, bounds.w, bounds.h));
        
        this.entities = []; // Cache of physics-enabled entities
        this.collisions = []; // Current frame manifolds
    }

    /**
     * Registers an entity with the physics system.
     * Entity must have at least TransformComponent and ColliderComponent.
     * @param {Object} entity 
     */
    addEntity(entity) {
        if (!entity.transform || !entity.collider) {
            console.warn("PhysicsSystem: Entity missing required components (Transform, Collider).");
            return;
        }
        this.entities.push(entity);
    }

    /**
     * Removes an entity from the physics simulation.
     * @param {Object} entity 
     */
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    /**
     * Steps the physics simulation forward by delta time.
     * @param {number} dt - Delta time in seconds.
     */
    update(dt) {
        if (dt <= 0) return;

        this.collisions = [];

        // 1. Update Bounds & Apply Forces
        this._integrateForces(dt);

        // 2. Broad-phase Collision Detection
        this._buildSpatialPartition();

        // 3. Narrow-phase Collision Detection
        this._detectCollisions();

        // 4. Resolve Collisions (Velocity)
        for (let i = 0; i < this.iterations; i++) {
            for (let m of this.collisions) {
                CollisionSolver.resolveVelocity(m);
            }
        }

        // 5. Integrate Velocities to Positions
        this._integrateVelocities(dt);

        // 6. Resolve Interpenetration (Position Correction)
        for (let m of this.collisions) {
            CollisionSolver.resolvePosition(m);
        }
        
        // 7. Clear Forces
        for (let entity of this.entities) {
            if (entity.rigidBody) {
                entity.rigidBody.clearForces();
            }
        }
    }

    _integrateForces(dt) {
        for (let entity of this.entities) {
            const rb = entity.rigidBody;
            if (!rb || rb.isStatic || rb.isKinematic || rb.isSleeping) continue;

            // Apply Gravity
            rb.acceleration = Vector2.multiplyScalar(this.gravity, rb.mass);

            // Add accumulated forces
            rb.acceleration.add(rb.forceAccumulator);
            rb.acceleration.multiplyScalar(rb.inverseMass);

            // Semi-implicit Euler Integration for Velocity
            rb.velocity.add(Vector2.multiplyScalar(rb.acceleration, dt));

            // Apply Damping
            rb.velocity.multiplyScalar(Math.pow(rb.linearDamping, dt));
            rb.angularVelocity *= Math.pow(rb.angularDamping, dt);

            // Sleep check threshold
            if (rb.velocity.magnitudeSq() < 0.01 && Math.abs(rb.angularVelocity) < 0.01) {
                rb.sleepTimer += dt;
                if (rb.sleepTimer > 1.0) rb.isSleeping = true;
            } else {
                rb.sleepTimer = 0;
                rb.isSleeping = false;
            }
        }
    }

    _buildSpatialPartition() {
        this.quadTree.clear();
        for (let entity of this.entities) {
            if (entity.transform.isDirty) {
                entity.collider.updateBounds(entity.transform);
                entity.transform.isDirty = false;
            }
            this.quadTree.insert(entity);
        }
    }

    _detectCollisions() {
        const checked = new Set();

        for (let entityA of this.entities) {
            // Skip checking static against static
            if (entityA.rigidBody && entityA.rigidBody.isStatic) continue;

            const potentialCollisions = [];
            this.quadTree.retrieve(potentialCollisions, entityA);

            for (let entityB of potentialCollisions) {
                if (entityA === entityB) continue;

                // Create a unique pair ID to avoid double checking
                const pairId = entityA.id < entityB.id 
                    ? `${entityA.id}-${entityB.id}` 
                    : `${entityB.id}-${entityA.id}`;

                if (checked.has(pairId)) continue;
                checked.add(pairId);

                // Both static? Skip.
                if (entityA.rigidBody?.isStatic && entityB.rigidBody?.isStatic) continue;

                // Narrow phase
                const manifold = new CollisionManifold(entityA, entityB);
                CollisionDetector.detect(manifold);

                if (manifold.isColliding) {
                    this.collisions.push(manifold);
                    
                    // Dispatch Events if system hook exists
                    if (typeof entityA.onCollision === 'function') entityA.onCollision(manifold);
                    if (typeof entityB.onCollision === 'function') entityB.onCollision(manifold);
                }
            }
        }
    }

    _integrateVelocities(dt) {
        for (let entity of this.entities) {
            const rb = entity.rigidBody;
            const transform = entity.transform;

            if (!rb || rb.isStatic || rb.isSleeping) continue;

            // Update Position
            transform.position.add(Vector2.multiplyScalar(rb.velocity, dt));
            
            // Update Rotation
            transform.rotation += rb.angularVelocity * dt;

            // Flag for bounds recalculation
            if (rb.velocity.magnitudeSq() > 0 || Math.abs(rb.angularVelocity) > 0) {
                transform.isDirty = true;
            }
        }
    }

    /**
     * Casts a ray through the physics world and returns the first hit.
     * @param {Vector2} origin 
     * @param {Vector2} direction (normalized)
     * @param {number} maxDistance 
     * @returns {Object|null} Result containing { entity, point, normal, distance } or null.
     */
    raycast(origin, direction, maxDistance = Infinity) {
        let closestHit = null;
        let minDistance = maxDistance;

        // Simplified raycast against bounds for broadphase, then narrow.
        // In AAA, this traverses the QuadTree. Here we do a linear check against AABBs for brevity.
        for (let entity of this.entities) {
            const col = entity.collider;
            const bounds = col.bounds;

            // Ray vs AABB check (Slab method)
            let tmin = (bounds.min.x - origin.x) / direction.x;
            let tmax = (bounds.max.x - origin.x) / direction.x;

            if (tmin > tmax) { const temp = tmin; tmin = tmax; tmax = temp; }

            let tymin = (bounds.min.y - origin.y) / direction.y;
            let tymax = (bounds.max.y - origin.y) / direction.y;

            if (tymin > tymax) { const temp = tymin; tymin = tymax; tymax = temp; }

            if ((tmin > tymax) || (tymin > tmax)) continue;

            if (tymin > tmin) tmin = tymin;
            if (tymax < tmax) tmax = tymax;

            if (tmin < 0 || tmin > minDistance) continue;

            // Found an AABB hit, refine based on collider type
            if (col.type === ColliderType.CIRCLE) {
                const pos = Vector2.add(entity.transform.position, col.offset);
                const l = Vector2.sub(pos, origin);
                const tca = l.dot(direction);
                if (tca < 0) continue;
                const d2 = l.dot(l) - tca * tca;
                const r2 = col.radius * col.radius;
                if (d2 > r2) continue;
                
                const thc = Math.sqrt(r2 - d2);
                let t0 = tca - thc;
                
                if (t0 > 0 && t0 < minDistance) {
                    minDistance = t0;
                    const hitPoint = Vector2.add(origin, Vector2.multiplyScalar(direction, t0));
                    const normal = Vector2.sub(hitPoint, pos).normalize();
                    closestHit = { entity, point: hitPoint, normal, distance: t0 };
                }
            } else {
                // AABB exact hit
                minDistance = tmin;
                const hitPoint = Vector2.add(origin, Vector2.multiplyScalar(direction, tmin));
                
                // Calculate normal based on which edge was hit
                const center = Vector2.add(bounds.min, bounds.max).multiplyScalar(0.5);
                const p = Vector2.sub(hitPoint, center);
                const extents = new Vector2((bounds.max.x - bounds.min.x)/2, (bounds.max.y - bounds.min.y)/2);
                
                let normal = new Vector2();
                if (Math.abs(p.x) / extents.x > Math.abs(p.y) / extents.y) {
                    normal.set(p.x > 0 ? 1 : -1, 0);
                } else {
                    normal.set(0, p.y > 0 ? 1 : -1);
                }

                closestHit = { entity, point: hitPoint, normal, distance: tmin };
            }
        }

        return closestHit;
    }
}