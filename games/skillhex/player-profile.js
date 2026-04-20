(function (global) {
  'use strict';

  global.SkillHexPlayerProfile = {
    create() {
      return {
        level: 1,
        title: 'Capability Explorer'
      };
    },
    update(profile, reputation) {
      const level = 1 + Math.floor(reputation / 20);
      const title = level >= 5 ? 'Capability Architect' : (level >= 3 ? 'Skill Navigator' : 'Capability Explorer');
      return { level, title };
    }
  };
})(window);
