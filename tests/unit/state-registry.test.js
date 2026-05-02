const { createStateRegistry } = require('../../core/state-registry');

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

console.log('\n── StateRegistry ──');

const events = [];
const registry = createStateRegistry({}, { onEvent: (name, payload) => events.push({ name, payload }), maxEntries: 2 });
registry.set('a', { x: 1 });
registry.set('b', { x: 2 });
registry.set('c', { x: 3 });

assert('maxEntries evicts oldest key', registry.get('a') === null && registry.size() === 2);
assert('eviction emits state_evicted event', events.some((evt) => evt.name === 'state_evicted'));

registry.set('ttl-key', { z: true });
registry.cleanupExpired(0);
assert('cleanupExpired removes expired entries', registry.get('ttl-key') === null);

registry.set('delete-key', { live: true });
registry.delete('delete-key');
assert('delete removes entry deterministically', registry.get('delete-key') === null);
assert('state_deleted event logged', events.some((evt) => evt.name === 'state_deleted'));

module.exports = { passed, failed };
