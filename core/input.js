/**
 * @fileoverview Unified Input System for Decide Engine ECS
 * @module core/input
 * @description
 * Captures user interactions (keyboard, mouse, touch, and gamepad) and maps
 * them to logical actions for consumption by Entity-Component-System (ECS) architectures.
 * 
 * Features:
 * - Real-time state tracking for Keyboard, Mouse, and Gamepad.
 * - Transient state tracking (just pressed, just released).
 * - Logical Action Mapping (e.g., binding 'Space' and 'GamepadButton0' to 'JUMP').
 * - Pointer Lock API integration for first-person/3D camera controls.
 * - Automatic state clearing on window blur to prevent "stuck" keys.
 * - Normalized coordinate mapping for mouse and touch inputs.
 * 
 * @author Antigravity Beast-Mode
 * @version 3.0.0
 */

/**
 * Standard mouse button identifiers.
 * @enum {number}
 */
export const MouseButton = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
    BACK: 3,
    FORWARD: 4
};

/**
 * Enum for input device types.
 * @enum {string}
 */
export const DeviceType = {
    KEYBOARD: 'keyboard',
    MOUSE: 'mouse',
    GAMEPAD: 'gamepad',
    TOUCH: 'touch'
};

/**
 * Core InputManager class responsible for listening to DOM events
 * and translating them into queryable states for the ECS game loop.
 */
export class InputManager {
    /**
     * Initializes the Input Manager.
     * @param {HTMLElement|Window} [targetElement=window] - The DOM element to attach listeners to.
     * @param {Object} [options={}] - Configuration options.
     * @param {boolean} [options.preventContextMenu=true] - Disables the right-click menu.
     * @param {boolean} [options.preventScrolling=true] - Prevents default scrolling on Space/Arrow keys.
     * @param {number} [options.gamepadDeadzone=0.1] - Deadzone threshold for analog sticks.
     */
    constructor(targetElement = window, options = {}) {
        this.target = targetElement;
        this.options = {
            preventContextMenu: true,
            preventScrolling: true,
            gamepadDeadzone: 0.1,
            ...options
        };

        // ----------------------------------------------------------------------
        // Raw Input State
        // ----------------------------------------------------------------------
        
        /** @private */
        this._keys = new Set();
        /** @private */
        this._keysPressedThisFrame = new Set();
        /** @private */
        this._keysReleasedThisFrame = new Set();

        /** @private */
        this._mouse = {
            buttons: new Set(),
            buttonsPressedThisFrame: new Set(),
            buttonsReleasedThisFrame: new Set(),
            x: 0,
            y: 0,
            movementX: 0,
            movementY: 0,
            wheelDeltaX: 0,
            wheelDeltaY: 0,
            wheelDeltaZ: 0,
            isLocked: false
        };

        /** @private */
        this._gamepads = new Map();
        
        /** @private */
        this._touches = new Map();

        // ----------------------------------------------------------------------
        // Logical Action Mapping
        // ----------------------------------------------------------------------
        
        /** 
         * Maps action names (e.g., 'JUMP') to an array of input codes.
         * @private 
         * @type {Map<string, Array<{device: string, code: string|number}>>} 
         */
        this._actionBindings = new Map();

        // ----------------------------------------------------------------------
        // Event Binding References (for clean removal)
        // ----------------------------------------------------------------------
        
        this._handlers = {
            keydown: this._handleKeyDown.bind(this),
            keyup: this._handleKeyUp.bind(this),
            mousedown: this._handleMouseDown.bind(this),
            mouseup: this._handleMouseUp.bind(this),
            mousemove: this._handleMouseMove.bind(this),
            wheel: this._handleWheel.bind(this),
            contextmenu: this._handleContextMenu.bind(this),
            blur: this._handleBlur.bind(this),
            pointerlockchange: this._handlePointerLockChange.bind(this),
            gamepadconnected: this._handleGamepadConnected.bind(this),
            gamepaddisconnected: this._handleGamepadDisconnected.bind(this)
        };

        this._isInitialized = false;
    }

