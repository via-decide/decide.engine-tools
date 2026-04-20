(function (global) {
  'use strict';

  if (!global.DECIDE_GAME_MODULES) global.DECIDE_GAME_MODULES = {};

  global.DECIDE_GAME_MODULES.orchade = {
    scripts: [
      'strategy-engine.js',
      'game-map.js',
      'economy-system.js',
      'scripts/simulation.js',
      'ui/runtime-ui.js'
    ],
    gameFactory(runtimeGlobal) {
      return runtimeGlobal.OrchadeSimulation;
    },
    uiFactory(runtimeGlobal) {
      return runtimeGlobal.OrchadeSimulationUI;
    }
  };
})(window);
