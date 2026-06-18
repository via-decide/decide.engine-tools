(function (global) {
  'use strict';

  if (!global.DECIDE_GAME_MODULES) global.DECIDE_GAME_MODULES = {};

  global.DECIDE_GAME_MODULES.skillhex = {
    scripts: [
      'graph-engine.js',
      'reputation-system.js',
      'player-profile.js',
      'scripts/simulation.js',
      'ui/runtime-ui.js'
    ],
    gameFactory(runtimeGlobal) {
      return runtimeGlobal.SkillHexSimulation;
    },
    uiFactory(runtimeGlobal) {
      return runtimeGlobal.SkillHexSimulationUI;
    }
  };
})(window);
