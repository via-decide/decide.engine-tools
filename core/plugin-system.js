'use strict';

const { PluginRegistry } = require('./plugin-registry');
const { createTraceEngine } = require('./trace-engine');

class PluginSystem {
  constructor(options = {}) {
    this.activityLog = [];
    this.logger = typeof options.logger === 'function' ? options.logger : () => {};
    this.registry = new PluginRegistry((event, pluginId, meta) => this.log(event, pluginId, meta));
    this.trace = options.traceEngine || createTraceEngine();
  }

  log(event, pluginId, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      event,
      pluginId,
      meta
    };
    this.activityLog.push(entry);
    this.logger(entry);
  }

  createSandboxContext(pluginId, pluginState) {
    const localState = JSON.parse(JSON.stringify(pluginState || {}));
    return Object.freeze({
      pluginId,
      state: localState,
      log: (message, data) => this.log('plugin-log', pluginId, { message, data })
    });
  }

  registerPlugin(plugin) {
    return this.registry.register(plugin);
  }

  loadPlugin(pluginId) {
    const entry = this.registry.get(pluginId);
    if (!entry) throw new Error(`Unknown plugin: ${pluginId}`);
    if (entry.status === 'loaded') return true;

    try {
      const ctx = this.createSandboxContext(pluginId, entry.state);
      entry.plugin.init(ctx);
      entry.status = 'loaded';
      this.log('load', pluginId, { ok: true });
      return true;
    } catch (error) {
      this.log('load', pluginId, { ok: false, error: error.message });
      return false;
    }
  }

  unloadPlugin(pluginId) {
    const entry = this.registry.get(pluginId);
    if (!entry) throw new Error(`Unknown plugin: ${pluginId}`);
    if (entry.status !== 'loaded') return true;

    try {
      const ctx = this.createSandboxContext(pluginId, entry.state);
      entry.plugin.dispose(ctx);
      entry.status = 'unloaded';
      entry.state = Object.create(null);
      this.log('unload', pluginId, { ok: true });
      return true;
    } catch (error) {
      this.log('unload', pluginId, { ok: false, error: error.message });
      return false;
    }
  }

  executePlugin(pluginId, input, traceContext = null) {
    const entry = this.registry.get(pluginId);
    if (!entry) throw new Error(`Unknown plugin: ${pluginId}`);
    if (entry.status !== 'loaded') {
      throw new Error(`Plugin not loaded: ${pluginId}`);
    }

    const parentFlowId = traceContext && traceContext.flowId ? traceContext.flowId : this.trace.startFlow({ source: 'plugin-system', pluginId });
    const ownFlow = !(traceContext && traceContext.flowId);
    const spanId = this.trace.startSpan(parentFlowId, { name: `plugin.execute:${pluginId}`, parentId: traceContext && traceContext.parentSpanId ? traceContext.parentSpanId : null });

    try {
      const ctx = this.createSandboxContext(pluginId, entry.state);
      const result = entry.plugin.execute(ctx, input);
      this.log('execute', pluginId, { ok: true });
      this.trace.endSpan(spanId, { pluginId });
      if (ownFlow) this.trace.endFlow(parentFlowId, { failed: false, pluginId });
      return { ok: true, result };
    } catch (error) {
      this.log('execute', pluginId, { ok: false, error: error.message });
      this.trace.fail(spanId, error, { pluginId });
      if (ownFlow) this.trace.endFlow(parentFlowId, { failed: true, pluginId, error: error.message });
      return { ok: false, error: error.message };
    }
  }

  listPlugins() {
    return this.registry.list();
  }

  getActivityLog() {
    return this.activityLog.slice();
  }
}

module.exports = {
  PluginSystem,
  createPluginSystem: (options) => new PluginSystem(options)
};
