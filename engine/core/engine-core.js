(function (global) {
  'use strict';

  const runtime = {
    currentGame: null,
    currentState: null,
    ecs: global.EntitySystem.createEntitySystem(),
    loop: null
  };

  function ensureLoop() {
    if (runtime.loop) return runtime.loop;

    runtime.loop = global.SimulationLoop.createSimulationLoop((frame) => {
      if (!runtime.currentGame || !runtime.currentGame.game) return;

      runtime.ecs.runSystems(frame);
      runtime.currentState = runtime.currentGame.game.update(runtime.currentState, frame, runtime.ecs);
      runtime.currentGame.ui.render(runtime.currentState, runtime.ecs);
    });

    return runtime.loop;
  }

  async function loadGame(name) {
    const module = await global.GameLoader.loadGame(name);
    runtime.currentGame = module;
    runtime.currentState = module.game.createInitialState(runtime.ecs);

    global.UiOrchestrator.mountGameUi(module);
    module.ui.render(runtime.currentState, runtime.ecs);
    global.UiOrchestrator.updateStatus(`Loaded ${module.config.title}.`);

    return module;
  }

  async function startSimulation(name) {
    if (!runtime.currentGame || runtime.currentGame.name !== name) {
      await loadGame(name);
    }

    ensureLoop().start();
    global.UiOrchestrator.updateStatus(`Running ${runtime.currentGame.config.title}.`);
  }

  function pauseSimulation() {
    if (runtime.loop) runtime.loop.stop();
    global.UiOrchestrator.updateStatus('Simulation paused.');
  }

  function resetSimulation() {
    if (!runtime.currentGame || !runtime.currentGame.game) return null;
    runtime.loop && runtime.loop.stop();
    runtime.ecs.reset();
    runtime.currentState = runtime.currentGame.game.createInitialState(runtime.ecs);
    runtime.currentGame.ui.render(runtime.currentState, runtime.ecs);
    global.UiOrchestrator.updateStatus('Simulation reset.');
    return runtime.currentState;
  }

  global.EngineCore = {
    loadGame,
    startSimulation,
    pauseSimulation,
    resetSimulation
  };
})(window);
