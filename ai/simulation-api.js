(function (global) {
  'use strict';

  async function generateSimulation(prompt, options = {}) {
    const result = await global.AISimulationPipeline.runPipeline(prompt, options);
    return result.module.config;
  }

  async function launchSimulation(name) {
    return global.AISimulationPipeline.launchSimulation(name);
  }

  async function createWorld(promptOrPreset, options = {}) {
    if (!global.AIWorldPipeline || typeof global.AIWorldPipeline.createWorld !== 'function') {
      throw new Error('AIWorldPipeline is not available.');
    }
    return global.AIWorldPipeline.createWorld(promptOrPreset, options);
  }

  function listWorlds() {
    if (!global.WorldRegistry || typeof global.WorldRegistry.listWorlds !== 'function') return [];
    return global.WorldRegistry.listWorlds();
  }

  function listSimulations() {
    const generated = global.SimulationGenerator.getAllGenerated().map((item) => item.config);
    const worldModules = global.DECIDE_DYNAMIC_MODULES
      ? Object.keys(global.DECIDE_DYNAMIC_MODULES).map((key) => global.DECIDE_DYNAMIC_MODULES[key].config)
      : [];
    const builtIn = Array.isArray(global.DECIDE_GAME_MANIFEST) ? global.DECIDE_GAME_MANIFEST : [];
    return [...builtIn, ...generated, ...worldModules];
  }

  global.generateSimulation = generateSimulation;
  global.launchSimulation = launchSimulation;
  global.listSimulations = listSimulations;
  global.createWorld = createWorld;
  global.listWorlds = listWorlds;
})(window);
