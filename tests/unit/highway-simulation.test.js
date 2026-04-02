/**
 * Unit tests for Highway V2I DECIDE runtime wiring.
 * Static checks keep browser-only script dependency-free.
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
  path.join(__dirname, '../../Highway-V2I dashboard simulation.html'),
  'utf8'
);

const script = fs.readFileSync(
  path.join(__dirname, '../../js/simulation.js'),
  'utf8'
);

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed += 1;
  }
}

console.log('\n── HighwaySimulation ──');

assert('DECIDE runtime wrapper exists', script.includes('global.DECIDE = runtime'));
assert('run API exists', script.includes('runtime.simulation.run = function runSimulation'));
assert('optimize API exists', script.includes('runtime.simulation.optimize = function optimizeSimulation'));
assert('decision-matrix tool mapping exists', script.includes("'decision-matrix': 'tools/decision-matrix/index.html'"));
assert('scenario-planner tool mapping exists', script.includes("'scenario-planner': 'tools/scenario-planner/index.html'"));
assert('output-evaluator tool mapping exists', script.includes("'output-evaluator': 'tools/output-evaluator/index.html'"));
assert('HTML loads refactored simulation module', html.includes('<script src="./js/simulation.js"></script>'));
assert('UI includes optimize button', html.includes('id="optimize-corridor-btn"'));

module.exports = { passed, failed };
