(function (global) {
  'use strict';

  const runtime = {
    currentGame: null,
    loadedModules: {}
  };

  async function loadGame(name) {
    const module = await global.GameLoader.loadGame(name);
    runtime.currentGame = module;
    runtime.loadedModules[name] = module;

    global.UiOrchestrator.mountGameUi(module);
    const initialState = module.game.createInitialState();
    global.SimulationRuntime.setModule(module, initialState);
    module.ui.render(initialState);
    global.UiOrchestrator.updateStatus(`Loaded ${module.config.title}.`);

    return module;
  }

  async function startSimulation(name) {
    if (!runtime.currentGame || !runtime.currentGame.config || runtime.currentGame.config.name !== name) {
      await loadGame(name);
    }

    global.SimulationRuntime.start();
    global.UiOrchestrator.updateStatus(`Running ${runtime.currentGame.config.title}.`);
  }

  function pauseSimulation() {
    global.SimulationRuntime.pause();
    global.UiOrchestrator.updateStatus('Simulation paused.');
  }

  function resetSimulation() {
    const state = global.SimulationRuntime.reset();
    global.UiOrchestrator.updateStatus('Simulation reset.');
    return state;
  }

  global.EngineCore = {
    loadGame,
    startSimulation,
    pauseSimulation,
    resetSimulation
  };
})(window);
