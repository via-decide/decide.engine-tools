(function (global) {
  'use strict';

  function buildPalette() {
    const wrapper = document.createElement('div');
    wrapper.id = 'vd-command-palette';
    wrapper.className = 'vd-command-palette';
    wrapper.innerHTML = `
      <div class="vd-command-inner">
        <input id="vd-command-input" type="text" placeholder="Type a command..." />
        <div class="vd-command-list">
          <button data-href="./tools/index.html">Open Tool Catalog</button>
          <button data-action="simulation">Run Simulation</button>
          <button data-href="./agent/index.html">Start Agent</button>
          <button data-href="./workspace/index.html">Open Workspace</button>
        </div>
      </div>`;
    document.body.appendChild(wrapper);

    wrapper.addEventListener('click', (event) => {
      if (event.target === wrapper) wrapper.classList.remove('open');
      if (event.target.matches('button[data-href]')) {
        window.location.href = event.target.getAttribute('data-href');
      }
      if (event.target.matches('button[data-action="simulation"]')) {
        alert('Simulation queue initialized.');
      }
    });
  }

  function initCommandPalette() {
    if (document.getElementById('vd-command-palette')) return;
    buildPalette();

    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const palette = document.getElementById('vd-command-palette');
        palette.classList.toggle('open');
        if (palette.classList.contains('open')) {
          document.getElementById('vd-command-input')?.focus();
        }
      }
      if (event.key === 'Escape') {
        document.getElementById('vd-command-palette')?.classList.remove('open');
      }
    });
  }

  global.VDCommandPalette = { init: initCommandPalette };
})(window);