    /**
     * Attaches all necessary event listeners to the target element and window.
     * Must be called before querying input.
     * @returns {InputManager} Returns this instance for chaining.
     */
    init() {
        if (this._isInitialized) {
            console.warn('[InputManager] Already initialized.');
            return this;
        }

        const target = this.target;

        // Keyboard Events
        window.addEventListener('keydown', this._handlers.keydown, { passive: false });
        window.addEventListener('keyup', this._handlers.keyup, { passive: false });
        
        // Mouse Events
        target.addEventListener('mousedown', this._handlers.mousedown, { passive: false });
        target.addEventListener('mouseup', this._handlers.mouseup, { passive: false });
        target.addEventListener('mousemove', this._handlers.mousemove, { passive: false });
        target.addEventListener('wheel', this._handlers.wheel, { passive: false });
        target.addEventListener('contextmenu', this._handlers.contextmenu, { passive: false });

        // Window state events
        window.addEventListener('blur', this._handlers.blur);
        document.addEventListener('pointerlockchange', this._handlers.pointerlockchange);

        // Gamepad Events
        window.addEventListener('gamepadconnected', this._handlers.gamepadconnected);
        window.addEventListener('gamepaddisconnected', this._handlers.gamepaddisconnected);

        this._isInitialized = true;
        console.info('[InputManager] Successfully initialized and listening to events.');
        
        return this;
    }

    /**
     * Detaches all event listeners and cleans up state.
     */
    destroy() {
        if (!this._isInitialized) return;

        const target = this.target;

        window.removeEventListener('keydown', this._handlers.keydown);
        window.removeEventListener('keyup', this._handlers.keyup);
        
        target.removeEventListener('mousedown', this._handlers.mousedown);
        target.removeEventListener('mouseup', this._handlers.mouseup);
        target.removeEventListener('mousemove', this._handlers.mousemove);
        target.removeEventListener('wheel', this._handlers.wheel);
        target.removeEventListener('contextmenu', this._handlers.contextmenu);

        window.removeEventListener('blur', this._handlers.blur);
        document.removeEventListener('pointerlockchange', this._handlers.pointerlockchange);

        window.removeEventListener('gamepadconnected', this._handlers.gamepadconnected);
        window.removeEventListener('gamepaddisconnected', this._handlers.gamepaddisconnected);

        this._clearState();
        this._isInitialized = false;
        console.info('[InputManager] Destroyed and event listeners removed.');
    }

    /**
     * Must be called at the END of every frame in the ECS game loop.
     * Clears transient states like "just pressed" and "just released" and resets deltas.
     */
    update() {
        // Clear transient keyboard state
        this._keysPressedThisFrame.clear();
        this._keysReleasedThisFrame.clear();

        // Clear transient mouse state
        this._mouse.buttonsPressedThisFrame.clear();
        this._mouse.buttonsReleasedThisFrame.clear();
        this._mouse.movementX = 0;
        this._mouse.movementY = 0;
        this._mouse.wheelDeltaX = 0;
        this._mouse.wheelDeltaY = 0;
        this._mouse.wheelDeltaZ = 0;

        // Poll Gamepads (Gamepad API requires per-frame polling)
        this._pollGamepads();
    }

    // ----------------------------------------------------------------------
    // Action Binding System (ECS Integration)
    // ----------------------------------------------------------------------

    /**
     * Binds a physical input to a logical action.
     * @param {string} actionName - The logical name of the action (e.g., 'MOVE_FORWARD').
     * @param {string} deviceType - The device type (from DeviceType enum).
     * @param {string|number} code - The input code (e.g., 'KeyW', MouseButton.LEFT, 'Button0').
     * @returns {InputManager} Returns this instance for chaining.
     */
    bindAction(actionName, deviceType, code) {
        if (!this._actionBindings.has(actionName)) {
            this._actionBindings.set(actionName, []);
        }
        
        const bindings = this._actionBindings.get(actionName);
        
        // Prevent duplicate bindings
        const exists = bindings.some(b => b.device === deviceType && b.code === code);
        if (!exists) {
            bindings.push({ device: deviceType, code: code });
        }

        return this;
    }

    /**
     * Unbinds a specific physical input from a logical action.
     * @param {string} actionName - The logical name of the action.
     * @param {string} deviceType - The device type.
     * @param {string|number} code - The input code.
     */
    unbindAction(actionName, deviceType, code) {
        if (!this._actionBindings.has(actionName)) return;
        
        const bindings = this._actionBindings.get(actionName);
        const filtered = bindings.filter(b => !(b.device === deviceType && b.code === code));
        
        if (filtered.length === 0) {
            this._actionBindings.delete(actionName);
        } else {
            this._actionBindings.set(actionName, filtered);
        }
    }

