const { createRuntime } = require('../../core/runtime');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${label}`);
  } else {
    failed += 1;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

console.log('\n── Runtime ──');

const runtime = createRuntime({ tickRate: 60 });
let value = 0;

runtime.scheduler.schedule({ id: 'inc', run: () => { value += 1; } });
runtime.scheduler.schedule({ id: 'fail', run: () => { throw new Error('boom'); } });

const report = runtime.step();
const state = runtime.getState();

assert('step executes at least one task', report.executed >= 1);
assert('step captures task failures and continues', report.failed === 1 && value === 1);
assert('state manager stores last report', state.state.lastReport && state.state.lastReport.tick === 0);
assert('runtime control start/stop exposed', runtime.start() === true && runtime.stop() === true);
assert('runtime trace flow created per step', runtime.trace.listFlows().length >= 1);

module.exports = { passed, failed };
