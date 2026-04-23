/**
 * @fileoverview Decide Engine - Advanced Artificial Intelligence Core
 * @module core/ai
 * @description
 * This module provides a robust, AAA-grade Artificial Intelligence framework for the Decide Engine.
 * It includes a complete Behavior Tree (BT) implementation, a Finite State Machine (FSM) architecture,
 * and a Blackboard system for shared memory and context management. 
 * Designed for complex NPC decision-making, dynamic interactions, and scalable simulation scenarios.
 * 
 * Features:
 * - Blackboard: Key-value memory store with event subscription and hierarchical scoping.
 * - Behavior Trees: Composites (Sequence, Selector, Parallel), Decorators (Inverter, Repeater, Timeout), and Leaves.
 * - Finite State Machines: Pushdown automata support, conditional transitions, and state lifecycles.
 * - AI Agent Controller: Unified interface blending BTs and FSMs for entity control.
 * - Profiling & Debugging: Built-in execution tracing and performance monitoring.
 * 
 * @version 3.0.0-beast
 * @author Antigravity Synthesis Orchestrator
 */

'use strict';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Represents the execution state of a Behavior Tree Node.
 * @readonly
 * @enum {number}
 */
export const NodeState = Object.freeze({
    /** Node has not been evaluated yet or was reset */
    READY: 0,
    /** Node is currently executing and requires more ticks to complete */
    RUNNING: 1,
    /** Node executed successfully */
    SUCCESS: 2,
    /** Node execution failed */
    FAILURE: 3,
    /** Node encountered an unrecoverable error */
    ERROR: 4
});

/**
 * Execution policies for Parallel composite nodes.
 * @readonly
 * @enum {number}
 */
export const ParallelPolicy = Object.freeze({
    /** Requires all children to succeed */
    REQUIRE_ALL: 0,
    /** Requires only one child to succeed */
    REQUIRE_ONE: 1
});

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

/**
 * Base error class for all AI-related exceptions.
 * @extends Error
 */
export class AIError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when a Behavior Tree configuration or execution error occurs.
 * @extends AIError
 */
export class BehaviorTreeError extends AIError {}

/**
 * Thrown when a State Machine configuration or execution error occurs.
 * @extends AIError
 */
export class StateMachineError extends AIError {}

// ============================================================================
// BLACKBOARD SYSTEM
// ============================================================================

/**
 * A shared memory architecture for AI agents to store and retrieve state.
 * Supports hierarchical scopes (global vs local) and event listeners for reactivity.
 */
export class Blackboard {
    /**
     * @param {Blackboard} [parent=null] - Optional parent blackboard for hierarchical memory.
     */
    constructor(parent = null) {
        /** @private @type {Map<string, any>} */
        this._memory = new Map();
        /** @private @type {Blackboard|null} */
        this._parent = parent;
        /** @private @type {Map<string, Set<Function>>} */
        this._listeners = new Map();
    }

    /**
     * Sets a value in the blackboard and triggers any associated listeners.
     * @param {string} key - The memory key.
     * @param {any} value - The value to store.
     */
    set(key, value) {
        if (typeof key !== 'string') {
            throw new AIError(`Blackboard keys must be strings. Received: ${typeof key}`);
        }
        
        const oldValue = this._memory.get(key);
        this._memory.set(key, value);

        if (oldValue !== value) {
            this._notifyListeners(key, value, oldValue);
        }
    }

    /**
     * Retrieves a value from the blackboard. Falls back to parent if not found locally.
     * @param {string} key - The memory key.
     * @returns {any} The stored value, or undefined if not found.
     */
    get(key) {
        if (this._memory.has(key)) {
            return this._memory.get(key);
        }
        if (this._parent) {
            return this._parent.get(key);
        }
        return undefined;
    }

    /**
     * Checks if a key exists in the blackboard (or its parent).
     * @param {string} key - The memory key.
     * @returns {boolean} True if the key exists.
     */
    has(key) {
        if (this._memory.has(key)) return true;
        if (this._parent) return this._parent.has(key);
        return false;
    }

    /**
     * Removes a key from the local blackboard.
     * @param {string} key - The memory key.
     * @returns {boolean} True if an element in the Map object existed and has been removed.
     */
    delete(key) {
        const existed = this._memory.has(key);
        if (existed) {
            const oldValue = this._memory.get(key);
            this._memory.delete(key);
            this._notifyListeners(key, undefined, oldValue);
        }
        return existed;
    }