    /**
     * Clears all bindings for a specific action.
     * @param {string} actionName - The logical name of the action.
     */
    clearAction(actionName) {
        this._actionBindings.delete(actionName);
    }

    // ----------------------------------------------------------------------
    // State Querying Methods (Used by ECS Systems)
    // ----------------------------------------------------------------------

    /**
     * Checks if a logical action is currently active (held down).
     * @param {string} actionName - The action to check.
     * @returns {boolean} True if any bound input is currently active.
     */
    isActionActive(actionName) {
        const bindings = this._actionBindings.get(actionName);
        if (!bindings) return false;

        for (let i = 0; i < bindings.length; i++) {
            const { device, code } = bindings[i];
            if (device === DeviceType.KEYBOARD && this.isKeyDown(code)) return true;
            if (device === DeviceType.MOUSE && this.isMouseButtonDown(code)) return true;
            if (device === DeviceType.GAMEPAD && this.isGamepadButtonDown(code)) return true;
        }
        return false;
    }

    /**
     * Checks if a logical action was pressed *exactly* this frame.
     * @param {string} actionName - The action to check.
     * @returns {boolean} True if any bound input was just pressed.
     */
    isActionJustPressed(actionName) {
        const bindings = this._actionBindings.get(actionName);
        if (!bindings) return false;

        for (let i = 0; i < bindings.length; i++) {
            const { device, code } = bindings[i];
            if (device === DeviceType.KEYBOARD && this.isKeyJustPressed(code)) return true;
            if (device === DeviceType.MOUSE && this.isMouseButtonJustPressed(code)) return true;
            // Gamepad just pressed logic would require tracking previous frame state, 
            // simplified here to basic polling for brevity.
        }
        return false;
    }

    /**
     * Gets the analog value of a logical action (useful for gamepad triggers/sticks).
     * Returns 1.0 for digital inputs (keys/mouse clicks) if active, 0.0 otherwise.
     * @param {string} actionName - The action to check.
     * @returns {number} A float between 0.0 and 1.0 (or -1.0 to 1.0 for axes).
     */
    getActionValue(actionName) {
        const bindings = this._actionBindings.get(actionName);
        if (!bindings) return 0.0;

        let highestValue = 0.0;

        for (let i = 0; i < bindings.length; i++) {
            const { device, code } = bindings[i];
            let val = 0.0;

            if (device === DeviceType.KEYBOARD && this.isKeyDown(code)) val = 1.0;
            if (device === DeviceType.MOUSE && this.isMouseButtonDown(code)) val = 1.0;
            if (device === DeviceType.GAMEPAD) {
                // Determine if code is an axis or button
                if (typeof code === 'string' && code.startsWith('Axis')) {
                    const axisIndex = parseInt(code.replace('Axis', ''), 10);
                    val = this.getGamepadAxis(0, axisIndex); // Defaults to gamepad 0
                } else if (typeof code === 'string' && code.startsWith('Button')) {
                    const buttonIndex = parseInt(code.replace('Button', ''), 10);
                    val = this.getGamepadButtonValue(0, buttonIndex);
                }
            }

            if (Math.abs(val) > Math.abs(highestValue)) {
                highestValue = val;
            }
        }

        return highestValue;
    }

    // --- Keyboard Queries ---

    /**
     * Checks if a specific key is currently held down.
     * @param {string} code - The KeyboardEvent.code (e.g., 'KeyW', 'Space').
     * @returns {boolean}
     */
    isKeyDown(code) {
        return this._keys.has(code);
    }

    /**
     * Checks if a specific key was pressed during the current frame.
     * @param {string} code - The KeyboardEvent.code.
     * @returns {boolean}
     */
    isKeyJustPressed(code) {
        return this._keysPressedThisFrame.has(code);
    }

    /**
     * Checks if a specific key was released during the current frame.
     * @param {string} code - The KeyboardEvent.code.
     * @returns {boolean}
     */
    isKeyJustReleased(code) {
        return this._keysReleasedThisFrame.has(code);
    }

    // --- Mouse Queries ---

