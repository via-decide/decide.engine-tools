const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── ConstraintStudio ──');

const root = path.join(__dirname, '../../packages/constraint-studio');
[
  'README.md',
  'src/runtime/constraintRuntime.ts',
  'src/presets/gameboyPreset.ts',
  'src/presets/playdatePreset.ts',
  'src/presets/arcade1985Preset.ts',
  'src/presets/terminalPreset.ts',
  'src/presets/demoscenePreset.ts',
  'src/mutations/generateMutation.ts',
  'src/variant-engine/createVariantTree.ts',
  'src/playback/variantPlayer.ts',
  'src/snapshots/createSnapshot.ts',
  'src/archive/archiveBridge.ts',
  'src/layering/layerComposer.ts',
  'src/export/exportVariantBundle.ts',
  'experiments/base-runner/index.ts'
].forEach((f) => assert(`exists: ${f}`, fs.existsSync(path.join(root, f))));

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
assert('readme forbids best scoring', readme.includes('No best-variant scoring'));

const playback = fs.readFileSync(path.join(root, 'src/playback/variantPlayer.ts'), 'utf8');
assert('variant player integrates replay-engine', playback.includes('ReplayPlayer'));
assert('variant player integrates signal-capture compare', playback.includes('compareSignals'));

module.exports = { passed, failed };