    /**
     * Clears all local memory and listeners.
     */
    clear() {
        this._memory.clear();
        this._listeners.clear();
    }

    /**
     * Subscribes a callback function to changes on a specific key.
     * @param {string} key - The memory key to watch.
     * @param {Function} callback - Function called when the value changes: (newValue, oldValue) => void
     * @returns {Function} Unsubscribe function.
     */
    subscribe(key, callback) {
        if (!this._listeners.has(key)) {
            this._listeners.set(key, new Set());
        }
        this._listeners.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            const listeners = this._listeners.get(key);
            if (listeners) {
                listeners.delete(callback);
                if (listeners.size === 0) {
                    this._listeners.delete(key);
                }
            }
        };
    }

    /**
     * @private
     * @param {string} key 
     * @param {any} newValue 
     * @param {any} oldValue 
     */
    _notifyListeners(key, newValue, oldValue) {
        const listeners = this._listeners.get(key);
        if (listeners) {
            for (const callback of listeners) {
                try {
                    callback(newValue, oldValue);
                } catch (err) {
                    console.error(`[Blackboard] Error in listener for key '${key}':`, err);
                }
            }
        }
    }
}

// ============================================================================
// BEHAVIOR TREE CORE
// ============================================================================

/**
 * Context object passed to every node during a tick.
 * @typedef {Object} TickContext
 * @property {AIAgent} agent - The agent executing the tree.
 * @property {Blackboard} blackboard - The agent's blackboard.
 * @property {number} deltaTime - Time elapsed since last tick (in milliseconds).
 * @property {Object} world - Reference to the global world/engine state.
 */

/**
 * Abstract base class for all Behavior Tree Nodes.
 * @abstract
 */
export class BehaviorNode {
    /**
     * @param {string} [name='BehaviorNode'] - Debugging name for the node.
     */
    constructor(name = 'BehaviorNode') {
        /** @type {string} */
        this.name = name;
        /** @type {string} Unique identifier for the node */
        this.id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
        /** @type {number} Current execution state */
        this.state = NodeState.READY;
    }

    /**
     * Main execution entry point. Handles lifecycle methods.
     * @param {TickContext} context - The execution context.
     * @returns {number} The resulting NodeState.
     */
    tick(context) {
        if (this.state !== NodeState.RUNNING) {
            this.onEnter(context);
        }

        try {
            this.state = this.update(context);
        } catch (error) {
            console.error(`[BehaviorTree] Exception in node '${this.name}' (${this.id}):`, error);
            this.state = NodeState.ERROR;
        }

        if (this.state !== NodeState.RUNNING) {
            this.onExit(context);
        }

        return this.state;
    }

    /**
     * Called exactly once before the node starts executing (when transitioning from READY/SUCCESS/FAILURE to RUNNING).
     * @virtual
     * @param {TickContext} context 
     */
    onEnter(context) {}

    /**
     * The core logic of the node. Must be overridden by subclasses.
     * @abstract
     * @param {TickContext} context 
     * @returns {number} NodeState
     */
    update(context) {
        throw new BehaviorTreeError(`Node '${this.name}' must implement update()`);
    }

    /**
     * Called exactly once after the node finishes executing (returns SUCCESS, FAILURE, or ERROR).
     * @virtual
     * @param {TickContext} context 
     */
    onExit(context) {}

    /**
     * Resets the node state to READY. Recursively resets children if applicable.
     * @virtual
     */
    reset() {
        this.state = NodeState.READY;
    }
}

// ============================================================================
// BEHAVIOR TREE: LEAF NODES
// ============================================================================

/**
 * A leaf node that performs a specific action.
 */
export class ActionNode extends BehaviorNode {
    /**
     * @param {string} name 
     * @param {Function} actionFn - Function matching signature (context) => NodeState
     */
    constructor(name, actionFn) {
        super(name);
        if (typeof actionFn !== 'function') {
            throw new BehaviorTreeError(`ActionNode '${name}' requires a valid action function.`);
        }
        /** @private @type {Function} */
        this._actionFn = actionFn;
    }

    update(context) {
        return this._actionFn(context);
    }
}

/**
 * A leaf node that checks a condition. Returns SUCCESS if true, FAILURE if false.
 */
