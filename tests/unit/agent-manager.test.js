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
const secondOutput = manager.runAgent('example', { value: 42 });
const flow = manager.trace.getFlow(output.flowId);
const secondFlow = manager.trace.getFlow(secondOutput.flowId);

assert('registerAgent stores and exposes agent', manager.listAgents().some((agent) => agent.id === 'example'));
assert('runAgent returns flow and result payload', !!output.flowId && output.result.agentId === 'example');
assert('runAgent can execute same agent repeatedly', !!secondOutput.flowId && secondOutput.result.runCount === 2);
assert('lifecycle spans are recorded', flow.spans.length >= 4);
assert('lifecycle spans are recorded for repeat run', secondFlow.spans.length >= 4);
assert('run is deterministic for identical input shape', typeof output.result.runCount === 'number' && output.result.echoedInput.value === 42);
assert('agent context state is scoped by agent id', manager.runtime.stateManager.get('example.runCount') === 2);
assert('state transitions are traced as events', flow.spans.some((id) => manager.trace.store.getSpan(id).events.some((evt) => evt.name === 'state.transition')));

const failingAgent = {
  id: 'failing',
  name: 'Failing Agent',
  version: '1.0.0',
  init() {},
  run() { throw new Error('boom'); },
  dispose() {}
};
manager.registerAgent(failingAgent);

let failingFlowId = null;
let threw = false;
try {
  manager.runAgent('failing', { value: 1 });
} catch (error) {
  threw = true;
  failingFlowId = error && error.flowId ? error.flowId : null;
}
assert('failing agent run throws error', threw);
const failingFlow = manager.trace.getFlow(failingFlowId);
const failingTransitions = failingFlow.spans
  .flatMap((id) => manager.trace.store.getSpan(id).events || [])
  .filter((evt) => evt.name === 'state.transition')
  .map((evt) => evt.attrs.event);
assert('failing run records fail transition', failingTransitions.includes('fail'));
assert('failing run does not record complete transition', !failingTransitions.includes('complete'));

module.exports = { passed, failed };
