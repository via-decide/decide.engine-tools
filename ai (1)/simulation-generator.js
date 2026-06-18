(function (global) {
  'use strict';

  const STORE_KEY = 'viadecide.ai.generated-simulations';

  function readGenerated() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function saveGenerated(items) {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
  }

  function registerSimulation(environment) {
    const current = readGenerated().filter((item) => item && item.name !== environment.name);
    current.push(environment);
    saveGenerated(current);

    if (!global.DECIDE_DYNAMIC_MODULES) global.DECIDE_DYNAMIC_MODULES = {};
    global.DECIDE_DYNAMIC_MODULES[environment.name] = environment;
    return environment;
  }

  function generateModule(request) {
    const environment = global.EnvironmentBuilder.buildEnvironmentTemplate(
      request.name,
      request.template,
      { creator: request.creator || 'zayvora', prompt: request.prompt }
    );
    return registerSimulation(environment);
  }

  function getAllGenerated() {
    return readGenerated();
  }

  function restoreGeneratedModules() {
    if (!global.DECIDE_DYNAMIC_MODULES) global.DECIDE_DYNAMIC_MODULES = {};
    readGenerated().forEach((item) => {
      if (item && item.name) global.DECIDE_DYNAMIC_MODULES[item.name] = item;
    });
  }

  global.SimulationGenerator = {
    generateModule,
    registerSimulation,
    getAllGenerated,
    restoreGeneratedModules
  };
})(window);
