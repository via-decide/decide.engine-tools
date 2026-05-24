const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── ReplayEngineArchitecture ──');

const root = path.join(__dirname, '../../packages/replay-engine');
const requiredFiles = [
  'README.md',
  'src/runtime/fixedLoop.ts',
  'src/recorder/inputRecorder.ts',
  'src/playback/replayPlayer.ts',
  'src/hashing/stateHash.ts',
  'src/snapshots/snapshotStore.ts',
  'src/stepping/frameStepper.ts',
  'src/exporters/gifExporter.ts'
];

for (const rel of requiredFiles) {
  assert(`exists: ${rel}`, fs.existsSync(path.join(root, rel)));
}

const fixedLoop = fs.readFileSync(path.join(root, 'src/runtime/fixedLoop.ts'), 'utf8');
assert('fixed loop uses accumulator', fixedLoop.includes('accumulator'));
assert('fixed loop exposes pause', fixedLoop.includes('pause()'));

const hashing = fs.readFileSync(path.join(root, 'src/hashing/stateHash.ts'), 'utf8');
assert('hashing uses sorted keys', hashing.includes('.sort()'));
assert('hashing uses sha256', hashing.includes("'sha256'"));

module.exports = { passed, failed };
