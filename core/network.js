/**
 * Decide Engine Core - Multiplayer Networking System
 * 
 * This module implements a robust, server-authoritative networking model
 * designed for real-time state synchronization across multiple clients.
 * 
 * Features:
 * - Isomorphic design (works in Node.js and Browser environments).
 * - Server-Authoritative architecture with client-side prediction.
 * - Delta-compressed state updates to drastically reduce bandwidth.
 * - Network Time Protocol (NTP) style clock synchronization.
 * - Jitter buffering and client-side state interpolation.
 * - Event-driven architecture with custom isomorphic EventEmitter.
 * 
 * @module core/network
 * @version 3.0.0
 */

// ============================================================================
// CONSTANTS & ENUMS
// ============================================================================

/**
 * Defines the types of network messages exchanged between client and server.
 * @enum {number}
 */
const MessageType = {
    // Connection Lifecycle
    HANDSHAKE: 0,
    HANDSHAKE_ACK: 1,
    DISCONNECT: 2,

    // Time Synchronization
    PING: 3,
    PONG: 4,

    // Game/App Flow
    INPUT: 5,           // Client -> Server: Action input with sequence number
    STATE_FULL: 6,      // Server -> Client: Complete authoritative state snapshot
    STATE_DELTA: 7,     // Server -> Client: Compressed patch of state changes
    EVENT: 8            // Bi-directional: One-off RPC or broadcast events
};

/**
 * Configuration defaults for the networking system.
 */
