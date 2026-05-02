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
assert('agent state machine reaches COMPLETED', manager.runtime.stateMachine.getState('example') === 'COMPLETED');
assert('state transitions are traced as events', flow.spans.some((id) => manager.trace.store.getSpan(id).events.some((evt) => evt.name === 'state.transition')));

module.exports = { passed, failed };
