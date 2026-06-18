/**
 * @fileoverview Decide Engine - Core Entity-Component-System (ECS) Architecture
 * @module core/ecs
 * @description
 * High-performance, memory-contiguous (where possible in V8), and highly modular ECS 
 * framework designed for AAA-scale environments within the browser.
 * 
 * Features:
 * - Sparse Set component storage for O(1) lookups and cache-friendly iterations.
 * - Generational Entity IDs to safely handle entity destruction and recycling.
 * - Dynamic BitSets for O(1) component signature matching.
 * - Cached Queries with `All`, `Any`, and `None` filters.
 * - Command Buffers for deferred structural changes (safe iteration).
 * - Event-driven system hooks (onAdd, onRemove, onUpdate).
 */

const MAX_COMPONENTS_DEFAULT = 256;
const ENTITY_INDEX_BITS = 22;
const ENTITY_INDEX_MASK = (1 << ENTITY_INDEX_BITS) - 1;
const ENTITY_GENERATION_BITS = 10;
const ENTITY_GENERATION_MASK = (1 << ENTITY_GENERATION_BITS) - 1;

/**
 * Extracts the index portion of an Entity ID.
 * @param {number} entityId 
 * @returns {number}
 */
const getEntityIndex = (entityId) => entityId & ENTITY_INDEX_MASK;

/**
 * Extracts the generation portion of an Entity ID.
 * @param {number} entityId 
 * @returns {number}
 */
const getEntityGeneration = (entityId) => (entityId >> ENTITY_INDEX_BITS) & ENTITY_GENERATION_MASK;

/**
 * Constructs a full Entity ID from index and generation.
 * @param {number} index 
 * @param {number} generation 
 * @returns {number}
 */
const createEntityId = (index, generation) => (generation << ENTITY_INDEX_BITS) | index;

/**
 * Dynamic BitSet for fast entity signature matching.
 * Scales automatically to accommodate any number of components.
 */
export class BitSet {
    /**
     * @param {number} [initialCapacity=1] Initial number of 32-bit words
     */
    constructor(initialCapacity = 1) {
        this.words = new Uint32Array(initialCapacity);
    }

    /**
     * Sets a bit at the specified index.
     * @param {number} index 
     */
    set(index) {
        const wordIndex = index >> 5;
        this._ensureCapacity(wordIndex);
        this.words[wordIndex] |= (1 << (index & 31));
    }

    /**
     * Clears a bit at the specified index.
     * @param {number} index 
     */
    clear(index) {
        const wordIndex = index >> 5;
        if (wordIndex < this.words.length) {
            this.words[wordIndex] &= ~(1 << (index & 31));
        }
    }

    /**
     * Checks if a bit is set.
     * @param {number} index 
     * @returns {boolean}
     */
    has(index) {
        const wordIndex = index >> 5;
        if (wordIndex >= this.words.length) return false;
        return (this.words[wordIndex] & (1 << (index & 31))) !== 0;
    }

