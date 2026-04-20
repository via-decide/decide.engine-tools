(function (global) {
  'use strict';

  global.SkillHexGraphEngine = {
    grow(nodes, step) {
      const next = nodes.slice();
      if (step % 4 === 0) {
        next.push({
          id: `node-${step}`,
          label: `Skill ${step}`,
          weight: Math.min(100, 10 + step)
        });
      }
      return next;
    }
  };
})(window);
