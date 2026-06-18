(function (global) {
  'use strict';

  function createUiRenderer(context = {}) {
    const title = context.title || 'Voxel World';

    return {
      mount(host) {
        host.innerHTML = `
          <section style="padding:12px;border:1px solid #2d4269;border-radius:10px;background:#0f1725;">
            <h2 style="margin:0 0 10px;">${title}</h2>
            <p style="margin:0 0 10px;color:#9ab5dc;">Minimal playable voxel world runtime.</p>
            <div id="world-runtime-panel"></div>
          </section>
        `;
      },
      render(state) {
        const panel = document.getElementById('world-runtime-panel');
        if (!panel) return;

        const animals = state.entities.filter((entry) => entry.type === 'animal').length;
        const resources = state.entities.filter((entry) => entry.type === 'resource').length;

        panel.innerHTML = `
          <p><strong>Tick:</strong> ${state.tick}</p>
          <p><strong>Seed:</strong> ${state.seed}</p>
          <p><strong>Chunks:</strong> ${state.worldStats.chunks}</p>
          <p><strong>Animals:</strong> ${animals}</p>
          <p><strong>Resources:</strong> ${resources}</p>
          <p><strong>Player Hunger:</strong> ${state.player.hunger.toFixed(1)}</p>
          <p><strong>Wood/Food:</strong> ${state.resources.wood}/${state.resources.food}</p>
          <p><strong>Event:</strong> ${state.lastEvent || 'Stable exploration phase.'}</p>
        `;
      }
    };
  }

  global.VoxelWorldUi = {
    createUiRenderer
  };
})(window);