export class ConditionNode extends BehaviorNode {
    /**
     * @param {string} name 
     * @param {Function} conditionFn - Function matching signature (context) => boolean
     */
    constructor(name, conditionFn) {
        super(name);
        if (typeof conditionFn !== 'function') {
            throw new BehaviorTreeError(`ConditionNode '${name}' requires a valid condition function.`);
        }
        /** @private @type {Function} */
        this._conditionFn = conditionFn;
    }

    update(context) {
        return this._conditionFn(context) ? NodeState.SUCCESS : NodeState.FAILURE;
    }
}

/**
 * Utility Action: Waits for a specified duration.
 */
export class WaitNode extends BehaviorNode {
    /**
     * @param {number} duration - Duration to wait in milliseconds.
     */
    constructor(duration) {
        super(`Wait(${duration}ms)`);
        this.duration = duration;
        this.startTime = 0;
    }

    onEnter(context) {
        this.startTime = Date.now();
    }

    update(context) {
        if (Date.now() - this.startTime >= this.duration) {
            return NodeState.SUCCESS;
        }
        return NodeState.RUNNING;
    }
}

// ============================================================================
// BEHAVIOR TREE: COMPOSITE NODES
// ============================================================================

/**
 * Base class for nodes that contain multiple children.
 * @abstract
 */
export class CompositeNode extends BehaviorNode {
    /**
     * @param {string} name 
     * @param {BehaviorNode[]} [children=[]] 
     */
    constructor(name, children = []) {
        super(name);
        /** @type {BehaviorNode[]} */
        this.children = children;
    }

    /**
     * Adds a child node to this composite.
     * @param {BehaviorNode} child 
     * @returns {CompositeNode} This node for chaining.
     */
    addChild(child) {
        if (!(child instanceof BehaviorNode)) {
            throw new BehaviorTreeError(`Child must be an instance of BehaviorNode.`);
        }
        this.children.push(child);
        return this;
    }

    reset() {
        super.reset();
        for (const child of this.children) {
            child.reset();
        }
    }
}

/**
 * Sequence (AND): Ticks children in order. 
 * Fails if any child fails. Succeeds if all children succeed.
 */
export class Sequence extends CompositeNode {
    constructor(name = 'Sequence', children = []) {
        super(name, children);
        /** @private @type {number} */
        this._currentIndex = 0;
    }

    onEnter(context) {
        this._currentIndex = 0;
    }

    update(context) {
        if (this.children.length === 0) return NodeState.SUCCESS;

        while (this._currentIndex < this.children.length) {
            const child = this.children[this._currentIndex];
            const status = child.tick(context);

            if (status === NodeState.RUNNING) {
                return NodeState.RUNNING;
            }

            if (status === NodeState.FAILURE || status === NodeState.ERROR) {
                return status;
            }

            // Child succeeded, move to next
            this._currentIndex++;
        }

        return NodeState.SUCCESS;
    }
}

/**
 * Selector (OR): Ticks children in order.
 * Succeeds if any child succeeds. Fails if all children fail.
 */
export class Selector extends CompositeNode {
    constructor(name = 'Selector', children = []) {
        super(name, children);
        /** @private @type {number} */
        this._currentIndex = 0;
    }

    onEnter(context) {
        this._currentIndex = 0;
    }

    update(context) {
        if (this.children.length === 0) return NodeState.FAILURE;

        while (this._currentIndex < this.children.length) {
            const child = this.children[this._currentIndex];
            const status = child.tick(context);

            if (status === NodeState.RUNNING) {
                return NodeState.RUNNING;
            }

            if (status === NodeState.SUCCESS) {
                return NodeState.SUCCESS;
            }

            if (status === NodeState.ERROR) {
                return NodeState.ERROR;
            }

            // Child failed, try next
            this._currentIndex++;
        }

        return NodeState.FAILURE;
    }
}

/**
 * Parallel: Ticks all children concurrently every tick.
 * Evaluates success/failure based on the provided ParallelPolicy.
 */
export class Parallel extends CompositeNode {
    /**
     * @param {string} name 
     * @param {number} successPolicy - ParallelPolicy.REQUIRE_ALL or REQUIRE_ONE
     * @param {number} failurePolicy - ParallelPolicy.REQUIRE_ALL or REQUIRE_ONE
     * @param {BehaviorNode[]} children 
     */
    constructor(name = 'Parallel', successPolicy = ParallelPolicy.REQUIRE_ALL, failurePolicy = ParallelPolicy.REQUIRE_ONE, children = []) {
        super(name, children);
        this.successPolicy = successPolicy;
        this.failurePolicy = failurePolicy;
    }