    /**
     * Checks if this BitSet contains all bits of another BitSet.
     * @param {BitSet} other 
     * @returns {boolean}
     */
    containsAll(other) {
        for (let i = 0; i < other.words.length; i++) {
            const thisWord = i < this.words.length ? this.words[i] : 0;
            if ((thisWord & other.words[i]) !== other.words[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if this BitSet contains any bit of another BitSet.
     * @param {BitSet} other 
     * @returns {boolean}
     */
    containsAny(other) {
        const len = Math.min(this.words.length, other.words.length);
        for (let i = 0; i < len; i++) {
            if ((this.words[i] & other.words[i]) !== 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if this BitSet shares no bits with another BitSet.
     * @param {BitSet} other 
     * @returns {boolean}
     */
    containsNone(other) {
        return !this.containsAny(other);
    }

    /**
     * Resets all bits to 0.
     */
    reset() {
        for (let i = 0; i < this.words.length; i++) {
            this.words[i] = 0;
        }
    }

    /**
     * Clones the BitSet.
     * @returns {BitSet}
     */
    clone() {
        const clone = new BitSet(this.words.length);
        clone.words.set(this.words);
        return clone;
    }

    /**
     * @private
     * @param {number} requiredWordIndex 
     */
    _ensureCapacity(requiredWordIndex) {
        if (requiredWordIndex >= this.words.length) {
            const newCapacity = Math.max(this.words.length * 2, requiredWordIndex + 1);
            const newWords = new Uint32Array(newCapacity);
            newWords.set(this.words);
            this.words = newWords;
        }
    }
}

/**
 * A Sparse Set implementation for high-performance component storage.
 * Provides O(1) insertion, deletion, and lookup, while keeping component data tightly packed.
 */
export class SparseSet {
    constructor() {
        /** @type {number[]} Maps Entity Index to Dense Array Index */
        this.sparse = [];
        /** @type {number[]} Tightly packed Entity IDs */
        this.dense = [];
        /** @type {any[]} Tightly packed component data corresponding to dense entity array */
        this.data = [];
        /** @type {number} Current number of elements */
        this.size = 0;
    }

    /**
     * Checks if an entity has a component in this set.
     * @param {number} entityIndex 
     * @returns {boolean}
     */
    has(entityIndex) {
        const denseIndex = this.sparse[entityIndex];
        return denseIndex !== undefined && denseIndex < this.size && this.dense[denseIndex] === entityIndex;
    }

    /**
     * Retrieves component data for an entity.
     * @param {number} entityIndex 
     * @returns {any|undefined}
     */
    get(entityIndex) {
        if (!this.has(entityIndex)) return undefined;
        return this.data[this.sparse[entityIndex]];
    }

    /**
     * Inserts or updates component data for an entity.
     * @param {number} entityIndex 
     * @param {any} componentData 
     */
    insert(entityIndex, componentData) {
        if (this.has(entityIndex)) {
            this.data[this.sparse[entityIndex]] = componentData;
        } else {
            const denseIndex = this.size;
            this.sparse[entityIndex] = denseIndex;
            this.dense[denseIndex] = entityIndex;
            this.data[denseIndex] = componentData;
            this.size++;
        }
    }

    /**
     * Removes component data for an entity.
     * Maintains dense array continuousness by swapping with the last element.
     * @param {number} entityIndex 
     * @returns {boolean} True if removed, false if not found.
     */
    remove(entityIndex) {
        if (!this.has(entityIndex)) return false;

        const denseIndex = this.sparse[entityIndex];
        const lastDenseIndex = this.size - 1;

        if (denseIndex !== lastDenseIndex) {
            // Swap with the last element to keep dense array packed
            const lastEntityIndex = this.dense[lastDenseIndex];
            const lastData = this.data[lastDenseIndex];

            this.dense[denseIndex] = lastEntityIndex;
            this.data[denseIndex] = lastData;
            this.sparse[lastEntityIndex] = denseIndex;
        }

        this.size--;
        
        // Nullify references to help Garbage Collection
        this.dense[lastDenseIndex] = undefined;
        this.data[lastDenseIndex] = undefined;
        this.sparse[entityIndex] = undefined;

        return true;
    }

    /**
     * Clears all data from the set.
     */
    clear() {
        this.sparse.length = 0;
        this.dense.length = 0;
        this.data.length = 0;
        this.size = 0;
    }
}

/**
 * Event Dispatcher for internal ECS signaling.
 */
export class Signal {
    constructor() {
        this.listeners = [];
    }

    /**
     * Subscribes to the signal.
     * @param {Function} callback 
     * @param {any} [context]
     */
    add(callback, context = null) {
        this.listeners.push({ callback, context });
    }

    /**
     * Unsubscribes from the signal.
     * @param {Function} callback 
     */
    remove(callback) {
        this.listeners = this.listeners.filter(l => l.callback !== callback);
    }

    /**
     * Emits the signal to all listeners.
     * @param  {...any} args 
     */
    emit(...args) {
        for (let i = 0; i < this.listeners.length; i++) {
            const listener = this.listeners[i];
            listener.callback.apply(listener.context, args);
        }
    }
}

/**
 * Represents a Query to filter entities based on their component signatures.
 */
export class Query {
    /**
     * @param {World} world 
     * @param {BitSet} all Mask of components the entity MUST have
     * @param {BitSet} any Mask of components the entity MUST have AT LEAST ONE of
     * @param {BitSet} none Mask of components the entity MUST NOT have
     */
    constructor(world, all, any, none) {
        this.world = world;
        this.all = all;
        this.any = any;
        this.none = none;

        /** @type {Set<number>} Set of active Entity IDs that match this query */
        this.entities = new Set();

        // Listeners for structural changes
        this.world.onEntityDestroyed.add(this._onEntityDestroyed, this);
        this.world.onComponentAdded.add(this._onComponentChanged, this);
        this.world.onComponentRemoved.add(this._onComponentChanged, this);
    }

    /**
     * Checks if an entity matches the query's criteria.
     * @param {number} entityId 
     * @returns {boolean}
     */
    matches(entityId) {
        const signature = this.world.getEntitySignature(entityId);
        if (!signature) return false;

        if (this.all.words.length > 0 && !signature.containsAll(this.all)) return false;
        if (this.any.words.length > 0 && !signature.containsAny(this.any)) return false;
        if (this.none.words.length > 0 && !signature.containsNone(this.none)) return false;

        return true;
    }

    /**
     * Evaluates an entity and updates the internal cache.
     * @private
     * @param {number} entityId 
     */
    _evaluate(entityId) {
        const isMatch = this.matches(entityId);
        const hasEntity = this.entities.has(entityId);

        if (isMatch && !hasEntity) {
            this.entities.add(entityId);
        } else if (!isMatch && hasEntity) {
            this.entities.delete(entityId);
        }
    }

    /** @private */
    _onEntityDestroyed(entityId) {
        this.entities.delete(entityId);
    }

    /** @private */
    _onComponentChanged(entityId, componentId) {
        // Quick check: does this component even affect this query?
        if (this.all.has(componentId) || this.any.has(componentId) || this.none.has(componentId)) {
            this._evaluate(entityId);
        }
    }

    /**
     * Returns an array of matching entities.
     * @returns {number[]}
     */
    getResults() {
        return Array.from(this.entities);
    }

    /**
     * Iterates over all matching entities.
     * @param {Function} callback (entityId) => void
     */
    forEach(callback) {
        for (const entityId of this.entities) {
            callback(entityId);
        }
    }

    /**
     * Cleans up listeners.
     */
    destroy() {
        this.world.onEntityDestroyed.remove(this._onEntityDestroyed);
        this.world.onComponentAdded.remove(this._onComponentChanged);
        this.world.onComponentRemoved.remove(this._onComponentChanged);
        this.entities.clear();
    }
}

/**
 * Builder class for creating Queries fluently.
 */
export class QueryBuilder {
    /**
     * @param {World} world 
     */
    constructor(world) {
        this.world = world;
        this._all = new BitSet();
        this._any = new BitSet();
        this._none = new BitSet();
    }

    /**
     * @param {...(Function|string)} componentTypes 
     * @returns {QueryBuilder}
     */
    all(...componentTypes) {
        for (const type of componentTypes) {
            this._all.set(this.world.getComponentId(type));
        }
        return this;
    }

    /**
     * @param {...(Function|string)} componentTypes 
     * @returns {QueryBuilder}
     */
    any(...componentTypes) {
        for (const type of componentTypes) {
            this._any.set(this.world.getComponentId(type));
        }
        return this;
    }

    /**
     * @param {...(Function|string)} componentTypes 
     * @returns {QueryBuilder}
     */
    none(...componentTypes) {
        for (const type of componentTypes) {
            this._none.set(this.world.getComponentId(type));
        }
        return this;
    }

    /**
     * Builds and registers the query with the World.
     * @returns {Query}
     */
    build() {
        return this.world.registerQuery(this._all, this._any, this._none);
    }
}

/**
 * Base class for all ECS Systems.
 */
export class System {
    /**
     * @param {World} world 
     */
    constructor(world) {
        /** @type {World} */
        this.world = world;
        /** @type {boolean} */
        this.enabled = true;
        /** @type {Query|null} */
        this.query = null;
    }

    /**
     * Called once when the system is added to the world.
     * Setup your queries here.
     */
    init() {}

    /**
     * Called every frame.
     * @param {number} dt Delta time in seconds.
     */
    update(dt) {
        throw new Error("System.update() must be implemented by subclasses.");
    }

    /**
     * Called when the system is removed from the world.
     */
    destroy() {}
}

/**
 * Command Buffer for deferring ECS structural changes.
 * Ensures safe iteration over entities during System updates without mutating state mid-loop.
 */
export class CommandBuffer {
    /**
     * @param {World} world 
     */
    constructor(world) {
        this.world = world;
        this._commands = [];
    }

    /**
     * Defers creation of an entity.
     * @returns {number} A temporary Entity ID (negative) to be resolved later.
     */
    createEntity() {
        const tempId = -Math.floor(Math.random() * 999999999) - 1;
        this._commands.push({ type: 'CREATE_ENTITY', tempId });
        return tempId;
    }

    /**
     * Defers destruction of an entity.
     * @param {number} entityId 
     */
    destroyEntity(entityId) {
        this._commands.push({ type: 'DESTROY_ENTITY', entityId });
    }

    /**
     * Defers adding a component to an entity.
     * @param {number} entityId 
     * @param {Function|string} componentType 
     * @param {any} [initialData] 
     */
    addComponent(entityId, componentType, initialData) {
        this._commands.push({ type: 'ADD_COMPONENT', entityId, componentType, initialData });
    }

    /**
     * Defers removing a component from an entity.
     * @param {number} entityId 
     * @param {Function|string} componentType 
     */
    removeComponent(entityId, componentType) {
        this._commands.push({ type: 'REMOVE_COMPONENT', entityId, componentType });
    }

    /**
     * Executes all deferred commands and clears the buffer.
     */
    execute() {
        if (this._commands.length === 0) return;

        const idMap = new Map(); // Maps temporary IDs to real IDs

        for (let i = 0; i < this._commands.length; i++) {
            const cmd = this._commands[i];
            let targetId = cmd.entityId;

            // Resolve temporary IDs
            if (targetId && targetId < 0) {
                targetId = idMap.get(targetId);
                if (targetId === undefined) continue; // Original creation failed or was skipped
            }

            try {
                switch (cmd.type) {
                    case 'CREATE_ENTITY':
                        const realId = this.world.createEntity();
                        idMap.set(cmd.tempId, realId);
                        break;
                    case 'DESTROY_ENTITY':
                        this.world.destroyEntity(targetId);
                        break;
                    case 'ADD_COMPONENT':
                        this.world.addComponent(targetId, cmd.componentType, cmd.initialData);
                        break;
                    case 'REMOVE_COMPONENT':
                        this.world.removeComponent(targetId, cmd.componentType);
                        break;
                }
            } catch (err) {
                console.error(`[CommandBuffer] Error executing command ${cmd.type}:`, err);
            }
        }

        this._commands.length = 0;
    }
}

/**
 * The central orchestrator of the Entity-Component-System.
 */
export class World {
    constructor() {
        // Entity Management
        this._nextEntityIndex = 0;
        this._availableEntities = []; // Queue of freed entity indices
        this._entityGenerations = new Uint8Array(10000); // Dynamic array for generations
        this._entitySignatures = []; // Array of BitSets for each entity index
        this._aliveEntities = new Set();

        // Component Management
        this._componentRegistry = new Map(); // Type -> ID
        this._componentNames = new Map(); // Name -> Type
        this._nextComponentId = 0;
        this._componentPools = []; // Array of SparseSets, indexed by Component ID

        // System Management
        this._systems = [];

        // Query Management
        this._queries = [];

        // Command Buffer
        this.commands = new CommandBuffer(this);

        // Signals
        this.onEntityCreated = new Signal();
        this.onEntityDestroyed = new Signal();
        this.onComponentAdded = new Signal();
        this.onComponentRemoved = new Signal();
    }

    // ========================================================================
    // COMPONENT REGISTRATION
    // ========================================================================

    /**
     * Registers a component type with the World.
     * Must be called before adding this component to any entity.
     * @param {Function} componentClass The constructor of the component.
     * @param {string} [name] Optional string identifier.
     * @returns {number} The internal Component ID.
     */
    registerComponent(componentClass, name = null) {
        if (this._componentRegistry.has(componentClass)) {
            console.warn(`[ECS] Component already registered: ${componentClass.name}`);
            return this._componentRegistry.get(componentClass);
        }

        const id = this._nextComponentId++;
        this._componentRegistry.set(componentClass, id);
        this._componentPools[id] = new SparseSet();

        const componentName = name || componentClass.name;
        if (componentName) {
            this._componentNames.set(componentName, componentClass);
        }

        return id;
    }

    /**
     * Gets the internal ID for a component type.
     * @param {Function|string} componentType 
     * @returns {number}
     */
    getComponentId(componentType) {
        let type = componentType;
        if (typeof componentType === 'string') {
            type = this._componentNames.get(componentType);
            if (!type) throw new Error(`[ECS] Component name not found: ${componentType}`);
        }

        const id = this._componentRegistry.get(type);
        if (id === undefined) {
            throw new Error(`[ECS] Component not registered: ${type.name || type}`);
        }
        return id;
    }

    // ========================================================================
    // ENTITY MANAGEMENT
    // ========================================================================

    /**
     * Creates a new Entity.
     * @returns {number} The Entity ID.
     */
    createEntity() {
        let index;
        let generation;

        if (this._availableEntities.length > 0) {
            index = this._availableEntities.shift();
            generation = this._entityGenerations[index];
        } else {
            index = this._nextEntityIndex++;
            this._ensureEntityCapacity(index);
            generation = 0;
            this._entityGenerations[index] = generation;
        }

        const entityId = createEntityId(index, generation);
        this._aliveEntities.add(entityId);
        
        if (!this._entitySignatures[index]) {
            this._entitySignatures[index] = new BitSet();
        } else {
            this._entitySignatures[index].reset();
        }

        this.onEntityCreated.emit(entityId);
        return entityId;
    }

    /**
     * Destroys an entity and removes all its components.
     * @param {number} entityId 
     */
    destroyEntity(entityId) {
        if (!this.isEntityAlive(entityId)) return;

        const index = getEntityIndex(entityId);
        const signature = this._entitySignatures[index];

        // Remove all components from pools
        for (let i = 0; i < this._nextComponentId; i++) {
            if (signature.has(i)) {
                this._componentPools[i].remove(index);
                this.onComponentRemoved.emit(entityId, i);
            }
        }

        signature.reset();

        // Increment generation to invalidate old IDs
        this._entityGenerations[index] = (this._entityGenerations[index] + 1) & ENTITY_GENERATION_MASK;
        
        this._aliveEntities.delete(entityId);
        this._availableEntities.push(index);

        this.onEntityDestroyed.emit(entityId);
    }

    /**
     * Checks if an entity is currently alive and valid.
     * @param {number} entityId 
     * @returns {boolean}
     */
    isEntityAlive(entityId) {
        const index = getEntityIndex(entityId);
        const generation = getEntityGeneration(entityId);
        return index < this._nextEntityIndex && this._entityGenerations[index] === generation && this._aliveEntities.has(entityId);
    }

    /**
     * Returns the BitSet signature of an entity.
     * @param {number} entityId 
     * @returns {BitSet|null}
     */
    getEntitySignature(entityId) {
        if (!this.isEntityAlive(entityId)) return null;
        return this._entitySignatures[getEntityIndex(entityId)];
    }

    /**
     * @private
     * @param {number} requiredIndex 
     */
    _ensureEntityCapacity(requiredIndex) {
        if (requiredIndex >= this._entityGenerations.length) {
            const newCapacity = Math.max(this._entityGenerations.length * 2, requiredIndex + 1000);
            const newGenerations = new Uint8Array(newCapacity);
            newGenerations.set(this._entityGenerations);
            this._entityGenerations = newGenerations;
        }
    }

    // ========================================================================
    // COMPONENT OPERATIONS
    // ========================================================================

    /**
     * Adds a component to an entity.
     * @param {number} entityId 
     * @param {Function|string} componentType 
     * @param {any} [initialData] Instance of the component, or initialization object.
     * @returns {any} The added component instance.
     */
    addComponent(entityId, componentType, initialData = null) {
        if (!this.isEntityAlive(entityId)) {
            throw new Error(`[ECS] Cannot add component to destroyed or invalid entity: ${entityId}`);
        }

        const compId = this.getComponentId(componentType);
        const index = getEntityIndex(entityId);
        const signature = this._entitySignatures[index];

        if (signature.has(compId)) {
            console.warn(`[ECS] Entity ${entityId} already has component ${componentType.name || componentType}`);
            return this.getComponent(entityId, componentType);
        }

        // Determine actual component class
        let type = componentType;
        if (typeof componentType === 'string') {
            type = this._componentNames.get(componentType);
        }

        // Instantiate or assign data
        let componentInstance;
        if (initialData instanceof type) {
            componentInstance = initialData;
        } else if (typeof type === 'function') {
            componentInstance = new type();
            if (initialData && typeof initialData === 'object') {
                Object.assign(componentInstance, initialData);
            }
        } else {
            componentInstance = initialData || {};
        }

        this._componentPools[compId].insert(index, componentInstance);
        signature.set(compId);

        this.onComponentAdded.emit(entityId, compId);

        return componentInstance;
    }

    /**
     * Removes a component from an entity.
     * @param {number} entityId 
     * @param {Function|string} componentType 
     */
    removeComponent(entityId, componentType) {
        if (!this.isEntityAlive(entityId)) return;

        const compId = this.getComponentId(componentType);
        const index = getEntityIndex(entityId);
        const signature = this._entitySignatures[index];

        if (!signature.has(compId)) return;

        this._componentPools[compId].remove(index);
        signature.clear(compId);

        this.onComponentRemoved.emit(entityId, compId);
    }

    /**
     * Retrieves a component from an entity.
     * @param {number} entityId 
     * @param {Function|string} componentType 
     * @returns {any|undefined}
     */
    getComponent(entityId, componentType) {
        if (!this.isEntityAlive(entityId)) return undefined;

        const compId = this.getComponentId(componentType);
        const index = getEntityIndex(entityId);
        
        return this._componentPools[compId].get(index);
    }

    /**
     * Checks if an entity has a specific component.
     * @param {number} entityId 
     * @param {Function|string} componentType 
     * @returns {boolean}
     */
    hasComponent(entityId, componentType) {
        if (!this.isEntityAlive(entityId)) return false;

        const compId = this.getComponentId(componentType);
        const index = getEntityIndex(entityId);
        
        return this._entitySignatures[index].has(compId);
    }

    // ========================================================================
    // QUERIES
    // ========================================================================

    /**
     * Starts building a query.
     * @returns {QueryBuilder}
     */
    query() {
        return new QueryBuilder(this);
    }

    /**
     * Registers and caches a query. Internal use mostly, use `world.query().build()`.
     * @param {BitSet} all 
     * @param {BitSet} any 
     * @param {BitSet} none 
     * @returns {Query}
     */
    registerQuery(all, any, none) {
        // Check if an identical query already exists to save memory/processing
        for (const q of this._queries) {
            if (q.all.containsAll(all) && all.containsAll(q.all) &&
                q.any.containsAll(any) && any.containsAll(q.any) &&
                q.none.containsAll(none) && none.containsAll(q.none)) {
                return q;
            }
        }

        const query = new Query(this, all, any, none);
        
        // Initial population
        for (const entityId of this._aliveEntities) {
            query._evaluate(entityId);
        }

        this._queries.push(query);
        return query;
    }

    // ========================================================================
    // SYSTEMS
    // ========================================================================

    /**
     * Adds a system to the world.
     * @param {System} systemInstance 
     * @returns {World}
     */
    addSystem(systemInstance) {
        this._systems.push(systemInstance);
        systemInstance.init();
        return this;
    }

    /**
     * Removes a system from the world.
     * @param {Function} systemClass 
     */
    removeSystem(systemClass) {
        const index = this._systems.findIndex(s => s instanceof systemClass);
        if (index !== -1) {
            const system = this._systems[index];
            system.destroy();
            this._systems.splice(index, 1);
        }
    }

    /**
     * Updates all systems and flushes the command buffer.
     * @param {number} dt Delta time.
     */
    update(dt) {
        for (let i = 0; i < this._systems.length; i++) {
            const system = this._systems[i];
            if (system.enabled) {
                system.update(dt);
            }
        }

        // Apply deferred structural changes
        this.commands.execute();
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================

    /**
     * Clears the entire world, destroying all entities and resetting pools.
     */
    clear() {
        this.commands._commands.length = 0;

        for (const entityId of Array.from(this._aliveEntities)) {
            this.destroyEntity(entityId);
        }

        for (let i = 0; i < this._componentPools.length; i++) {
            if (this._componentPools[i]) {
                this._componentPools[i].clear();
            }
        }

        this._queries.forEach(q => q.entities.clear());
    }
    
    /**
     * Serializes an entity and its components into a plain object.
     * Useful for network replication or saving game state.
     * @param {number} entityId 
     * @returns {Object|null}
     */
    serializeEntity(entityId) {
        if (!this.isEntityAlive(entityId)) return null;

        const data = { id: entityId, components: {} };
        const index = getEntityIndex(entityId);
        const signature = this._entitySignatures[index];

        this._componentNames.forEach((componentClass, name) => {
            const compId = this._componentRegistry.get(componentClass);
            if (signature.has(compId)) {
                const compData = this._componentPools[compId].get(index);
                // Deep clone to prevent reference issues
                data.components[name] = JSON.parse(JSON.stringify(compData));
            }
        });

        return data;
    }

    /**
     * Deserializes component data into a target entity.
     * @param {number} entityId 
     * @param {Object} serializedData 
     */
    deserializeEntity(entityId, serializedData) {
        if (!serializedData || !serializedData.components) return;

        for (const [name, compData] of Object.entries(serializedData.components)) {
            try {
                this.addComponent(entityId, name, compData);
            } catch (e) {
                console.warn(`[ECS] Failed to deserialize component ${name}:`, e);
            }
        }
    }
}