'use strict';

class TraceStore {
  constructor() {
    this.flows = new Map();
    this.spans = new Map();
  }

  addFlow(flow) {
    this.flows.set(flow.id, flow);
  }

  addSpan(span) {
    const flow = this.flows.get(span.flowId);
    if (!flow) throw new Error(`Unknown flow: ${span.flowId}`);

    flow.spans.push(span.id);
    this.spans.set(span.id, span);

    if (span.parentId) {
      const parent = this.spans.get(span.parentId);
      if (!parent) throw new Error(`Unknown parent span: ${span.parentId}`);
      if (parent.flowId !== span.flowId) throw new Error('Parent span must belong to same flow');
      parent.children.push(span.id);
    }
  }

  getFlow(flowId) {
    return this.flows.get(flowId) || null;
  }

  getSpan(spanId) {
    return this.spans.get(spanId) || null;
  }

  listFlows() {
    return Array.from(this.flows.values());
  }
}

module.exports = {
  TraceStore
};