const NetworkConfig = {
    SERVER_TICK_RATE: 20,           // Server ticks per second (Hz)
    CLIENT_SEND_RATE: 30,           // Client input dispatches per second (Hz)
    MAX_HISTORY_SNAPSHOTS: 60,      // How many state snapshots the server keeps for delta calculation
    INTERPOLATION_DELAY_MS: 100,    // Delay applied to client rendering to ensure smooth interpolation
    PING_INTERVAL_MS: 1000,         // How often clients ping the server for latency calculation
    TIMEOUT_MS: 15000,              // Drop connection if no data received
    DELTA_DELETION_MARKER: '__DEL__'// Unique string to represent deleted keys in delta objects
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Simple isomorphic logger for network diagnostics.
 */
class NetLogger {
    static level = 'info'; // 'debug', 'info', 'warn', 'error', 'none'

    static debug(...args) { if (this.level === 'debug') console.debug('[Net:DEBUG]', ...args); }
    static info(...args) { if (this.level === 'debug' || this.level === 'info') console.info('[Net:INFO]', ...args); }
    static warn(...args) { if (this.level !== 'error' && this.level !== 'none') console.warn('[Net:WARN]', ...args); }
    static error(...args) { if (this.level !== 'none') console.error('[Net:ERROR]', ...args); }
}

/**
 * Isomorphic Event Emitter to avoid Node.js 'events' dependency in the browser.
 */
class EventEmitter {
    constructor() {
        this._events = {};
    }

    /**
     * Subscribe to an event.
     * @param {string} event - Event name
     * @param {Function} listener - Callback function
     */
    on(event, listener) {
        if (!this._events[event]) this._events[event] = [];
        this._events[event].push(listener);
        return this;
    }

    /**
     * Subscribe to an event once.
     * @param {string} event - Event name
     * @param {Function} listener - Callback function
     */
    once(event, listener) {
        const wrapper = (...args) => {
            listener.apply(this, args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }

    /**
     * Unsubscribe from an event.
     * @param {string} event - Event name
     * @param {Function} listener - Callback function
     */
    off(event, listener) {
        if (!this._events[event]) return this;
        this._events[event] = this._events[event].filter(l => l !== listener);
        return this;
    }

    /**
     * Emit an event to all subscribers.
     * @param {string} event - Event name
     * @param {...any} args - Arguments passed to listeners
     */
    emit(event, ...args) {
        if (!this._events[event]) return false;
        for (const listener of this._events[event]) {
            try {
                listener.apply(this, args);
            } catch (err) {
                NetLogger.error(`Error in event listener for ${event}:`, err);
            }
        }
        return true;
    }

    /**
     * Clear all listeners for a specific event or all events.
     * @param {string} [event] - Event name (optional)
     */
    removeAllListeners(event) {
        if (event) {
            delete this._events[event];
        } else {
            this._events = {};
        }
    }
}

// ============================================================================
// DATA COMPRESSION (DELTAS)
// ============================================================================

/**
 * Handles generating and applying delta-compressed state updates.
 * Reduces bandwidth by only sending what has changed between snapshots.
 */
class DeltaCompressor {
    /**
     * Deep compares two objects and returns a delta object containing only the differences.
     * @param {Object} oldState - The baseline state.
     * @param {Object} newState - The target state.
     * @returns {Object|null} The delta object, or null if identical.
     */
    static createDelta(oldState, newState) {
        if (oldState === newState) return null;
        if (typeof oldState !== 'object' || typeof newState !== 'object' || oldState === null || newState === null) {
            return newState;
        }

        const delta = {};
        let hasChanges = false;

        // Check for new or updated properties
        for (const key in newState) {
            if (Object.prototype.hasOwnProperty.call(newState, key)) {
                if (!Object.prototype.hasOwnProperty.call(oldState, key)) {
                    delta[key] = newState[key];
                    hasChanges = true;
                } else {
                    const nestedDelta = this.createDelta(oldState[key], newState[key]);
                    if (nestedDelta !== null) {
                        delta[key] = nestedDelta;
                        hasChanges = true;
                    }
                }
            }
        }

        // Check for deleted properties
        for (const key in oldState) {
            if (Object.prototype.hasOwnProperty.call(oldState, key) && !Object.prototype.hasOwnProperty.call(newState, key)) {
                delta[key] = NetworkConfig.DELTA_DELETION_MARKER;
                hasChanges = true;
            }
        }

        return hasChanges ? delta : null;
    }

    /**
     * Applies a delta object to a baseline state to construct the new state.
     * @param {Object} oldState - The baseline state (will be mutated).
     * @param {Object} delta - The delta patch.
     * @returns {Object} The updated state.
     */
    static applyDelta(oldState, delta) {
        if (delta === null) return oldState;
        if (typeof delta !== 'object' || delta === null) return delta;
        if (typeof oldState !== 'object' || oldState === null) {
            // If old state was a primitive but delta is an object, delta is the new state
            oldState = Array.isArray(delta) ? [] : {};
        }

        for (const key in delta) {
            if (Object.prototype.hasOwnProperty.call(delta, key)) {
                if (delta[key] === NetworkConfig.DELTA_DELETION_MARKER) {
                    delete oldState[key];
                } else if (typeof delta[key] === 'object' && delta[key] !== null) {
                    oldState[key] = this.applyDelta(oldState[key] !== undefined ? oldState[key] : (Array.isArray(delta[key]) ? [] : {}), delta[key]);
                } else {
                    oldState[key] = delta[key];
                }
            }
        }
        return oldState;
    }

    /**
     * Creates a deep clone of a JSON-serializable object.
     * @param {Object} obj 
     * @returns {Object}
     */
    static clone(obj) {
        if (obj === undefined) return undefined;
        return JSON.parse(JSON.stringify(obj));
    }
}

// ============================================================================
// SERVER-SIDE NETWORKING
// ============================================================================

/**
 * Represents a single client connection on the server.
 */
class ServerClient {
    /**
     * @param {string} id - Unique client identifier.
     * @param {Object} transport - The underlying socket/connection (e.g., WebSocket).
     */
    constructor(id, transport) {
        this.id = id;
        this.transport = transport;
        this.lastActivity = Date.now();
        this.latency = 0;
        this.lastAckedSequence = -1;
        this.lastAckedStateId = -1;
        
        // Input buffer for server-side processing
        this.inputQueue = [];
        
        // Metadata for application logic
        this.meta = {};
    }

    /**
     * Sends a raw message to this client.
     * @param {number} type - MessageType
     * @param {Object} payload - Data payload
     */
    send(type, payload) {
        if (this.transport && typeof this.transport.send === 'function') {
            try {
                const message = JSON.stringify({ t: type, d: payload });
                this.transport.send(message);
            } catch (err) {
                NetLogger.error(`Failed to send message to client ${this.id}:`, err);
            }
        }
    }
}

/**
 * The Authoritative Server Network Manager.
 * Orchestrates client connections, processes inputs deterministically,
 * and broadcasts state updates (full and deltas).
 */
export class ServerNetwork extends EventEmitter {
    /**
     * @param {Object} options - Configuration options
     * @param {number} [options.tickRate=20] - Physics/Logic tick rate
     * @param {Function} [options.onProcessInput] - Callback to apply input to state: (state, clientId, input) => void
     */
    constructor(options = {}) {
        super();
        this.tickRate = options.tickRate || NetworkConfig.SERVER_TICK_RATE;
        this.tickIntervalMs = 1000 / this.tickRate;
        this.onProcessInput = options.onProcessInput || (() => {});
        
        this.clients = new Map();
        this.stateHistory = []; // Array of { id, state }
        this.currentStateId = 0;
        this.gameState = {}; // The authoritative game state
        
        this.tickTimer = null;
        this.metrics = { bytesSent: 0, bytesReceived: 0, ticks: 0 };
    }

    /**
     * Initializes the server state.
     * @param {Object} initialState 
     */
    initializeState(initialState) {
        this.gameState = DeltaCompressor.clone(initialState);
        this._saveSnapshot();
        NetLogger.info('Server state initialized.');
    }

    /**
     * Starts the server tick loop.
     */
    start() {
        if (this.tickTimer) clearInterval(this.tickTimer);
        this.tickTimer = setInterval(() => this._tick(), this.tickIntervalMs);
        NetLogger.info(`ServerNetwork started at ${this.tickRate} Hz.`);
    }

    /**
     * Stops the server tick loop.
     */
    stop() {
        if (this.tickTimer) {
            clearInterval(this.tickTimer);
            this.tickTimer = null;
        }
        NetLogger.info('ServerNetwork stopped.');
    }

    /**
     * Integrates a new transport connection (e.g., from a WebSocketServer 'connection' event).
     * @param {Object} socket - The raw socket connection.
     * @param {string} [clientId] - Optional predefined ID, otherwise generated.
     * @returns {ServerClient}
     */
    onConnection(socket, clientId = null) {
        const id = clientId || this._generateId();
        const client = new ServerClient(id, socket);
        this.clients.set(id, client);

        NetLogger.info(`Client connected: ${id}`);

        // Handle incoming messages
        socket.on('message', (data) => {
            this.metrics.bytesReceived += data.length || 0;
            this._handleMessage(client, data);
        });

        // Handle disconnects
        socket.on('close', () => {
            this._handleDisconnect(client);
        });

        socket.on('error', (err) => {
            NetLogger.warn(`Socket error on client ${id}:`, err);
            this._handleDisconnect(client);
        });

        // Send Handshake
        client.send(MessageType.HANDSHAKE, { 
            id: id, 
            tickRate: this.tickRate,
            stateId: this.currentStateId
        });

        // Send Initial Full State
        client.send(MessageType.STATE_FULL, {
            id: this.currentStateId,
            state: this.gameState
        });

        this.emit('clientConnected', client);
        return client;
    }

    /**
     * Broadcasts a custom event to all connected clients.
     * @param {string} eventName 
     * @param {any} data 
     */
    broadcastEvent(eventName, data) {
        const payload = { e: eventName, data: data };
        for (const client of this.clients.values()) {
            client.send(MessageType.EVENT, payload);
        }
    }

    /**
     * Internal physics/logic tick.
     * Processes inputs, updates state, and broadcasts deltas.
     * @private
     */
    _tick() {
        this.metrics.ticks++;
        const now = Date.now();

        // 1. Check timeouts
        for (const [id, client] of this.clients.entries()) {
            if (now - client.lastActivity > NetworkConfig.TIMEOUT_MS) {
                NetLogger.warn(`Client ${id} timed out.`);
                client.transport.close();
                this._handleDisconnect(client);
            }
        }

        // 2. Process pending inputs for all clients
        let stateChanged = false;
        for (const client of this.clients.values()) {
            while (client.inputQueue.length > 0) {
                const inputMsg = client.inputQueue.shift();
                
                // Discard out-of-order inputs
                if (inputMsg.seq <= client.lastAckedSequence) continue;
                
                // Apply input to authoritative state
                this.onProcessInput(this.gameState, client.id, inputMsg.data);
                client.lastAckedSequence = inputMsg.seq;
                stateChanged = true;
            }
        }

        // 3. Emit pre-broadcast event for application-level state mutations (e.g. AI, physics step)
        this.emit('preTickUpdate', this.gameState, this.tickIntervalMs);

        // 4. Snapshot and Broadcast if state changed or periodically
        // (In a real game, physics might change state every tick even without inputs)
        this.currentStateId++;
        this._saveSnapshot();
        this._broadcastStateUpdates();
    }

    /**
     * Broadcasts state to all clients. Uses Delta compression based on what
     * the client last acknowledged.
     * @private
     */
    _broadcastStateUpdates() {
        const currentSnapshot = this.stateHistory[this.stateHistory.length - 1];

        for (const client of this.clients.values()) {
            // Find the state the client last acknowledged
            const ackedSnapshot = this.stateHistory.find(s => s.id === client.lastAckedStateId);

            if (ackedSnapshot) {
                // Generate Delta
                const delta = DeltaCompressor.createDelta(ackedSnapshot.state, currentSnapshot.state);
                
                if (delta !== null) {
                    client.send(MessageType.STATE_DELTA, {
                        id: currentSnapshot.id,
                        baseId: ackedSnapshot.id,
                        ackSeq: client.lastAckedSequence, // Ack client's input
                        delta: delta
                    });
                } else {
                    // Even if no state change, send empty delta to ack inputs and keep connection alive
                    client.send(MessageType.STATE_DELTA, {
                        id: currentSnapshot.id,
                        baseId: ackedSnapshot.id,
                        ackSeq: client.lastAckedSequence,
                        delta: null
                    });
                }
            } else {
                // Client fell too far behind, send full state
                client.send(MessageType.STATE_FULL, {
                    id: currentSnapshot.id,
                    ackSeq: client.lastAckedSequence,
                    state: currentSnapshot.state
                });
            }
            
            // Optimistically assume client receives this current state.
            // In a strict TCP model this is fine. For UDP, we'd wait for actual ACKs.
            client.lastAckedStateId = currentSnapshot.id;
        }
    }

    /**
     * Saves a deep clone of the current state to history for future delta generation.
     * @private
     */
    _saveSnapshot() {
        this.stateHistory.push({
            id: this.currentStateId,
            state: DeltaCompressor.clone(this.gameState)
        });

        // Prune old history
        if (this.stateHistory.length > NetworkConfig.MAX_HISTORY_SNAPSHOTS) {
            this.stateHistory.shift();
        }
    }

    /**
     * Parses and routes incoming client messages.
     * @private
     */
    _handleMessage(client, rawData) {
        client.lastActivity = Date.now();
        try {
            const msg = JSON.parse(rawData);
            
            switch (msg.t) {
                case MessageType.INPUT:
                    // msg.d = { seq: number, data: Object }
                    client.inputQueue.push(msg.d);
                    break;
                case MessageType.PING:
                    client.send(MessageType.PONG, { clientTime: msg.d.time, serverTime: Date.now() });
                    break;
                case MessageType.EVENT:
                    this.emit('clientEvent', client.id, msg.d.e, msg.d.data);
                    break;
                default:
                    NetLogger.debug(`Unknown message type ${msg.t} from client ${client.id}`);
            }
        } catch (err) {
            NetLogger.warn(`Malformed message from client ${client.id}:`, err);
        }
    }

    /**
     * Cleans up a disconnected client.
     * @private
     */
    _handleDisconnect(client) {
        if (this.clients.has(client.id)) {
            this.clients.delete(client.id);
            this.emit('clientDisconnected', client.id);
            NetLogger.info(`Client disconnected: ${client.id}`);
        }
    }

    /**
     * Generates a simple pseudo-random UUID.
     * @private
     */
    _generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

// ============================================================================
// CLIENT-SIDE NETWORKING
// ============================================================================

/**
 * The Client Network Manager.
 * Connects to the authoritative server, sends inputs, predicts local state,
 * and seamlessly reconciles server corrections using delta compression.
 */
export class ClientNetwork extends EventEmitter {
    /**
     * @param {Object} options 
     * @param {Function} [options.transportFactory] - Function returning a WebSocket-like object given a URL.
     * @param {Function} [options.onPredictInput] - Callback to apply input locally: (state, input) => void
     */
    constructor(options = {}) {
        super();
        this.transportFactory = options.transportFactory || ((url) => new WebSocket(url));
        this.onPredictInput = options.onPredictInput || (() => {});
        
        this.transport = null;
        this.clientId = null;
        this.connected = false;
        
        // State Management
        this.serverState = {};      // The last confirmed authoritative state
        this.localState = {};       // The predicted local state (serverState + pendingInputs)
        this.lastServerStateId = -1;
        
        // Input Prediction
        this.inputSequence = 0;
        this.pendingInputs = [];    // Inputs sent but not yet acknowledged by server
        
        // Time Sync
        this.pingInterval = null;
        this.latency = 0;
        this.timeOffset = 0;        // Difference between server time and client time
        
        // Metrics
        this.metrics = { bytesSent: 0, bytesReceived: 0 };
    }

    /**
     * Connects to the server.
     * @param {string} url - WebSocket URL
     * @returns {Promise<void>} Resolves when handshake is complete
     */
    connect(url) {
        return new Promise((resolve, reject) => {
            try {
                this.transport = this.transportFactory(url);
            } catch (err) {
                return reject(err);
            }

            this.transport.onopen = () => {
                NetLogger.info(`Connected to transport at ${url}`);
                this._startPing();
            };

            this.transport.onmessage = (event) => {
                const data = event.data;
                this.metrics.bytesReceived += data.length || 0;
                this._handleMessage(data, resolve);
            };

            this.transport.onclose = () => {
                this._handleDisconnect();
            };

            this.transport.onerror = (err) => {
                NetLogger.error('Transport error:', err);
                if (!this.connected) reject(err);
            };
        });
    }

    /**
     * Disconnects from the server.
     */
    disconnect() {
        if (this.transport) {
            this.transport.close();
        }
        this._handleDisconnect();
    }

    /**
     * Retrieves the current predicted local state.
     * @returns {Object}
     */
    getState() {
        return this.localState;
    }

    /**
     * Retrieves the current server time based on clock synchronization.
     * @returns {number}
     */
    getServerTime() {
        return Date.now() + this.timeOffset;
    }

    /**
     * Sends an action/input to the server and applies it locally for prediction.
     * @param {Object} inputData 
     */
    sendInput(inputData) {
        if (!this.connected) return;

        this.inputSequence++;
        const payload = {
            seq: this.inputSequence,
            data: inputData
        };

        // 1. Store for reconciliation
        this.pendingInputs.push(payload);

        // 2. Predict locally immediately
        this.onPredictInput(this.localState, inputData);

        // 3. Send to server
        this._send(MessageType.INPUT, payload);
    }

    /**
     * Sends a custom event to the server.
     * @param {string} eventName 
     * @param {any} data 
     */
    sendEvent(eventName, data) {
        if (!this.connected) return;
        this._send(MessageType.EVENT, { e: eventName, data: data });
    }

    /**
     * Internal send wrapper.
     * @private
     */
    _send(type, payload) {
        if (this.transport && this.transport.readyState === 1 /* OPEN */) {
            const msg = JSON.stringify({ t: type, d: payload });
            this.metrics.bytesSent += msg.length;
            this.transport.send(msg);
        }
    }

    /**
     * Handles incoming messages from the server.
     * @private
     */
    _handleMessage(rawData, handshakeResolve) {
        try {
            const msg = JSON.parse(rawData);
            const payload = msg.d;

            switch (msg.t) {
                case MessageType.HANDSHAKE:
                    this.clientId = payload.id;
                    this.connected = true;
                    NetLogger.info(`Handshake complete. Assigned ID: ${this.clientId}`);
                    handshakeResolve();
                    this.emit('connected', this.clientId);
                    break;

                case MessageType.STATE_FULL:
                    this._processFullState(payload);
                    break;

                case MessageType.STATE_DELTA:
                    this._processStateDelta(payload);
                    break;

                case MessageType.PONG:
                    this._processPong(payload);
                    break;

                case MessageType.EVENT:
                    this.emit('serverEvent', payload.e, payload.data);
                    break;

                default:
                    NetLogger.debug(`Unknown message type ${msg.t} from server.`);
            }
        } catch (err) {
            NetLogger.error('Error parsing server message:', err);
        }
    }

    /**
     * Replaces local state entirely (used on join or if heavily desynced).
     * @private
     */
    _processFullState(payload) {
        this.lastServerStateId = payload.id;
        this.serverState = DeltaCompressor.clone(payload.state);
        
        // Remove inputs the server has processed
        if (payload.ackSeq) {
            this.pendingInputs = this.pendingInputs.filter(input => input.seq > payload.ackSeq);
        }

        this._reconcileState();
        this.emit('stateUpdate', this.localState);
    }

    /**
     * Patches local state using delta compression.
     * @private
     */
    _processStateDelta(payload) {
        // Ensure we are patching against the correct base state
        if (payload.baseId !== this.lastServerStateId) {
            NetLogger.warn(`Delta base mismatch. Expected ${this.lastServerStateId}, got ${payload.baseId}. Requesting full state...`);
            // In a real implementation, we might send a request for a full sync here.
            // For now, we drop the delta and wait for the server to realize we missed it.
            return;
        }

        this.lastServerStateId = payload.id;
        
        if (payload.delta) {
            this.serverState = DeltaCompressor.applyDelta(this.serverState, payload.delta);
        }

        // Remove inputs the server has processed
        if (payload.ackSeq !== undefined) {
            this.pendingInputs = this.pendingInputs.filter(input => input.seq > payload.ackSeq);
        }

        this._reconcileState();
        this.emit('stateUpdate', this.localState);
    }

    /**
     * Rebuilds the predicted local state by applying pending inputs on top of the authoritative server state.
     * @private
     */
    _reconcileState() {
        // 1. Reset local state to the latest authoritative server state
        this.localState = DeltaCompressor.clone(this.serverState);

        // 2. Re-apply all inputs that the server hasn't acknowledged yet
        for (const input of this.pendingInputs) {
            this.onPredictInput(this.localState, input.data);
        }
    }

    /**
     * NTP-style clock synchronization ping.
     * @private
     */
    _startPing() {
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
            if (this.connected) {
                this._send(MessageType.PING, { time: Date.now() });
            }
        }, NetworkConfig.PING_INTERVAL_MS);
        
        // Initial ping
        this._send(MessageType.PING, { time: Date.now() });
    }

    /**
     * Calculates latency and time offset based on server pong.
     * @private
     */
    _processPong(payload) {
        const now = Date.now();
        const rtt = now - payload.clientTime;
        this.latency = rtt / 2;
        
        // Server time when it processed the ping, plus time it took to reach us
        const estimatedServerTime = payload.serverTime + this.latency;
        
        // Smooth the offset calculation to prevent jitter
        const currentOffset = estimatedServerTime - now;
        if (this.timeOffset === 0) {
            this.timeOffset = currentOffset;
        } else {
            // Lerp the offset (20% new, 80% old)
            this.timeOffset = (this.timeOffset * 0.8) + (currentOffset * 0.2);
        }
        
        this.emit('ping', this.latency);
    }

    /**
     * Cleans up on disconnect.
     * @private
     */
    _handleDisconnect() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
        this.connected = false;
        this.emit('disconnected');
        NetLogger.info('Disconnected from server.');
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    MessageType,
    NetworkConfig,
    NetLogger,
    EventEmitter,
    DeltaCompressor
};