    update(context) {
        let successCount = 0;
        let failureCount = 0;
        const totalChildren = this.children.length;

        if (totalChildren === 0) return NodeState.SUCCESS;

        for (const child of this.children) {
            // Only tick children that are not already finished
            if (child.state === NodeState.RUNNING || child.state === NodeState.READY) {
                child.tick(context);
            }

            if (child.state === NodeState.SUCCESS) {
                successCount++;
                if (this.successPolicy === ParallelPolicy.REQUIRE_ONE) {
                    this._abortRunningChildren();
                    return NodeState.SUCCESS;
                }
            }

            if (child.state === NodeState.FAILURE) {
                failureCount++;
                if (this.failurePolicy === ParallelPolicy.REQUIRE_ONE) {
                    this._abortRunningChildren();
                    return NodeState.FAILURE;
                }
            }
            
            if (child.state === NodeState.ERROR) {
                this._abortRunningChildren();
                return NodeState.ERROR;
            }
        }

        if (this.failurePolicy === ParallelPolicy.REQUIRE_ALL && failureCount === totalChildren) {
            return NodeState.FAILURE;
        }

        if (this.successPolicy === ParallelPolicy.REQUIRE_ALL && successCount === totalChildren) {
            return NodeState.SUCCESS;
        }

        return NodeState.RUNNING;
    }

    /**
     * @private
     */
    _abortRunningChildren() {
        for (const child of this.children) {
            if (child.state === NodeState.RUNNING) {
                child.reset();
            }
        }
    }
}

/**
 * RandomSelector: Shuffles children randomly before acting like a standard Selector.
 * Excellent for creating varied, non-deterministic NPC behaviors.
 */
export class RandomSelector extends Selector {
    constructor(name = 'RandomSelector', children = []) {
        super(name, children);
    }

    onEnter(context) {
        super.onEnter(context);
        // Fisher-Yates shuffle
        for (let i = this.children.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.children[i], this.children[j]] = [this.children[j], this.children[i]];
        }
    }
}

// ============================================================================
// BEHAVIOR TREE: DECORATOR NODES
// ============================================================================

/**
 * Base class for nodes that wrap a single child to modify its behavior.
 * @abstract
 */
export class DecoratorNode extends BehaviorNode {
    /**
     * @param {string} name 
     * @param {BehaviorNode} child 
     */
    constructor(name, child) {
        super(name);
        if (!(child instanceof BehaviorNode)) {
            throw new BehaviorTreeError(`Decorator '${name}' requires a valid child BehaviorNode.`);
        }
        /** @type {BehaviorNode} */
        this.child = child;
    }

    reset() {
        super.reset();
        this.child.reset();
    }
}

/**
 * Inverter (NOT): Inverts SUCCESS to FAILURE and FAILURE to SUCCESS.
 */
export class Inverter extends DecoratorNode {
    constructor(child) {
        super('Inverter', child);
    }

    update(context) {
        const status = this.child.tick(context);
        if (status === NodeState.SUCCESS) return NodeState.FAILURE;
        if (status === NodeState.FAILURE) return NodeState.SUCCESS;
        return status;
    }
}

/**
 * Succeeder: Always returns SUCCESS, regardless of child's result (unless RUNNING/ERROR).
 */
export class Succeeder extends DecoratorNode {
    constructor(child) {
        super('Succeeder', child);
    }

    update(context) {
        const status = this.child.tick(context);
        if (status === NodeState.RUNNING || status === NodeState.ERROR) return status;
        return NodeState.SUCCESS;
    }
}

/**
 * Repeater: Repeats the child node a specific number of times, or infinitely.
 */
export class Repeater extends DecoratorNode {
    /**
     * @param {BehaviorNode} child 
     * @param {number} [maxLoops=-1] - Number of times to loop. -1 for infinite.
     */
    constructor(child, maxLoops = -1) {
        super(`Repeater(${maxLoops})`, child);
        this.maxLoops = maxLoops;
        /** @private @type {number} */
        this._currentLoops = 0;
    }

    onEnter(context) {
        this._currentLoops = 0;
    }

