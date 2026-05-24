const {
  monochrome,
  bayerDither,
  tileGrid,
  scanlineMask
} = require('../../experimental/zayvora/phase1/visual-constraints');
const {
  timingOffset,
  rotationalInputDelta,
  tileMovementStep,
  rhythmGate
} = require('../../experimental/zayvora/phase1/interaction-constraints');
const {
  frameWindowHashes,
  compareReplayWindows
} = require('../../experimental/zayvora/phase1/replay-validator');
const {
  sanitizeText,
  buildReflectionPrompt
} = require('../../experimental/zayvora/phase1/reflection-bridge');

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

console.log('\n── ZayvoraConstraintsPhase2to4 ──');

assert('monochrome thresholding works', monochrome(200) === 255 && monochrome(10) === 0);
assert('bayer dither is deterministic for same cell', bayerDither(120, 1, 1) === bayerDither(120, 1, 1));
assert('tile grid generates expected tile count', tileGrid(16, 16, 8).tiles.length === 4);
assert('scanline mask reduces odd lines', scanlineMask(1) < 1 && scanlineMask(2) === 1);

assert('timing offset uses jitter cycle', timingOffset(100, [0, 10], 3) === 110);
assert('rotational delta wraps', rotationalInputDelta(350, 10) === 20);
const step = tileMovementStep({ x: 1, y: 1 }, 'right', 2);
assert('tile movement applies speed', step.x === 3 && step.y === 1);
assert('rhythm gate follows pattern', rhythmGate(1, [1, 0]) === false && rhythmGate(2, [1, 0]) === true);

const replayA = { frames: [{ frame: 0, frameHash: 'a' }, { frame: 1, frameHash: 'b' }, { frame: 2, frameHash: 'c' }] };
const replayB = { frames: [{ frame: 0, frameHash: 'a' }, { frame: 1, frameHash: 'b' }, { frame: 2, frameHash: 'c' }] };
const replayC = { frames: [{ frame: 0, frameHash: 'a' }, { frame: 1, frameHash: 'x' }, { frame: 2, frameHash: 'c' }] };
assert('frame window hash is generated', frameWindowHashes(replayA, 2).length === 2);
assert('window compare passes for identical', compareReplayWindows(replayA, replayB, 2).ok === true);
assert('window compare fails for divergence', compareReplayWindows(replayA, replayC, 2).ok === false);

assert('sanitize removes forbidden words', !sanitizeText('coherence % ranking score').includes('score'));
const prompt = buildReflectionPrompt({
  experiment: { id: 'exp-1', name: 'Odd Pulse', category: 'interaction', constraint: 'late input', tags: ['odd'] },
  notes: 'avoid ranking this visual',
  observations: ['It feels alive but not clean.']
});
assert('reflection prompt includes mode', prompt.mode === 'reflection-only');
assert('reflection prompt has human critique prompts', Array.isArray(prompt.prompts) && prompt.prompts.length === 3);

module.exports = { passed, failed };
