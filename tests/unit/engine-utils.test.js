/**
 * Unit tests for shared/engine-utils.js
 * Tests the REAL functions used by 40+ engine tools
 */

// Simulate the window global that engine-utils.js expects
const global_mock = {};
const fs = require('fs');
const path = require('path');

// Load the actual shared utility (it self-registers on global)
const utilCode = fs.readFileSync(
  path.join(__dirname, '../../shared/engine-utils.js'), 'utf8'
);
// Replace window reference with our mock so the IIFE receives it
const sandboxed = utilCode.replace(/\}\)\(window\);?\s*$/, '})(global_mock);');
eval(sandboxed);

const { tryParse, clamp, weightedScore } = global_mock.EngineUtils;

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed++;
  }
}

console.log('\n── EngineUtils ──');

// tryParse
console.log('\ntryParse()');
assert('null input returns {}', JSON.stringify(tryParse(null)) === '{}');
assert('valid JSON parses correctly', tryParse('{"a":1}').a === 1);
assert('invalid JSON returns {raw: value}', tryParse('bad').raw === 'bad');
assert('empty string returns {}', JSON.stringify(tryParse('')) === '{}');

// clamp
console.log('\nclamp()');
assert('clamps below min', clamp(-5, 0, 100) === 0);
assert('clamps above max', clamp(150, 0, 100) === 100);
assert('passes through in-range value', clamp(50, 0, 100) === 50);
assert('clamps at min boundary', clamp(0, 0, 100) === 0);
assert('clamps at max boundary', clamp(100, 0, 100) === 100);

// weightedScore
console.log('\nweightedScore()');
assert(
  'calculates weighted sum correctly',
  weightedScore({ a: { value: 10, weight: 2 }, b: { value: 5, weight: 1 } }) === 25
);
assert(
  'handles single item',
  weightedScore({ x: { value: 8, weight: 3 } }) === 24
);
assert(
  'handles zero weight',
  weightedScore({ a: { value: 100, weight: 0 } }) === 0
);

module.exports = { passed, failed };
