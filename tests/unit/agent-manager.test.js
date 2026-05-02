const { createAgentManager } = require('../../core/agent-manager');
const exampleAgent = require('../../agents/example.agent');

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

console.log('\n── AgentManager ──');

const manager = createAgentManager();
manager.registerAgent(exampleAgent);
const output = manager.runAgent('example', { value: 42 });
const flow = manager.trace.getFlow(output.flowId);

assert('registerAgent stores and exposes agent', manager.listAgents().some((agent) => agent.id === 'example'));
assert('runAgent returns flow and result payload', !!output.flowId && output.result.agentId === 'example');
assert('lifecycle spans are recorded', flow.spans.length >= 4);
assert('run is deterministic for identical input shape', typeof output.result.runCount === 'number' && output.result.echoedInput.value === 42);
assert('agent context state is scoped by agent id', manager.runtime.stateManager.get('example.runCount') === 1);

module.exports = { passed, failed };


let initFailureThrown = false;
try {
  const failingInitManager = createAgentManager();
  failingInitManager.registerAgent({
    id: 'failing-init',
    name: 'Failing Init',
    version: '1.0.0',
    init() { throw new Error('init exploded'); },
    run() { return 'nope'; },
    dispose() {}
  });
  failingInitManager.runAgent('failing-init', {});
} catch (error) {
  initFailureThrown = error.message === 'init exploded';
}
assert('runAgent throws when init task fails in scheduler report', initFailureThrown);

const failingDisposeManager = createAgentManager();
failingDisposeManager.registerAgent({
  id: 'failing-dispose',
  name: 'Failing Dispose',
  version: '1.0.0',
  init() {},
  run() { return { ok: true }; },
  dispose() { throw new Error('dispose exploded'); }
});

let disposeFailureThrown = false;
let disposeFlowStatus = null;
try {
  failingDisposeManager.runAgent('failing-dispose', {});
} catch (error) {
  disposeFailureThrown = error.message === 'dispose exploded';
  const latestFlow = failingDisposeManager.trace.listFlows()[failingDisposeManager.trace.listFlows().length - 1];
  disposeFlowStatus = latestFlow && latestFlow.status;
}

assert('runAgent throws when dispose task fails in scheduler report', disposeFailureThrown);
assert('dispose failure marks flow as failed', disposeFlowStatus === 'failed');


const unrelatedTaskManager = createAgentManager();
unrelatedTaskManager.runtime.scheduler.schedule({ id: 'background:task', run: () => { throw new Error('background exploded'); } });
unrelatedTaskManager.registerAgent({
  id: 'unrelated-safe',
  name: 'Unrelated Safe',
  version: '1.0.0',
  init() {},
  run() { return { ok: true }; },
  dispose() {}
});
let unrelatedFailure = null;
try {
  unrelatedTaskManager.runAgent('unrelated-safe', {});
} catch (error) {
  unrelatedFailure = error;
}
assert('runAgent ignores unrelated scheduler task failures when lifecycle task succeeds', unrelatedFailure === null);
