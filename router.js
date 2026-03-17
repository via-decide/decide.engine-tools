(() => {
  'use strict';

  const routeAliases = { research: 'researchers' };
  const canonicalRoute = (route = '') => routeAliases[route] || route;

  const toolPathStaticMap = {
    'context-packager': 'tools/context-packager/index.html',
    'spec-builder': 'tools/spec-builder/index.html',
    'code-generator': 'tools/code-generator/index.html',
    'code-reviewer': 'tools/code-reviewer/index.html',
    'output-evaluator': 'tools/output-evaluator/index.html',
    'task-splitter': 'tools/task-splitter/index.html'
  };

  const navLinks = [...document.querySelectorAll('.nl[data-s]')];
  const sections = [...document.querySelectorAll('main section[id]')];

  if (!navLinks.length || !sections.length) {
    window.Router = { canonicalRoute, routeAliases, toolPathStaticMap };
    return;
  }

  const setActive = (routeId) => {
    navLinks.forEach((link) => {
      link.classList.toggle('on', link.dataset.s === routeId);
    });
  };

  const goToRoute = (routeId, { smooth = true, updateHash = true } = {}) => {
    const id = canonicalRoute(routeId);
    const section = document.getElementById(id);
    if (!section) return;

    if (updateHash) {
      history.replaceState(null, '', `#${id}`);
    }

    section.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    setActive(id);
  };

  const routeFromHash = () => canonicalRoute(window.location.hash.replace(/^#/, ''));

  const syncFromHash = () => {
    const route = routeFromHash();
    if (route && document.getElementById(route)) {
      goToRoute(route, { smooth: false, updateHash: false });
      return;
    }
    setActive('home');
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      goToRoute(link.dataset.s);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, { threshold: 0.35 });

  sections.forEach((section) => observer.observe(section));

  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();

  window.Router = { canonicalRoute, routeAliases, goToRoute, syncFromHash, toolPathStaticMap };
})();