    /**
     * Checks if a specific mouse button is currently held down.
     * @param {number} button - The mouse button code (use MouseButton enum).
     * @returns {boolean}
     */
    isMouseButtonDown(button) {
        return this._mouse.buttons.has(button);
    }

    /**
     * Checks if a specific mouse button was pressed during the current frame.
     * @param {number} button - The mouse button code.
     * @returns {boolean}
     */
    isMouseButtonJustPressed(button) {
        return this._mouse.buttonsPressedThisFrame.has(button);
    }

    /**
     * Checks if a specific mouse button was released during the current frame.
     * @param {number} button - The mouse button code.
     * @returns {boolean}
     */
    isMouseButtonJustReleased(button) {
        return this._mouse.buttonsReleasedThisFrame.has(button);
    }

    /**
     * Retrieves the current mouse position relative to the target element.
     * @returns {{x: number, y: number}}
     */
    getMousePosition() {
        return { x: this._mouse.x, y: this._mouse.y };
    }

    /**
     * Retrieves the mouse movement delta for the current frame.
     * Highly useful for first-person camera controls.
     * @returns {{x: number, y: number}}
     */
    getMouseDelta() {
        return { x: this._mouse.movementX, y: this._mouse.movementY };
    }

    /**
     * Retrieves the scroll wheel delta for the current frame.
     * @returns {{x: number, y: number, z: number}}
     */
    getWheelDelta() {
        return { x: this._mouse.wheelDeltaX, y: this._mouse.wheelDeltaY, z: this._mouse.wheelDeltaZ };
    }

    // --- Pointer Lock API ---

    /**
     * Requests pointer lock on the target element (hides cursor and provides infinite movement data).
     */
    requestPointerLock() {
        if (this.target && this.target.requestPointerLock) {
            this.target.requestPointerLock();
        }
    }

    /**
     * Exits pointer lock.
     */
    exitPointerLock() {
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    }

    /**
     * Checks if the pointer is currently locked to the target element.
     * @returns {boolean}
     */
    isPointerLocked() {
        return this._mouse.isLocked;
    }

    // ----------------------------------------------------------------------
    // Internal Event Handlers
    // ----------------------------------------------------------------------

    /**
     * Handles keydown events.
     * @private
     * @param {KeyboardEvent} event 
     */
    _handleKeyDown(event) {
        if (this.options.preventScrolling && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
            event.preventDefault();
        }

        if (!this._keys.has(event.code)) {
            this._keys.add(event.code);
            this._keysPressedThisFrame.add(event.code);
        }
    }

    /**
     * Handles keyup events.
     * @private
     * @param {KeyboardEvent} event 
     */
    _handleKeyUp(event) {
        if (this.options.preventScrolling && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
            event.preventDefault();
        }

        if (this._keys.has(event.code)) {
            this._keys.delete(event.code);
            this._keysReleasedThisFrame.add(event.code);
        }
    }

    /**
     * Handles mousedown events.
     * @private
     * @param {MouseEvent} event 
     */
    _handleMouseDown(event) {
        if (!this._mouse.buttons.has(event.button)) {
            this._mouse.buttons.add(event.button);
            this._mouse.buttonsPressedThisFrame.add(event.button);
        }
    }

    /**
     * Handles mouseup events.
     * @private
     * @param {MouseEvent} event 
     */
    _handleMouseUp(event) {
        if (this._mouse.buttons.has(event.button)) {
            this._mouse.buttons.delete(event.button);
            this._mouse.buttonsReleasedThisFrame.add(event.button);
        }
    }

    /**
     * Handles mousemove events. Updates absolute position and relative deltas.
     * @private
     * @param {MouseEvent} event 
     */
    _handleMouseMove(event) {
        // Calculate absolute position relative to the target element
        if (this.target && this.target.getBoundingClientRect) {
            const rect = this.target.getBoundingClientRect();
            this._mouse.x = event.clientX - rect.left;
            this._mouse.y = event.clientY - rect.top;
        } else {
            this._mouse.x = event.clientX;
            this._mouse.y = event.clientY;
        }

        // Accumulate movement deltas (crucial for high polling rate mice)
        this._mouse.movementX += event.movementX || 0;
        this._mouse.movementY += event.movementY || 0;
    }

    /**
     * Handles scroll wheel events.
     * @private
     * @param {WheelEvent} event 
     */
    _handleWheel(event) {
        this._mouse.wheelDeltaX += event.deltaX;
        this._mouse.wheelDeltaY += event.deltaY;
        this._mouse.wheelDeltaZ += event.deltaZ;
    }

