(function (global) {
  'use strict';

  function renderHeader(selector, title) {
    const node = document.querySelector(selector || '[data-layout-header]');
    if (!node) return;
    node.innerHTML = `<header class="vd-layout-header"><h1>${title || 'Decide Engine Dashboard'}</h1><p>Unified modules for decisions, simulations, and agent workflows.</p></header>`;
  }

  global.VDLayoutHeader = { render: renderHeader };
})(window);
