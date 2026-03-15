(() => {
  'use strict';

  const navLinks = [...document.querySelectorAll('.nl[data-route], .nl[data-s]')];
  const sections = [...document.querySelectorAll('main section[id], section[id]')];
  const routeAliases = { researchers: 'research' };
  const legacyToolAliases = { 'prompt-alchemy': 'prompt-alchemy-main' };

  const canonicalRoute = (id) => routeAliases[id] || id;

  function setActive(id) {
    const canonical = canonicalRoute(id);
    navLinks.forEach((link) => {
      const route = link.getAttribute('data-route') || link.getAttribute('data-s') || '';
      link.classList.toggle('on', canonicalRoute(route) === canonical);
      link.classList.toggle('active', canonicalRoute(route) === canonical);
    });
  }

  function goToRoute(id, { smooth = true, updateHash = true } = {}) {
    const canonical = canonicalRoute(id);
    const section = document.getElementById(canonical);
    if (!section) return;
    if (updateHash) history.replaceState(null, '', `#${canonical}`);
    section.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    setActive(canonical);
  }

  function normalizeDirectPathRef(toolRef) {
    if (!toolRef || !toolRef.includes('/')) return null;
    const normalized = toolRef.replace(/^\.\//, '').replace(/^\//, '');
    return normalized.endsWith('.html') ? normalized : `${normalized.replace(/\/+$/, '')}/index.html`;
  }

  async function resolveToolPath(toolRef) {
    if (!toolRef) return null;
    const directPath = normalizeDirectPathRef(toolRef);
    if (directPath) return directPath;

    if (globalThis.ToolRegistry?.findById) {
      const canonicalId = legacyToolAliases[toolRef] || toolRef;
      const tool = await globalThis.ToolRegistry.findById(canonicalId);
      return tool?.entry || null;
    }

    return null;
  }

  async function openToolFromQuery() {
    const toolRef = new URLSearchParams(window.location.search).get('tool');
    if (!toolRef) return;

    const resolved = await resolveToolPath(toolRef).catch(() => null);
    if (resolved) {
      window.location.href = resolved;
      return;
    }

    const host = document.getElementById('categorized-tools') || document.querySelector('main') || document.body;
    const notice = document.createElement('div');
    notice.setAttribute('role', 'alert');
    notice.className = 'tool-route-warning';
    notice.style.cssText = 'background:#1e1225;border:1px solid #7f1d1d;border-radius:10px;padding:16px 20px;margin:18px 0;color:#fca5a5;font-size:0.95rem;';
    notice.innerHTML = `<strong>Tool not found:</strong> <code>${toolRef.replace(/</g, '&lt;')}</code>`;
    host.prepend(notice);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const route = link.getAttribute('data-route') || link.getAttribute('data-s');
      if (!route) return;
      if (!document.getElementById(canonicalRoute(route))) return;
      event.preventDefault();
      goToRoute(route);
    });
  });

  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-30% 0px -50% 0px', threshold: [0.2, 0.45, 0.8] });

    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const canonical = canonicalRoute(hash);
    if (!document.getElementById(canonical)) return;
    goToRoute(canonical, { smooth: false, updateHash: false });
  });

  const initial = canonicalRoute(window.location.hash.replace('#', ''));
  if (initial && document.getElementById(initial)) {
    setTimeout(() => goToRoute(initial, { smooth: false }), 50);
  } else {
    setActive('home');
  }

  openToolFromQuery();

  globalThis.Router = { resolveToolPath, legacyToolAliases, normalizeDirectPathRef, goToRoute, canonicalRoute };
})();
