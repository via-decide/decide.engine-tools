const { createPluginSystem } = require('../../core/plugin-system');
const examplePlugin = require('../../plugins/example.plugin');

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

console.log('\n── PluginSystem ──');

const system = createPluginSystem();

assert('registerPlugin stores plugin', system.registerPlugin(examplePlugin) === 'example-plugin');
assert('listPlugins shows unloaded', system.listPlugins()[0].status === 'unloaded');
assert('loadPlugin transitions to loaded', system.loadPlugin('example-plugin') === true);
assert('executePlugin returns deterministic payload', system.executePlugin('example-plugin', { a: 1 }).result.pluginId === 'example-plugin');
assert('unloadPlugin transitions to unloaded', system.unloadPlugin('example-plugin') === true);
assert('execution blocked when unloaded', (() => { try { system.executePlugin('example-plugin', {}); return false; } catch (_err) { return true; } })());
assert('lifecycle activity logged', system.getActivityLog().some((entry) => entry.event === 'load') && system.getActivityLog().some((entry) => entry.event === 'unload'));
assert('plugin execution traces are recorded', system.trace.listFlows().length >= 1);

module.exports = { passed, failed };
