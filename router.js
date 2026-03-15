(function (global) {
  'use strict';

  const navLinks = [...document.querySelectorAll('.nl[data-route]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const routeAliases = { research: 'researchers' };

  const canonicalRoute = (id) => routeAliases[id] || id;

  const legacyToolAliases = {
    'prompt-alchemy': 'prompt-alchemy-main'
  };

  /* ── Navigation helpers ── */

  const setActive = (id) => {
    const routeId = canonicalRoute(id);
    navLinks.forEach((link) => {
      link.classList.toggle('on', (link.getAttribute('data-route') || link.getAttribute('data-s')) === routeId);
    });
  };

  const goToRoute = (id, { smooth = true, updateHash = true } = {}) => {
    const canonicalId = canonicalRoute(id);
    const section = document.getElementById(canonicalId);
    if (!section) return;
    if (updateHash) history.replaceState(null, '', `#${canonicalId}`);
    section.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    setActive(canonicalId);
  };

  const routeFromHash = () => canonicalRoute(window.location.hash.replace('#', ''));

  const syncFromHash = () => {
    const route = routeFromHash();
    if (route && document.getElementById(route)) {
      goToRoute(route, { smooth: false, updateHash: false });
    } else {
      setActive('home');
    }
  };
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

  const normalizeDirectPathRef = (toolRef) => {
    if (!toolRef || !toolRef.includes('/')) return null;
    const normalized = toolRef.replace(/^\.\//, '').replace(/^\//, '');
    if (normalized.endsWith('.html')) return normalized;
    return `${normalized.replace(/\/+$/, '')}/index.html`;
  };
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

  const openToolFromQuery = async () => {
    const params = new URLSearchParams(window.location.search);
    const toolRef = params.get('tool');
    if (!toolRef) return;

    try {
      const resolved = await resolveToolPath(toolRef);
      if (resolved) {
        window.location.href = resolved;
        return;
      }
    } catch (_) {
      // ignore
    }

    const container = document.getElementById('all-grid') || document.querySelector('main');
    if (!container) return;

    const notice = document.createElement('div');
    notice.setAttribute('role', 'alert');
    notice.style.cssText = 'background:#1e1225;border:1px solid #7f1d1d;border-radius:10px;padding:16px 20px;margin:18px 0;color:#fca5a5;font-size:0.95rem;';
    notice.innerHTML = `<strong>Tool not found:</strong> <code>${toolRef.replace(/</g, '&lt;')}</code><br><span style="color:#94a3b8;font-size:0.85rem;">Check the tool ID and try again. Browse available tools below.</span>`;
    container.prepend(notice);
  };

  /* ── Event wiring ── */

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const route = link.getAttribute('data-route') || link.getAttribute('data-s');
      if (!route) return;
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

  window.addEventListener('hashchange', syncFromHash);

  // Initial load
  const initial = routeFromHash();
  if (initial && document.getElementById(initial)) {
    setTimeout(() => goToRoute(initial, { smooth: false }), 50);
  if (!global.location.hash || !global.location.hash.startsWith('#/')) {
    go('/', { replace: true });
  } else {
    mountRoute(currentRoutePath());
  }

  openToolFromQuery();

  globalThis.Router = { resolveToolPath, legacyToolAliases, canonicalRoute, routeAliases };
})();
  global.Router = { routes, go, normalizeRoute };
})(window);
