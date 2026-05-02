'use strict';

function clone(value) {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

function createAgentContext({ stateManager, trace, runtime, agentId, flowId, meta = {} }) {
  if (!stateManager || typeof stateManager.get !== 'function' || typeof stateManager.set !== 'function') {
    throw new Error('createAgentContext requires a valid state manager.');
  }

  const baseMeta = Object.freeze({ ...meta, agentId, flowId });

  return Object.freeze({
    state: Object.freeze({
      get: (key) => stateManager.get(`${agentId}.${key}`),
      set: (key, value) => stateManager.set(`${agentId}.${key}`, clone(value)),
      snapshot: () => clone(stateManager.snapshot())
    }),
    trace: Object.freeze({
      flowId,
      startSpan: (spanMeta) => trace.startSpan(flowId, spanMeta),
      endSpan: (spanId, patch) => trace.endSpan(spanId, patch),
      event: (spanId, name, attrs) => trace.event(spanId, name, attrs),
      fail: (spanId, error, patch) => trace.fail(spanId, error, patch)
    }),
    runtime: Object.freeze({
      schedule: (task) => runtime.scheduler.schedule(task),
      tickRate: runtime.tickRate
    }),
    meta: baseMeta
  });
}

module.exports = {
  createAgentContext
};
