(function (global) {
  'use strict';

  async function generateSimulation(prompt, options = {}) {
    const result = await global.AISimulationPipeline.runPipeline(prompt, options);
    return result.module.config;
  }

  async function launchSimulation(name) {
    return global.AISimulationPipeline.launchSimulation(name);
  }

  function listSimulations() {
    const generated = global.SimulationGenerator.getAllGenerated().map((item) => item.config);
    const builtIn = Array.isArray(global.DECIDE_GAME_MANIFEST) ? global.DECIDE_GAME_MANIFEST : [];
    return [...builtIn, ...generated];
  }

  global.generateSimulation = generateSimulation;
  global.launchSimulation = launchSimulation;
  global.listSimulations = listSimulations;
})(window);
