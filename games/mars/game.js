(function (global) {
  'use strict';

  if (!global.DECIDE_GAMES) global.DECIDE_GAMES = {};
  if (!global.DECIDE_GAMES.mars) global.DECIDE_GAMES.mars = { name: 'mars' };

  function createInitialState() {
    return {
      sol: 1,
      energy: 100,
      risk: 8,
      progress: 0,
      status: 'Surveying terrain'
    };
  }

  function update(state, frame) {
    const delta = Math.max(1, Math.round(frame.deltaMs / 100));
    const nextProgress = Math.min(100, state.progress + delta);
    const nextEnergy = Math.max(0, state.energy - (delta * 0.3));
    const nextRisk = Math.min(100, Math.max(0, state.risk + ((Math.random() - 0.45) * 1.5)));

    return {
      sol: state.sol + (nextProgress === 100 ? 1 : 0),
      progress: nextProgress === 100 ? 0 : nextProgress,
      energy: Number(nextEnergy.toFixed(1)),
      risk: Number(nextRisk.toFixed(1)),
      status: nextEnergy < 20 ? 'Low energy recovery mode' : 'Navigating mission path'
    };
  }

  global.DECIDE_GAMES.mars.game = {
    createInitialState,
    update
  };
})(window);
