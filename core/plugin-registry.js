'use strict';

class PluginRegistry {
  constructor(logger = () => {}) {
    this.logger = typeof logger === 'function' ? logger : () => {};
    this.plugins = new Map();
  }

  validatePlugin(plugin) {
    const required = ['id', 'name', 'version', 'init', 'execute', 'dispose'];
    const missing = required.filter((key) => plugin == null || plugin[key] == null);
    if (missing.length) {
      throw new Error(`Plugin missing required fields: ${missing.join(', ')}`);
    }

    ['init', 'execute', 'dispose'].forEach((hook) => {
      if (typeof plugin[hook] !== 'function') {
        throw new Error(`Plugin hook must be a function: ${hook}`);
      }
    });

    if (typeof plugin.id !== 'string' || !plugin.id.trim()) {
      throw new Error('Plugin id must be a non-empty string');
    }
  }

  register(plugin) {
    this.validatePlugin(plugin);
    this.plugins.set(plugin.id, {
      plugin,
      status: 'unloaded',
      state: Object.create(null)
    });
    this.logger('register', plugin.id, { status: 'unloaded' });
    return plugin.id;
  }

  get(pluginId) {
    return this.plugins.get(pluginId) || null;
  }

  list() {
    return Array.from(this.plugins.values()).map((entry) => ({
      id: entry.plugin.id,
      name: entry.plugin.name,
      version: entry.plugin.version,
      status: entry.status
    }));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PluginRegistry };
}
