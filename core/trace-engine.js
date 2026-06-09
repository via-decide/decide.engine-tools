'use strict';

const { performance } = require('perf_hooks');
const { createIdGenerator } = require('./id');
const { TraceStore } = require('./trace-store');

class TraceEngine {
  constructor(options = {}) {
    this.store = options.store || new TraceStore();
    this.nextFlowId = createIdGenerator('flow');
    this.nextSpanId = createIdGenerator('span');
    this.nextBreakpointId = createIdGenerator('bp');
  }

  startFlow(meta = {}) {
    const flow = {
      id: this.nextFlowId(),
      meta,
      status: 'running',
      startTime: performance.now(),
      endTime: null,
      spans: [],
      links: [],
      breakpoints: []
    };
    this.store.addFlow(flow);
    return flow.id;
  }

  endFlow(flowId, outcome = {}) {
    const flow = this.store.getFlow(flowId);
    if (!flow) throw new Error(`Unknown flow: ${flowId}`);
    flow.status = outcome && outcome.failed ? 'failed' : (flow.status === 'failed' ? 'failed' : 'completed');
    flow.endTime = performance.now();
    flow.outcome = outcome;
    return flow;
  }

  startSpan(flowId, meta = {}) {
    const span = {
      id: this.nextSpanId(),
      flowId,
      parentId: meta.parentId || null,
      name: meta.name || 'span',
      status: 'running',
      startTime: performance.now(),
      endTime: null,
      events: [],
      error: null,
      children: []
    };
    this.store.addSpan(span);

    if (Array.isArray(meta.links) && meta.links.length) {
      const flow = this.store.getFlow(flowId);
      meta.links.forEach((toSpanId) => flow.links.push({ from: span.id, to: toSpanId }));
    }

    return span.id;
  }

  endSpan(spanId, patch = {}) {
    const span = this.store.getSpan(spanId);
    if (!span) throw new Error(`Unknown span: ${spanId}`);
    Object.assign(span, patch);
    span.status = span.status === 'failed' ? 'failed' : 'completed';
    span.endTime = performance.now();
    return span;
  }

  event(spanId, name, attrs = {}) {
    const span = this.store.getSpan(spanId);
    if (!span) throw new Error(`Unknown span: ${spanId}`);
    span.events.push({ name, attrs, timestamp: performance.now() });
    return span.events[span.events.length - 1];
  }

  fail(spanId, error, patch = {}) {
    const span = this.store.getSpan(spanId);
    if (!span) throw new Error(`Unknown span: ${spanId}`);
    const flow = this.store.getFlow(span.flowId);
    if (!flow) throw new Error(`Unknown flow: ${span.flowId}`);

    Object.assign(span, patch);
    span.status = 'failed';
    span.endTime = performance.now();
    span.error = error && error.message ? error.message : String(error);

    flow.status = 'failed';
    flow.breakpoints.push({
      id: this.nextBreakpointId(),
      spanId,
      error: span.error,
      timestamp: performance.now(),
      snapshot: {
        span: { ...span },
        flowId: flow.id
      }
    });

    return span;
  }

  getFlow(flowId) {
    return this.store.getFlow(flowId);
  }

  listFlows() {
    return this.store.listFlows();
  }
}

module.exports = {
  TraceEngine,
  createTraceEngine: (options) => new TraceEngine(options)
};
