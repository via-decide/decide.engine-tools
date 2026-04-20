(function (global) {
  'use strict';

  function createSimulationLoop(stepFn) {
    const state = { running: false, rafId: null, lastFrameTs: 0 };

    function frame(timestamp) {
      if (!state.running) return;
      const deltaMs = state.lastFrameTs ? timestamp - state.lastFrameTs : 16;
      state.lastFrameTs = timestamp;
      stepFn({ deltaMs, timestamp });
      state.rafId = global.requestAnimationFrame(frame);
    }

    return {
      start() {
        if (state.running) return;
        state.running = true;
        state.lastFrameTs = 0;
        state.rafId = global.requestAnimationFrame(frame);
      },
      stop() {
        state.running = false;
        if (state.rafId) {
          global.cancelAnimationFrame(state.rafId);
          state.rafId = null;
        }
      },
      isRunning() {
        return state.running;
      }
    };
  }

  global.SimulationLoop = { createSimulationLoop };
})(window);
