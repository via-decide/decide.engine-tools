(function (global) {
  'use strict';

  function resolvePrefix() {
    const depth = Math.max(0, (window.location.pathname.match(/\//g) || []).length - 2);
    if (depth === 0) return './';
    return '../'.repeat(depth);
  }

  function navItems(prefix) {
    return [
      { label: 'Home', href: `${prefix}index.html` },
      { label: 'Workspace', href: `${prefix}workspace/index.html` },
      { label: 'StudyOS', href: `${prefix}ui/studyos.html` },
      { label: 'Tools', href: `${prefix}tools/index.html` },
      { label: 'Agent', href: `${prefix}agent/index.html` },
      { label: 'Docs', href: 'https://github.com/via-decide/decide.engine-tools' }
    ];
  }

  function renderNavbar(containerSelector) {
    const host = document.querySelector(containerSelector || '[data-vd-navbar]');
    if (!host) return;
    const prefix = resolvePrefix();
    const links = navItems(prefix)
      .map((item) => `<a class="vd-nav-link" href="${item.href}">${item.label}</a>`)
      .join('');

    host.innerHTML = `<nav class="vd-navbar"><div class="vd-navbar-inner"><a class="vd-brand" href="${prefix}dashboard/index.html">Decide Engine</a><div class="vd-nav-links">${links}</div></div></nav>`;
  }

  global.VDNavbar = { render: renderNavbar };
})(window);
