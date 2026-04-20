(function (global) {
  'use strict';

  if (!global.DECIDE_GAME_MODULES) global.DECIDE_GAME_MODULES = {};

  global.DECIDE_GAME_MODULES.mars = {
    scripts: [
      'scripts/simulation.js',
      'ui/runtime-ui.js'
    ],
    gameFactory(runtimeGlobal) {
      return runtimeGlobal.MarsSimulation;
    },
    uiFactory(runtimeGlobal) {
      return runtimeGlobal.MarsSimulationUI;
    }
  };
})(window);
