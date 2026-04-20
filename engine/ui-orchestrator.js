(function (global) {
  'use strict';

  function getHost() {
    return document.getElementById('engine-game-host');
  }

  function clearHost() {
    const host = getHost();
    if (host) host.innerHTML = '';
    return host;
  }

  function mountGameUi(module) {
    const host = clearHost();
    if (!host || !module || !module.ui || typeof module.ui.mount !== 'function') return;
    module.ui.mount(host);
  }

  function updateStatus(message) {
    const status = document.getElementById('engine-status');
    if (!status) return;
    status.textContent = message || 'Idle';
  }

  global.UiOrchestrator = {
    mountGameUi,
    updateStatus,
    clearHost
  };
})(window);