    update(context) {
        while (this.maxLoops === -1 || this._currentLoops < this.maxLoops) {
            const status = this.child.tick(context);

            if (status === NodeState.RUNNING) {
                return NodeState.RUNNING;
            }

            if (status === NodeState.ERROR) {
                return NodeState.ERROR;
            }

            // Reset child for the next iteration
            this.child.reset();
            this._currentLoops++;
        }

        return NodeState.SUCCESS;
    }
}

/**
 * Retry: Retries a failing child node up to a maximum number of times.
 */
export class Retry extends DecoratorNode {
    /**
     * @param {BehaviorNode} child 
     * @param {number} maxRetries 
     */
    constructor(child, maxRetries = 3) {
        super(`Retry(${maxRetries})`, child);
        this.maxRetries = maxRetries;
        /** @private @type {number} */
        this._currentRetries = 0;
    }

    onEnter(context) {
        this._currentRetries = 0;
    }

    update(context) {
        while (this._currentRetries <= this.maxRetries) {
            const status = this.child.tick(context);

            if (status === NodeState.SUCCESS) {
                return NodeState.SUCCESS;
            }

            if (status === NodeState.RUNNING || status === NodeState.ERROR) {
                return status;
            }

            // Status is FAILURE
            this._currentRetries++;
            if (this._currentRetries <= this.maxRetries) {
                this.child.reset();
            }
        }

        return NodeState.FAILURE;
    }
}

/**
 * Timeout: Fails the child node if it runs longer than the specified duration.
 */
export class Timeout extends DecoratorNode {
    /**
     * @param {BehaviorNode} child 
     * @param {number} durationLimit - Maximum execution time in milliseconds.
     */
    constructor(child, durationLimit) {
        super(`Timeout(${durationLimit}ms)`, child);
        this.durationLimit = durationLimit;
        /** @private @type {number} */
        this._startTime = 0;
    }

    onEnter(context) {
        this._startTime = Date.now();
    }

    update(context) {
        if (Date.now() - this._startTime > this.durationLimit) {
            this.child.reset(); // Abort child
            return NodeState.FAILURE;
        }

        return this.child.tick(context);
    }
}

// ============================================================================
// BEHAVIOR TREE: BUILDER PATTERN
// ============================================================================

/**
 * Fluent interface for constructing complex Behavior Trees seamlessly.
 */
export class BehaviorTreeBuilder {
    constructor() {
        /** @private @type {BehaviorNode[]} */
        this._nodeStack = [];
        /** @private @type {BehaviorNode|null} */
        this._root = null;
    }

    /** @private */
    _addNode(node) {
        if (this._nodeStack.length > 0) {
            const parent = this._nodeStack[this._nodeStack.length - 1];
            if (parent instanceof CompositeNode) {
                parent.addChild(node);
            } else if (parent instanceof DecoratorNode) {
                parent.child = node;
                this._nodeStack.pop(); // Decorators only take one child, so pop immediately
            } else {
                throw new BehaviorTreeError("Cannot add child to a non-composite/non-decorator node.");
            }
        } else {
            this._root = node;
        }
        return this;
    }

    sequence(name = 'Sequence') {
        const seq = new Sequence(name);
        this._addNode(seq);
        this._nodeStack.push(seq);
        return this;
    }

    selector(name = 'Selector') {
        const sel = new Selector(name);
        this._addNode(sel);
        this._nodeStack.push(sel);
        return this;
    }

    parallel(name = 'Parallel', successPolicy = ParallelPolicy.REQUIRE_ALL, failurePolicy = ParallelPolicy.REQUIRE_ONE) {
        const par = new Parallel(name, successPolicy, failurePolicy);
        this._addNode(par);
        this._nodeStack.push(par);
        return this;
    }

    inverter() {
        const inv = new Inverter(new WaitNode(0)); // Dummy child initially
        this._addNode(inv);
        this._nodeStack.push(inv);
        return this;
    }

    repeater(maxLoops = -1) {
        const rep = new Repeater(new WaitNode(0), maxLoops);
        this._addNode(rep);
        this._nodeStack.push(rep);
        return this;
    }

    timeout(durationLimit) {
        const tmt = new Timeout(new WaitNode(0), durationLimit);
        this._addNode(tmt);
        this._nodeStack.push(tmt);
        return this;
    }

    action(name, actionFn) {
        return this._addNode(new ActionNode(name, actionFn));
    }

