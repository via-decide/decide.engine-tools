(function (global) {
  'use strict';

  function createInitialState() {
    return {
      turn: 1,
      map: global.OrchadeGameMap.create(),
      resources: { food: 50, ore: 35, energy: 60 },
      strategicPressure: 12,
      recommendation: 'Establish first governance cycle.'
    };
  }

  function update(state) {
    const resources = global.OrchadeEconomySystem.tick(state.resources);
    const strategy = global.OrchadeStrategyEngine.evaluateTurn({
      strategicPressure: state.strategicPressure,
      resources
    });

    return {
      turn: state.turn + 1,
      map: state.map,
      resources,
      strategicPressure: strategy.strategicPressure,
      recommendation: strategy.recommendation
    };
  }

  global.OrchadeSimulation = { createInitialState, update };
})(window);
