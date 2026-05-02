'use strict';

const { createPluginSystem } = require('../../core/plugin-system');

function runPluginLifecycleAudit() {
  const errors = [];
  const system = createPluginSystem();

  const plugin = {
    id: 'audit-plugin',
    name: 'Audit Plugin',
    version: '1.0.0',
    init: () => {},
    execute: (_ctx, input) => ({ ok: true, echo: input && input.value }),
    dispose: () => {}
  };

  try {
    system.registerPlugin(plugin);
    if (!system.loadPlugin('audit-plugin')) errors.push('loadPlugin() returned false.');

    const execution = system.executePlugin('audit-plugin', { value: 42 });
    if (!execution.ok || execution.result.echo !== 42) {
      errors.push('executePlugin() did not return expected deterministic output.');
    }

    if (!system.unloadPlugin('audit-plugin')) errors.push('unloadPlugin() returned false.');

    const listed = system.listPlugins().find((item) => item.id === 'audit-plugin');
    if (!listed || listed.status !== 'unloaded') {
      errors.push('Plugin registry status was not unloaded after unloadPlugin().');
    }

    try {
      system.executePlugin('audit-plugin', { value: 1 });
      errors.push('Plugin executed successfully after unloadPlugin().');
    } catch (_err) {
      // expected
    }
  } catch (error) {
    errors.push(`Plugin lifecycle audit crashed: ${error.message}`);
  }

  return {
    name: 'pluginLifecycle',
    passed: errors.length === 0,
    errors
  };
}

module.exports = {
  runPluginLifecycleAudit
};
