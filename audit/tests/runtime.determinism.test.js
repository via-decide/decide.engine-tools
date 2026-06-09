'use strict';

const { createRuntime } = require('../../core/runtime');

function runDeterminismOnce() {
  const runtime = createRuntime({ tickRate: 30 });
  const executionOrder = [];

  runtime.scheduler.schedule({ id: 'b-task', priority: 10, run: () => executionOrder.push('b-task') });
  runtime.scheduler.schedule({ id: 'a-task', priority: 10, run: () => executionOrder.push('a-task') });
  runtime.scheduler.schedule({ id: 'c-task', priority: 5, run: () => executionOrder.push('c-task') });

  const report = runtime.step();
  const state = runtime.getState();

  return {
    report,
    state,
    executionOrder
  };
}

function runRuntimeDeterminismAudit() {
  const errors = [];

  try {
    const first = runDeterminismOnce();
    const second = runDeterminismOnce();

    if (JSON.stringify(first.report) !== JSON.stringify(second.report)) {
      errors.push('Runtime reports differ between identical runs.');
    }

    if (JSON.stringify(first.executionOrder) !== JSON.stringify(second.executionOrder)) {
      errors.push('Task execution order differs between identical runs.');
    }

    const expectedOrder = ['a-task', 'b-task', 'c-task'];
    if (JSON.stringify(first.executionOrder) !== JSON.stringify(expectedOrder)) {
      errors.push('Scheduler did not preserve deterministic priority/id ordering.');
    }

    if (first.state.runtime.tick !== 1 || second.state.runtime.tick !== 1) {
      errors.push('Runtime tick progression is inconsistent.');
    }
  } catch (error) {
    errors.push(`Runtime determinism audit crashed: ${error.message}`);
  }

  return {
    name: 'determinism',
    passed: errors.length === 0,
    errors
  };
}

module.exports = {
  runRuntimeDeterminismAudit
};
