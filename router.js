(function (global) {
  'use strict';

  const BASE_PATH = '/decide.engine-tools';
  const routes = {
    '/': { id: 'dashboard', title: 'Dashboard', view: './ui/studyos.html' },
    '/studyos': { id: 'studyos', title: 'StudyOS', view: './ui/studyos.html' },
    '/tools': { id: 'tool-graph', title: 'Tool Graph', view: './ui/tool-graph.html' },
    '/workflow': { id: 'workflow-builder', title: 'Workflow Builder', view: './ui/workflow-builder.html' }
  };

  const outlet = document.getElementById('app-outlet');
  const routeTitle = document.getElementById('route-title');
  const navLinks = Array.from(document.querySelectorAll('[data-route]'));

  function normalizeRoute(inputPath) {
    if (!inputPath) return '/';
    let path = inputPath;

    if (path.startsWith(BASE_PATH)) {
      path = path.slice(BASE_PATH.length) || '/';
    }

    if (path.startsWith('/#')) {
      path = path.replace('/#', '');
    }

    if (path.startsWith('#')) {
      path = path.slice(1);
    }

    if (!path.startsWith('/')) {
      path = `/${path}`;
    }

    return routes[path] ? path : '/';
  }

  function currentRoutePath() {
    if (global.location.hash && global.location.hash.startsWith('#/')) {
      return normalizeRoute(global.location.hash.slice(1));
    }

    return normalizeRoute('/');
  }

  function setActiveNav(path) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.route === path);
    });
  }

  function mountRoute(path) {
    const route = routes[path] || routes['/'];
    routeTitle.textContent = route.title;
    setActiveNav(path);
    outlet.innerHTML = global.Components.frame(route.view, `${route.title} view`);
  }

  function go(path, { replace = false } = {}) {
    const normalized = normalizeRoute(path);
    const historyPath = `${BASE_PATH}/#${normalized}`;

    if (replace) {
      global.history.replaceState({ path: normalized }, '', historyPath);
    } else {
      global.history.pushState({ path: normalized }, '', historyPath);
    }

    mountRoute(normalized);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      go(link.dataset.route);
    });
  });

  global.addEventListener('popstate', () => mountRoute(currentRoutePath()));
  global.addEventListener('hashchange', () => mountRoute(currentRoutePath()));

  if (!global.location.hash || !global.location.hash.startsWith('#/')) {
    go('/', { replace: true });
  } else {
    mountRoute(currentRoutePath());
  }

  global.Router = { routes, go, normalizeRoute };
})(window);
