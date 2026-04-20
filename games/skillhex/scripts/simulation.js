(function (global) {
  'use strict';

  function createInitialState() {
    return {
      tick: 0,
      graph: [{ id: 'node-0', label: 'Core Skill', weight: 10 }],
      reputation: 5,
      profile: global.SkillHexPlayerProfile.create()
    };
  }

  function update(state) {
    const nextTick = state.tick + 1;
    const graph = global.SkillHexGraphEngine.grow(state.graph, nextTick);
    const reputation = global.SkillHexReputationSystem.tick(state.reputation, graph.length);
    const profile = global.SkillHexPlayerProfile.update(state.profile, reputation);

    return {
      tick: nextTick,
      graph,
      reputation,
      profile
    };
  }

  global.SkillHexSimulation = { createInitialState, update };
})(window);
