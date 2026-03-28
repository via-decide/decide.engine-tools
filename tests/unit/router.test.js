/**
 * Unit tests for router.js
 * Validates the static path map covers all registered tools
 * and that paths point to real files
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const routerCode = fs.readFileSync(path.join(root, 'router.js'), 'utf8');

// Extract toolPathStaticMap from router (it's defined as a const inside an IIFE)
const mapMatch = routerCode.match(/const toolPathStaticMap\s*=\s*(\{[\s\S]*?\});/);
if (!mapMatch) throw new Error('Could not find toolPathStaticMap in router.js');

const toolPathStaticMap = eval('(' + mapMatch[1] + ')');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── Router ──');

console.log('\ntoolPathStaticMap structure');
assert('map is an object', typeof toolPathStaticMap === 'object');
const toolCount = Object.keys(toolPathStaticMap).length;
assert(`has at least 30 tools registered (found ${toolCount})`, toolCount >= 30);

console.log('\nAll registered paths exist on disk');
const missing = [];
for (const [id, relPath] of Object.entries(toolPathStaticMap)) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    missing.push(`${id} → ${relPath}`);
    console.error(`  ✗ MISSING: ${id} → ${relPath}`);
    failed++;
  } else {
    passed++;
  }
}
if (missing.length === 0) {
  console.log(`  ✓ All ${toolCount} paths resolve to real files`);
}

console.log('\nKey tools are registered');
const keyTools = [
  'json-formatter',
  'pomodoro',
  'hex-wars',
  'prompt-alchemy',
  'agent-builder',
  'color-palette'
];
for (const tool of keyTools) {
  assert(`"${tool}" is in map`, !!toolPathStaticMap[tool]);
}

module.exports = { passed, failed, missing };
