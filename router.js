(function (global) {
  'use strict';

  const navLinks = [...document.querySelectorAll('.nl[data-route], .nl[data-s]')];
  const sections = [...document.querySelectorAll('main section[id], section[id]')];
  const routeAliases = { researchers: 'research' };
  const legacyToolAliases = { 'prompt-alchemy': 'prompt-alchemy-main' };

  function canonicalRoute(id) {
    return routeAliases[id] || id;
  }

  function setActive(id) {
    const canonical = canonicalRoute(id);
    navLinks.forEach((link) => {
      const route = link.getAttribute('data-route') || link.getAttribute('data-s') || '';
      const active = canonicalRoute(route) === canonical;
      link.classList.toggle('on', active);
      link.classList.toggle('active', active);
    });
  }

  function goToRoute(id, { smooth = true, updateHash = true } = {}) {
    const target = document.getElementById(canonicalRoute(id));
    if (!target) return;
    if (updateHash) history.replaceState(null, '', `#${target.id}`);
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    setActive(target.id);
  }

  function normalizeDirectPathRef(ref) {
    if (!ref || !ref.includes('/')) return null;
    const normalized = ref.replace(/^\.\//, '').replace(/^\//, '');
    return normalized.endsWith('.html') ? normalized : `${normalized.replace(/\/+$/, '')}/index.html`;
  }

  async function resolveToolPath(toolRef) {
    const direct = normalizeDirectPathRef(toolRef);
    if (direct) return direct;
    if (!global.ToolRegistry?.findById) return null;
    const tool = await global.ToolRegistry.findById(legacyToolAliases[toolRef] || toolRef);
    return tool?.entry || null;
  }

  async function openToolFromQuery() {
    const toolRef = new URLSearchParams(global.location.search).get('tool');
    if (!toolRef) return;
    const resolved = await resolveToolPath(toolRef).catch(() => null);
    if (resolved) global.location.href = resolved;
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const route = link.getAttribute('data-route') || link.getAttribute('data-s');
      if (!route || !document.getElementById(canonicalRoute(route))) return;
      event.preventDefault();
      goToRoute(route);
    });
  });

  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const top = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (top) setActive(top.target.id);
    }, { rootMargin: '-30% 0px -50% 0px', threshold: [0.2, 0.45, 0.8] });
    sections.forEach((section) => observer.observe(section));
  }

  global.addEventListener('hashchange', () => {
    const hash = global.location.hash.replace('#', '');
    if (hash && document.getElementById(canonicalRoute(hash))) goToRoute(hash, { smooth: false, updateHash: false });
  });

  const initial = canonicalRoute(global.location.hash.replace('#', ''));
  if (initial && document.getElementById(initial)) setTimeout(() => goToRoute(initial, { smooth: false }), 50);
  else setActive('home');

  openToolFromQuery();

  global.Router = { resolveToolPath, normalizeDirectPathRef, goToRoute, canonicalRoute, legacyToolAliases };
})(window);