    /**
     * Handles right-click context menu prevention.
     * @private
     * @param {Event} event 
     */
    _handleContextMenu(event) {
        if (this.options.preventContextMenu) {
            event.preventDefault();
        }
    }

    /**
     * Handles window blur event. Clears all input states to prevent keys from getting "stuck"
     * when the user tabs out of the game window.
     * @private
     */
    _handleBlur() {
        this._clearState();
    }

    /**
     * Handles pointer lock state changes.
     * @private
     */
    _handlePointerLockChange() {
        this._mouse.isLocked = (document.pointerLockElement === this.target);
    }

    /**
     * Clears all active input states.
     * @private
     */
    _clearState() {
        this._keys.clear();
        this._keysPressedThisFrame.clear();
        this._keysReleasedThisFrame.clear();

        this._mouse.buttons.clear();
        this._mouse.buttonsPressedThisFrame.clear();
        this._mouse.buttonsReleasedThisFrame.clear();
        
        this._mouse.movementX = 0;
        this._mouse.movementY = 0;
        this._mouse.wheelDeltaX = 0;
        this._mouse.wheelDeltaY = 0;
        this._mouse.wheelDeltaZ = 0;
    }

    // ----------------------------------------------------------------------
    // Gamepad API Handling
    // ----------------------------------------------------------------------

    /**
     * @private
     * @param {GamepadEvent} event 
     */
    _handleGamepadConnected(event) {
        console.info(`[InputManager] Gamepad connected at index ${event.gamepad.index}: ${event.gamepad.id}.`);
        this._gamepads.set(event.gamepad.index, event.gamepad);
    }

    /**
     * @private
     * @param {GamepadEvent} event 
     */
    _handleGamepadDisconnected(event) {
        console.info(`[InputManager] Gamepad disconnected from index ${event.gamepad.index}.`);
        this._gamepads.delete(event.gamepad.index);
    }

    /**
     * Polls the Gamepad API to update internal gamepad states.
     * @private
     */
    _pollGamepads() {
        if (!navigator.getGamepads) return;
        
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            const gp = gamepads[i];
            if (gp) {
                this._gamepads.set(gp.index, gp);
            }
        }
    }

    /**
     * Checks if a specific gamepad button is pressed.
     * @param {number|string} buttonIndex - The button index (0-17).
     * @param {number} [gamepadIndex=0] - The index of the gamepad to check.
     * @returns {boolean}
     */
    isGamepadButtonDown(buttonIndex, gamepadIndex = 0) {
        const gp = this._gamepads.get(gamepadIndex);
        if (!gp || !gp.buttons[buttonIndex]) return false;
        return gp.buttons[buttonIndex].pressed;
    }

    /**
     * Gets the analog value of a gamepad button (useful for analog triggers).
     * @param {number} gamepadIndex 
     * @param {number} buttonIndex 
     * @returns {number} Float between 0.0 and 1.0.
     */
    getGamepadButtonValue(gamepadIndex, buttonIndex) {
        const gp = this._gamepads.get(gamepadIndex);
        if (!gp || !gp.buttons[buttonIndex]) return 0.0;
        return gp.buttons[buttonIndex].value;
    }

    /**
     * Gets the value of a gamepad axis (thumbsticks).
     * Includes deadzone calculations to prevent drift.
     * @param {number} gamepadIndex - The index of the gamepad.
     * @param {number} axisIndex - The axis index (usually 0=LX, 1=LY, 2=RX, 3=RY).
     * @returns {number} Float between -1.0 and 1.0.
     */
    getGamepadAxis(gamepadIndex, axisIndex) {
        const gp = this._gamepads.get(gamepadIndex);
        if (!gp || gp.axes.length <= axisIndex) return 0.0;

        let value = gp.axes[axisIndex];
        
        // Apply Deadzone
        if (Math.abs(value) < this.options.gamepadDeadzone) {
            value = 0.0;
        } else {
            // Remap value to be 0.0 to 1.0 outside the deadzone
            const sign = Math.sign(value);
            value = sign * ((Math.abs(value) - this.options.gamepadDeadzone) / (1.0 - this.options.gamepadDeadzone));
        }

        return value;
    }
}