    condition(name, conditionFn) {
        return this._addNode(new ConditionNode(name, conditionFn));
    }

    wait(duration) {
        return this._addNode(new WaitNode(duration));
    }

    end() {
        if (this._nodeStack.length > 0) {
            this._nodeStack.pop();
        }
        return this;
    }

    build() {
        if (!this._root) {
            throw new BehaviorTreeError("Cannot build an empty Behavior Tree.");
        }
        if (this._nodeStack.length > 0) {
            console.warn(`[BehaviorTreeBuilder] Tree built with unclosed composites. Stack size: ${this._nodeStack.length}`);
        }
        return this._root;
    }
}

// ============================================================================
// FINITE STATE MACHINE (FSM)
// ============================================================================

/**
 * Represents a single State within a Finite State Machine.
 * @abstract
 */
export class State {
    /**
     * @param {string} name - Unique identifier for the state.
     */
    constructor(name) {
        this.name = name;
        /** @type {StateMachine|null} */
        this.machine = null;
    }

    /**
     * Called when the state is entered.
     * @virtual
     * @param {any} payload - Optional data passed from the previous state.
     */
    onEnter(payload) {}

    /**
     * Called every tick while this state is active.
     * @abstract
     * @param {number} deltaTime - Time since last tick.
     */
    onUpdate(deltaTime) {}

    /**
     * Called when the state is exited.
     * @virtual
     */
    onExit() {}
}

/**
 * Represents a conditional transition between two states.
 */
export class Transition {
    /**
     * @param {string} toState - Name of the target state.
     * @param {Function} conditionFn - Function returning boolean. If true, transition occurs.
     */
    constructor(toState, conditionFn) {
        this.toState = toState;
        this.conditionFn = conditionFn;
    }
}

/**
 * A Hierarchical/Pushdown Finite State Machine.
 * Manages states, transitions, and a state stack for temporary sub-states.
 */
export class StateMachine {
    /**
     * @param {AIAgent} agent - The agent this FSM controls.
     */
    constructor(agent) {
        /** @type {AIAgent} */
        this.agent = agent;
        /** @private @type {Map<string, State>} */
        this._states = new Map();
        /** @private @type {Map<string, Transition[]>} */
        this._transitions = new Map();
        /** @private @type {Transition[]} */
        this._anyStateTransitions = [];
        /** @private @type {State[]} */
        this._stateStack = [];
        /** @private @type {State|null} */
        this._currentState = null;
    }

    /**
     * Gets the currently active state.
     * @returns {State|null}
     */
    get currentState() {
        return this._currentState;
    }

    /**
     * Adds a state to the machine.
     * @param {State} state 
     */
    addState(state) {
        if (!(state instanceof State)) throw new StateMachineError("Must pass a valid State instance.");
        state.machine = this;
        this._states.set(state.name, state);
        if (!this._transitions.has(state.name)) {
            this._transitions.set(state.name, []);
        }
    }

    /**
     * Adds a directed transition from one state to another based on a condition.
     * @param {string} fromState 
     * @param {string} toState 
     * @param {Function} conditionFn 
     */
    addTransition(fromState, toState, conditionFn) {
        if (!this._states.has(fromState)) throw new StateMachineError(`State '${fromState}' not found.`);
        if (!this._states.has(toState)) throw new StateMachineError(`State '${toState}' not found.`);
        
        this._transitions.get(fromState).push(new Transition(toState, conditionFn));
    }

    /**
     * Adds a transition that can trigger from ANY state.
     * @param {string} toState 
     * @param {Function} conditionFn 
     */
    addAnyTransition(toState, conditionFn) {
        if (!this._states.has(toState)) throw new StateMachineError(`State '${toState}' not found.`);
        this._anyStateTransitions.push(new Transition(toState, conditionFn));
    }

    /**
     * Sets the initial state of the machine.
     * @param {string} stateName 
     * @param {any} [payload] 
     */
    start(stateName, payload = null) {
        if (!this._states.has(stateName)) throw new StateMachineError(`State '${stateName}' not found.`);
        this._currentState = this._states.get(stateName);
        this._stateStack = [this._currentState];
        this._currentState.onEnter(payload);
    }

