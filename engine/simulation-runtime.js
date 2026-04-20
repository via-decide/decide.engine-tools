(function (global) {
  'use strict';

  const runtimeState = {
    isRunning: false,
    lastFrameTs: 0,
    rafId: null,
    module: null,
    currentState: null
  };

  function setModule(module, initialState) {
    runtimeState.module = module;
    runtimeState.currentState = initialState;
  }

  function step(timestamp) {
    if (!runtimeState.isRunning || !runtimeState.module || !runtimeState.module.game) return;

    const deltaMs = runtimeState.lastFrameTs ? (timestamp - runtimeState.lastFrameTs) : 16;
    runtimeState.lastFrameTs = timestamp;

    if (typeof runtimeState.module.game.update === 'function') {
      runtimeState.currentState = runtimeState.module.game.update(runtimeState.currentState, {
        deltaMs,
        timestamp
      });
    }

    if (runtimeState.module.ui && typeof runtimeState.module.ui.render === 'function') {
      runtimeState.module.ui.render(runtimeState.currentState);
    }

    runtimeState.rafId = global.requestAnimationFrame(step);
  }

  function start() {
    if (runtimeState.isRunning) return;
    runtimeState.isRunning = true;
    runtimeState.lastFrameTs = 0;
    runtimeState.rafId = global.requestAnimationFrame(step);
  }

  function pause() {
    runtimeState.isRunning = false;
    if (runtimeState.rafId) {
      global.cancelAnimationFrame(runtimeState.rafId);
      runtimeState.rafId = null;
    }
  }

  function reset() {
    if (!runtimeState.module || !runtimeState.module.game || typeof runtimeState.module.game.createInitialState !== 'function') {
      return null;
    }

    runtimeState.currentState = runtimeState.module.game.createInitialState();
    if (runtimeState.module.ui && typeof runtimeState.module.ui.render === 'function') {
      runtimeState.module.ui.render(runtimeState.currentState);
    }
    return runtimeState.currentState;
  }

  function getState() {
    return runtimeState.currentState;
  }

  global.SimulationRuntime = {
    setModule,
    start,
    pause,
    reset,
    getState
  };
})(window);
