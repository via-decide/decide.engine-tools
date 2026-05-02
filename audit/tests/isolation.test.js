'use strict';

const { createPluginSystem } = require('../../core/plugin-system');

function snapshotGlobalShape() {
  return Object.getOwnPropertyNames(globalThis).sort();
}

function runIsolationAudit() {
  const isolationErrors = [];
  const globalLeakErrors = [];
  const system = createPluginSystem();

  const pluginA = {
    id: 'plugin-a',
    name: 'Plugin A',
    version: '1.0.0',
    init: () => {},
    execute: (_ctx, input) => ({ plugin: 'A', value: input && input.value }),
    dispose: () => {}
  };

  const pluginB = {
    id: 'plugin-b',
    name: 'Plugin B',
    version: '1.0.0',
    init: () => {},
    execute: (_ctx, input) => ({ plugin: 'B', value: input && input.value }),
    dispose: () => {}
  };

  try {
    const beforeGlobals = snapshotGlobalShape();

    system.registerPlugin(pluginA);
    system.registerPlugin(pluginB);
    system.loadPlugin('plugin-a');
    system.loadPlugin('plugin-b');

    const aResult = system.executePlugin('plugin-a', { value: 100 });
    const bResult = system.executePlugin('plugin-b', { value: 200 });

    if (!aResult.ok || aResult.result.plugin !== 'A') isolationErrors.push('Plugin A output invalid.');
    if (!bResult.ok || bResult.result.plugin !== 'B') isolationErrors.push('Plugin B output invalid.');
    if (aResult.result.value === bResult.result.value) isolationErrors.push('Plugin A affected plugin B output.');

    const afterGlobals = snapshotGlobalShape();
    if (JSON.stringify(beforeGlobals) !== JSON.stringify(afterGlobals)) {
      globalLeakErrors.push('Unexpected global scope mutation detected.');
    }
  } catch (error) {
    isolationErrors.push(`Isolation audit crashed: ${error.message}`);
  }

  return {
    name: 'isolation',
    passed: isolationErrors.length === 0,
    errors: isolationErrors,
    globalLeakPassed: globalLeakErrors.length === 0,
    globalLeakErrors
  };
}

module.exports = {
  runIsolationAudit
};