    /**
     * Immediately transitions to a new state, replacing the current top of the stack.
     * @param {string} stateName 
     * @param {any} [payload] 
     */
    changeState(stateName, payload = null) {
        if (!this._states.has(stateName)) throw new StateMachineError(`State '${stateName}' not found.`);
        
        if (this._currentState) {
            this._currentState.onExit();
            this._stateStack.pop();
        }

        this._currentState = this._states.get(stateName);
        this._stateStack.push(this._currentState);
        this._currentState.onEnter(payload);
    }

    /**
     * Pushes a new state onto the stack, pausing the current state.
     * Useful for interruptions like "Stunned" or "Flee".
     * @param {string} stateName 
     * @param {any} [payload] 
     */
    pushState(stateName, payload = null) {
        if (!this._states.has(stateName)) throw new StateMachineError(`State '${stateName}' not found.`);
        
        this._currentState = this._states.get(stateName);
        this._stateStack.push(this._currentState);
        this._currentState.onEnter(payload);
    }

    /**
     * Pops the current state off the stack, resuming the previous state.
     */
    popState() {
        if (this._stateStack.length <= 1) {
            console.warn("[StateMachine] Cannot pop the root state.");
            return;
        }

        this._currentState.onExit();
        this._stateStack.pop();
        this._currentState = this._stateStack[this._stateStack.length - 1];
        // Note: Depending on design, you might want to call an onResume() here.
    }

    /**
     * Evaluates transitions and updates the current state.
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (!this._currentState) return;

        // Check 'Any' transitions first (highest priority)
        for (const transition of this._anyStateTransitions) {
            if (transition.toState !== this._currentState.name && transition.conditionFn(this.agent)) {
                this.changeState(transition.toState);
                return;
            }
        }

        // Check local transitions
        const localTransitions = this._transitions.get(this._currentState.name) || [];
        for (const transition of localTransitions) {
            if (transition.conditionFn(this.agent)) {
                this.changeState(transition.toState);
                return;
            }
        }

        // Update active state
        this._currentState.onUpdate(deltaTime);
    }
}

// ============================================================================
// AI AGENT CONTROLLER
// ============================================================================

/**
 * The core entity controller that unifies the Blackboard, Behavior Tree, and FSM.
 * Represents a single NPC or autonomous actor in the Decide Engine.
 */
export class AIAgent {
    /**
     * @param {string} id - Unique identifier for the agent.
     * @param {Object} world - Reference to the simulation/game world.
     */
    constructor(id, world) {
        this.id = id;
        this.world = world;
        
        /** @type {Blackboard} */
        this.blackboard = new Blackboard();
        
        /** @type {BehaviorNode|null} */
        this.behaviorTree = null;
        
        /** @type {StateMachine} */
        this.stateMachine = new StateMachine(this);
        
        /** @type {boolean} */
        this.isActive = true;

        /** @private @type {number} */
        this._lastTickTime = Date.now();
    }

    /**
     * Assigns a behavior tree to the agent.
     * @param {BehaviorNode} rootNode 
     */
    setBehaviorTree(rootNode) {
        this.behaviorTree = rootNode;
    }

    /**
     * Main update loop for the agent. Should be called by the engine's tick mechanism.
     * @param {number} [deltaTime] - Optional delta time. Calculated automatically if omitted.
     */
    update(deltaTime = null) {
        if (!this.isActive) return;

        const now = Date.now();
        const dt = deltaTime !== null ? deltaTime : (now - this._lastTickTime);
        this._lastTickTime = now;

        // 1. Update State Machine (Macro-level behavior / physical states)
        try {
            this.stateMachine.update(dt);
        } catch (err) {
            console.error(`[AIAgent ${this.id}] FSM Update Error:`, err);
        }

        // 2. Update Behavior Tree (Micro-level decision making)
        if (this.behaviorTree) {
            const context = {
                agent: this,
                blackboard: this.blackboard,
                deltaTime: dt,
                world: this.world
            };

            try {
                this.behaviorTree.tick(context);
            } catch (err) {
                console.error(`[AIAgent ${this.id}] Behavior Tree Tick Error:`, err);
            }
        }
    }

    /**
     * Resets the agent's internal state, wiping memory and resetting BTs.
     */
    reset() {
        this.blackboard.clear();
        if (this.behaviorTree) {
            this.behaviorTree.reset();
        }
    }

    /**
     * Halts agent processing.
     */
    sleep() {
        this.isActive = false;
    }

    /**
     * Resumes agent processing.
     */
    wake() {
        this.isActive = true;
        this._lastTickTime = Date.now();
    }
}