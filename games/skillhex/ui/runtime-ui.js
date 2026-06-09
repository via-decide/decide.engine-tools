(function (global) {
  'use strict';

  function mount(host) {
    host.innerHTML = [
      '<div class="game-shell">',
      '  <h2>SkillHex Capability Graph Runtime</h2>',
      '  <div>Tick: <strong data-skillhex="tick">-</strong></div>',
      '  <div>Graph Nodes: <strong data-skillhex="nodes">-</strong></div>',
      '  <div>Reputation: <strong data-skillhex="reputation">-</strong></div>',
      '  <div>Profile: <strong data-skillhex="profile">-</strong></div>',
      '</div>'
    ].join('');
  }

  function render(state) {
    const values = {
      tick: state.tick,
      nodes: state.graph.length,
      reputation: `${state.reputation}%`,
      profile: `L${state.profile.level} · ${state.profile.title}`
    };

    Object.keys(values).forEach((key) => {
      const node = document.querySelector(`[data-skillhex="${key}"]`);
      if (node) node.textContent = String(values[key]);
    });
  }

  global.SkillHexSimulationUI = { mount, render };
})(window);
