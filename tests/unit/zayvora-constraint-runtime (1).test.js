const fs = require('fs');
const os = require('os');
const path = require('path');

const { ExperimentRegistry } = require('../../experimental/zayvora/phase1/experiment-registry');
const { ReplayRecorder, verifyReplay } = require('../../experimental/zayvora/phase1/replay-recorder');
const { captureScreenshot } = require('../../experimental/zayvora/phase1/artifact-capture');

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

console.log('\n── ZayvoraConstraintRuntime ──');

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'zayvora-phase1-'));
const registry = new ExperimentRegistry(tempRoot);

const experiment = registry.create({
  name: 'Scanline Memory Ghost',
  category: 'visual',
  constraint: 'Only odd scanlines update',
  description: 'Frame persistence with alternating line mutation',
  tags: ['scanline', 'memory']
});

assert('registry create returns id', /^exp-/.test(experiment.id));
assert('registry list has one experiment', registry.list().length === 1);
assert('registry getById restores experiment', registry.getById(experiment.id).name === 'Scanline Memory Ghost');

const recorderA = new ReplayRecorder({ seed: 1337, fixedDeltaTime: 16 });
const recorderB = new ReplayRecorder({ seed: 1337, fixedDeltaTime: 16 });

for (let frame = 0; frame < 3; frame++) {
  const inputs = { rotate: frame % 2 === 0 };
  const state = { x: frame * 2, y: frame + 1, monochrome: true };
  recorderA.recordFrame({ frame, timestamp: frame * 16, inputs, state });
  recorderB.recordFrame({ frame, timestamp: frame * 16, inputs, state });
}

const verifyOk = verifyReplay(recorderA.export(), recorderB.export());
assert('replay verification passes for identical streams', verifyOk.ok === true);

const recorderC = new ReplayRecorder({ seed: 1337, fixedDeltaTime: 16 });
recorderC.recordFrame({ frame: 0, timestamp: 0, inputs: { rotate: false }, state: { x: 99 } });
const verifyBad = verifyReplay(recorderA.export(), recorderC.export());
assert('replay verification detects divergence', verifyBad.ok === false);

const filePath = captureScreenshot({
  baseDir: tempRoot,
  experimentId: experiment.id,
  frame: 12,
  pngBuffer: Buffer.from('89504e470d0a1a0a', 'hex')
});
assert('screenshot capture writes PNG file', fs.existsSync(filePath));

module.exports = { passed, failed };
