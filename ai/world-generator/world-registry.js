(function (global) {
  'use strict';

  const STORE_KEY = 'viadecide.ai.generated-worlds';

  function readRegistry() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function writeRegistry(items) {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
  }

  function registerWorld(worldModule) {
    const index = readRegistry().filter((item) => item && item.world_id !== worldModule.name);
    const metadata = {
      world_id: worldModule.name,
      world_name: worldModule.config.title,
      creator: worldModule.config.creator || 'zayvora',
      template: worldModule.config.type,
      seed: worldModule.config.seed,
      launch_url: worldModule.config.launchUrl
    };

    index.push(metadata);
    writeRegistry(index);

    if (!global.DECIDE_DYNAMIC_MODULES) global.DECIDE_DYNAMIC_MODULES = {};
    global.DECIDE_DYNAMIC_MODULES[worldModule.name] = worldModule;

    if (global.GameLoader && typeof global.GameLoader.registerDynamicModule === 'function') {
      global.GameLoader.registerDynamicModule(worldModule);
    }

    return metadata;
  }

  function listWorlds() {
    return readRegistry();
  }

  global.WorldRegistry = {
    registerWorld,
    listWorlds,
    readRegistry
  };
})(window);
