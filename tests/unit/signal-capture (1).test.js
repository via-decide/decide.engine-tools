const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── SignalCapture ──');

const root = path.join(__dirname, '../../packages/signal-capture');
[
  'README.md',
  'src/input/inputSampler.ts',
  'src/timing/timingAnalyzer.ts',
  'src/replay/replaySignalBridge.ts',
  'src/fingerprints/generateFingerprint.ts',
  'src/visualization/heatmap.ts',
  'src/visualization/momentumGraph.ts',
  'src/visualization/cadenceGraph.ts',
  'src/comparison/compareSignals.ts',
  'src/export/exportSignalSession.ts',
  'src/archive/archiveIntegration.ts'
].forEach((f) => assert(`exists: ${f}`, fs.existsSync(path.join(root, f))));

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
assert('readme forbids analytics ranking', readme.includes('No engagement analytics or best-score systems'));

const bridge = fs.readFileSync(path.join(root, 'src/replay/replaySignalBridge.ts'), 'utf8');
assert('replay bridge uses input recorder', bridge.includes('InputRecorder'));
assert('replay bridge uses replay player', bridge.includes('ReplayPlayer'));

module.exports = { passed, failed };
