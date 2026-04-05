(function (global) {
  'use strict';

  function renderWorkspace(selector, content) {
    const node = document.querySelector(selector || '[data-layout-workspace]');
    if (!node) return;
    node.innerHTML = `<section class="vd-layout-workspace">${content || '<p>Workspace module ready.</p>'}</section>`;
  }

  global.VDLayoutWorkspace = { render: renderWorkspace };
})(window);
