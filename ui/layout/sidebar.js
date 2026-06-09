(function (global) {
  'use strict';

  function renderSidebar(selector, items) {
    const node = document.querySelector(selector || '[data-layout-sidebar]');
    if (!node) return;
    const links = (items || []).map((item) => `<a class="vd-side-link" href="${item.href}">${item.label}</a>`).join('');
    node.innerHTML = `<aside class="vd-layout-sidebar"><h2>Sections</h2>${links}</aside>`;
  }

  global.VDLayoutSidebar = { render: renderSidebar };
})(window);
