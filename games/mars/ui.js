(function (global) {
  'use strict';

  if (!global.DECIDE_GAMES) global.DECIDE_GAMES = {};
  if (!global.DECIDE_GAMES.mars) global.DECIDE_GAMES.mars = { name: 'mars' };

  function mount(host) {
    host.innerHTML = [
      '<div class="game-shell">',
      '  <h2>Mars Simulation Runtime</h2>',
      '  <p>Live runtime state driven by <code>simulation-runtime.js</code>.</p>',
      '  <div class="metrics">',
      '    <div>Sol: <strong data-mars="sol">-</strong></div>',
      '    <div>Energy: <strong data-mars="energy">-</strong></div>',
      '    <div>Risk: <strong data-mars="risk">-</strong></div>',
      '    <div>Progress: <strong data-mars="progress">-</strong></div>',
      '  </div>',
      '  <div>Status: <strong data-mars="status">-</strong></div>',
      '</div>'
    ].join('');
  }

  function render(state) {
    const lookup = {
      sol: state.sol,
      energy: `${state.energy}%`,
      risk: `${state.risk}%`,
      progress: `${Math.round(state.progress)}%`,
      status: state.status
    };

    Object.keys(lookup).forEach((key) => {
      const el = document.querySelector(`[data-mars="${key}"]`);
      if (el) el.textContent = String(lookup[key]);
    });
  }

  global.DECIDE_GAMES.mars.ui = {
    mount,
    render
  };
})(window);
