/**
 * Unit tests for shared/tool-bridge.js
 * Tests cross-tool state passing used by HexWars, snake-game, engine tools
 */

const fs = require('fs');
const path = require('path');

// Mock browser globals
const storage = {};
const global_mock = {
  localStorage: {
    getItem: k => storage[k] || null,
    setItem: (k, v) => { storage[k] = v; },
    removeItem: k => { delete storage[k]; }
  },
  dispatchEvent: () => {},
  CustomEvent: function(type, opts) { this.type = type; this.detail = opts ? opts.detail : null; }
};

// Provide localStorage as a global for the eval'd code (it references it directly)
global.localStorage = global_mock.localStorage;
// Provide CustomEvent globally as well
global.CustomEvent = global_mock.CustomEvent;

const code = fs.readFileSync(
  path.join(__dirname, '../../shared/tool-bridge.js'), 'utf8'
);
// Replace the (window) IIFE arg with our mock
const sandboxed = code.replace(/\}\)\(window\);?\s*$/, '})(global_mock);');
eval(sandboxed);

const { sendContext, receiveContext } = global_mock.ToolBridge;

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── ToolBridge ──');

console.log('\nsendContext() / receiveContext()');
sendContext('snake-game', 'hex-wars', { score: 42 });
const received = receiveContext('hex-wars');
assert('envelope is received', received !== null);
assert('data payload is correct', received.data.score === 42);
assert('fromToolId is set', received.fromToolId === 'snake-game');
assert('toToolId is set', received.toToolId === 'hex-wars');
assert('timestamp is present', typeof received.timestamp === 'string');

console.log('\nreceiveContext() cleanup');
const second = receiveContext('hex-wars');
assert('message is consumed after receive', second === null);

console.log('\nreceiveContext() with no message');
const empty = receiveContext('tool-that-got-nothing');
assert('returns null when no message', empty === null);

module.exports = { passed, failed };
