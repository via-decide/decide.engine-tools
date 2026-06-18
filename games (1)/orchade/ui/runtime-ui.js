(function (global) {
  'use strict';

  function mount(host) {
    host.innerHTML = [
      '<div class="game-shell">',
      '  <h2>Orchade Strategy Runtime</h2>',
      '  <div>Turn: <strong data-orchade="turn">-</strong></div>',
      '  <div>Sector: <strong data-orchade="sector">-</strong></div>',
      '  <div>Food / Ore / Energy: <strong data-orchade="resources">-</strong></div>',
      '  <div>Strategic Pressure: <strong data-orchade="pressure">-</strong></div>',
      '  <div>Recommendation: <strong data-orchade="recommendation">-</strong></div>',
      '</div>'
    ].join('');
  }

  function render(state) {
    const values = {
      turn: state.turn,
      sector: state.map.activeSector,
      resources: `${state.resources.food} / ${state.resources.ore} / ${state.resources.energy}`,
      pressure: state.strategicPressure,
      recommendation: state.recommendation
    };

    Object.keys(values).forEach((key) => {
      const node = document.querySelector(`[data-orchade="${key}"]`);
      if (node) node.textContent = String(values[key]);
    });
  }

  global.OrchadeSimulationUI = { mount, render };
})(window);
