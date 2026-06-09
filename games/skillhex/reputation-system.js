(function (global) {
  'use strict';

  global.SkillHexReputationSystem = {
    tick(reputation, graphSize) {
      return Math.min(100, Number((reputation + (graphSize * 0.08)).toFixed(2)));
    }
  };
})(window);
