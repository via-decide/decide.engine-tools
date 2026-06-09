const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── ConstraintLab ──');

const root = path.join(__dirname, '../../packages/constraint-lab');
[
  'README.md',
  'src/runtime/constraintRuntime.ts',
  'src/constraints/monochromeConstraint.ts',
  'src/constraints/tileQuantizationConstraint.ts',
  'src/constraints/delayedInputConstraint.ts',
  'src/constraints/frameSkipConstraint.ts',
  'src/experiments/experimentRunner.ts',
  'src/replay/replayBridge.ts',
  'src/comparison/compareView.ts',
  'src/capture/artifactCapture.ts',
  'src/notes/sessionNotes.ts',
  'src/presets/gameboyPreset.ts',
  'src/presets/playdatePreset.ts',
  'src/presets/demoscenePreset.ts',
  'experiments/monochrome-dither/index.ts',
  'experiments/delayed-input/index.ts',
  'experiments/audio-friction/index.ts'
].forEach((file) => assert(`exists: ${file}`, fs.existsSync(path.join(root, file))));

const runtime = fs.readFileSync(path.join(root, 'src/runtime/constraintRuntime.ts'), 'utf8');
assert('runtime supports toggles', runtime.includes('setEnabled'));
assert('runtime applies chain', runtime.includes('reduce('));

const replay = fs.readFileSync(path.join(root, 'src/replay/replayBridge.ts'), 'utf8');
assert('replay bridge integrates replay-engine recorder', replay.includes('InputRecorder'));
assert('replay bridge integrates replay-engine player', replay.includes('ReplayPlayer'));

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
assert('readme forbids scoring patterns', readme.includes('No scoring/ranking/coherence metrics'));

module.exports = { passed, failed };
