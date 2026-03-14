(() => {
  'use strict';

  const navLinks = [...document.querySelectorAll('.nl[data-route]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const routeAliases = { researchers: 'research' };

  const routeAliases = {
    researchers: 'research'
  };

  const canonicalRoute = (id) => routeAliases[id] || id;

  const legacyToolAliases = {
    'prompt-alchemy': 'prompt-alchemy-main'
  };

  /* ── Navigation helpers ── */

  const normalizeRoute = (id) => routeAliases[id] || id;

  const setActive = (id) => {
    const routeId = normalizeRoute(id);
    navLinks.forEach((link) => {
      link.classList.toggle('on', link.getAttribute('data-route') === routeId);
    });
  };

  const goToRoute = (id) => {
    const routeId = normalizeRoute(id);
    const section = document.getElementById(routeId);
    if (!section) return;
    history.replaceState(null, '', `#${routeId}`);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(routeId);
  };

  const routeFromHash = () => normalizeRoute(window.location.hash.replace('#', ''));

  const syncFromHash = () => {
    const route = routeFromHash();
    if (route && document.getElementById(route)) {
      goToRoute(route);
      return;
    }
    setActive('home');
    const canonicalId = canonicalRoute(id);
    navLinks.forEach((link) => {
      link.classList.toggle('active', canonicalRoute(link.getAttribute('data-route')) === canonicalId);
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

  /* ── Tool path resolution ── */

  const normalizeDirectPathRef = (toolRef) => {
    if (!toolRef || !toolRef.includes('/')) return null;

    const normalized = toolRef.replace(/^\.\//, '').replace(/^\//, '');
    if (normalized.endsWith('.html')) return normalized;
    return `${normalized.replace(/\/+$/, '')}/index.html`;
  };

  const resolveToolPath = async (toolRef) => {
    if (!toolRef) return null;

    const directPath = normalizeDirectPathRef(toolRef);
    if (directPath) return directPath;

    if (globalThis.ToolRegistry && typeof globalThis.ToolRegistry.findById === 'function') {
      const canonicalId = legacyToolAliases[toolRef] || toolRef;
      const tool = await globalThis.ToolRegistry.findById(canonicalId);
      return tool?.entry || null;
    }

    return null;
  };

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
      // fall through
    }

    const container = document.getElementById('categorized-tools') || document.querySelector('main');
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
      const route = link.getAttribute('data-route');
      if (!route) return;
      event.preventDefault();
      goToRoute(route);
    });
  });

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: [0.2, 0.5, 0.8]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener('hashchange', syncFromHash);

  const initial = routeFromHash();
  if (initial && document.getElementById(initial)) {
    setTimeout(() => goToRoute(initial), 50);
  const initial = window.location.hash.replace('#', '');
  const canonicalInitial = canonicalRoute(initial);
  if (canonicalInitial && document.getElementById(canonicalInitial)) {
    setTimeout(() => goToRoute(canonicalInitial, { smooth: false }), 50);
  } else {
    setActive('home');
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const canonicalHash = canonicalRoute(hash);
    if (!document.getElementById(canonicalHash)) return;
    goToRoute(canonicalHash, { smooth: false, updateHash: false });
  });

  openToolFromQuery();

  globalThis.Router = { resolveToolPath, legacyToolAliases, normalizeDirectPathRef };
  globalThis.Router = { resolveToolPath, allToolPaths, canonicalRoute, routeAliases };
})();
