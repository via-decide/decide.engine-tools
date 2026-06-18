(function (global) {
  'use strict';

  global.OrchadeEconomySystem = {
    tick(resources) {
      return {
        food: Math.max(0, resources.food + 1),
        ore: Math.max(0, resources.ore + 2),
        energy: Math.max(0, resources.energy - 1)
      };
    }
  };
})(window);
