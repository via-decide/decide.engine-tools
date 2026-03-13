(() => {
  const navLinks = [...document.querySelectorAll('[data-route]')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const legacyToolPathMap = {
    promptalchemy: 'tools/promptalchemy/index.html',
    'script-generator': 'tools/script-generator/index.html',
    'spec-builder': 'tools/spec-builder/index.html',
    'code-generator': 'tools/code-generator/index.html',
    'code-reviewer': 'tools/code-reviewer/index.html',
    'tool-router': 'tools/tool-router/index.html',
    'export-studio': 'tools/export-studio/index.html',
    'template-vault': 'tools/template-vault/index.html'
  };

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const route = link.getAttribute('data-route');
      link.classList.toggle('active', route === id);
    });
  };

  const goToRoute = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    history.replaceState(null, '', `#${id}`);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

  const resolveToolPath = (toolRef) => {
    if (!toolRef) return null;
    if (toolRef.includes('/')) {
      return toolRef.endsWith('.html') ? toolRef : `${toolRef}/index.html`;
    }

    if (legacyToolPathMap[toolRef]) return legacyToolPathMap[toolRef];

    if (globalThis.ToolRegistry && typeof globalThis.ToolRegistry.findById === 'function') {
      return globalThis.ToolRegistry.findById(toolRef).then((tool) => tool?.entry || null);
    }

    return null;
  };

  const openToolFromQuery = async () => {
    const params = new URLSearchParams(window.location.search);
    const toolRef = params.get('tool');
    if (!toolRef) return;

    const resolved = await resolveToolPath(toolRef);
    if (!resolved) return;

    window.location.href = resolved;
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const route = link.getAttribute('data-route');
      if (!route) return;
      event.preventDefault();
      goToRoute(route);
    });
  });

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

  const initial = window.location.hash.replace('#', '');
  if (initial && document.getElementById(initial)) {
    setTimeout(() => goToRoute(initial), 50);
  } else {
    setActive('home');
  }

  openToolFromQuery();
})();
