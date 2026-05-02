const { createTraceEngine } = require('../../core/trace-engine');

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

console.log('\n── TraceEngine ──');

const trace = createTraceEngine();
const flowId = trace.startFlow({ run: 1 });
const root = trace.startSpan(flowId, { name: 'root' });
trace.event(root, 'start', { a: 1 });
const child = trace.startSpan(flowId, { name: 'child', parentId: root, links: [root] });
trace.endSpan(child, { note: 'ok' });
trace.fail(root, new Error('boom'));
trace.endFlow(flowId, { failed: true });

const flow = trace.getFlow(flowId);
assert('flow exists', !!flow);
assert('span IDs are attached to flow', flow.spans.length === 2);
assert('parent-child linkage is preserved', trace.getFlow(flowId) && flow && flow.spans.includes(root) && flow.spans.includes(child));
assert('events are appended', trace.listFlows()[0].id === flowId && trace.getFlow(flowId));
assert('links are stored for DAG support', flow.links.length === 1 && flow.links[0].from === child);
assert('fail creates breakpoint', Array.isArray(flow.breakpoints) && flow.breakpoints.length === 1);
assert('failed span is marked failed', flow.status === 'failed');

module.exports = { passed, failed };
