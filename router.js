(() => {
  'use strict';

  /* ── Navigation (scroll-based sections on index.html) ── */
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
      link.classList.toggle('active', link.getAttribute('data-route') === id);
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
  /* ── Complete tool path map ── */
  /* Root-level standalone tools */
  const rootTools = {
    'agent':                             'agent/index.html',
    'app-generator':                     'app-generator/index.html',
    'decision-brief-guide':              'decision-brief-guide/index.html',
    'founder':                           'founder/index.html',
    'interview-prep':                    'interview-prep/index.html',
    'multi-source-research-explained':   'multi-source-research-explained/index.html',
    'prompt-alchemy-main':               'prompt-alchemy/index.html',
    'prompt-alchemy':                    'prompt-alchemy/index.html',
    'sales-dashboard':                   'sales-dashboard/index.html',
    'student-research':                  'student-research/index.html',
    'wings-of-fire-quiz':                'wings-of-fire-quiz/index.html'
  };

  /* Modular tools under tools/ */
  const modularTools = {
    'promptalchemy':                     'tools/promptalchemy/index.html',
    'script-generator':                  'tools/script-generator/index.html',
    'spec-builder':                      'tools/spec-builder/index.html',
    'code-generator':                    'tools/code-generator/index.html',
    'code-reviewer':                     'tools/code-reviewer/index.html',
    'tool-router':                       'tools/tool-router/index.html',
    'export-studio':                     'tools/export-studio/index.html',
    'template-vault':                    'tools/template-vault/index.html'
  };

  /* Engine tools under tools/engine/ */
  const engineTools = {
    'player-signup':                     'tools/engine/player-signup/index.html',
    'orchard-profile-builder':           'tools/engine/orchard-profile-builder/index.html',
    'starter-farm-generator':            'tools/engine/starter-farm-generator/index.html',
    'root-strength-calculator':          'tools/engine/root-strength-calculator/index.html',
    'trunk-growth-calculator':           'tools/engine/trunk-growth-calculator/index.html',
    'fruit-yield-engine':                'tools/engine/fruit-yield-engine/index.html',
    'daily-quest-generator':             'tools/engine/daily-quest-generator/index.html',
    'weekly-harvest-engine':             'tools/engine/weekly-harvest-engine/index.html',
    'thirty-day-promotion-engine':       'tools/engine/thirty-day-promotion-engine/index.html',
    'fair-ranking-engine':               'tools/engine/fair-ranking-engine/index.html',
    'seed-exchange':                     'tools/engine/seed-exchange/index.html',
    'fruit-sharing':                     'tools/engine/fruit-sharing/index.html',
    'circle-builder':                    'tools/engine/circle-builder/index.html',
    'peer-validation-engine':            'tools/engine/peer-validation-engine/index.html',
    'trust-score-engine':                'tools/engine/trust-score-engine/index.html',
    'recruiter-dashboard':               'tools/engine/recruiter-dashboard/index.html',
    'orchard-discovery-search':          'tools/engine/orchard-discovery-search/index.html',
    'hire-readiness-scorer':             'tools/engine/hire-readiness-scorer/index.html',
    'four-direction-pipeline':           'tools/engine/four-direction-pipeline/index.html',
    'growth-path-recommender':           'tools/engine/growth-path-recommender/index.html',
    'ai-coach-console':                  'tools/engine/ai-coach-console/index.html',
    'simulation-runner':                 'tools/engine/simulation-runner/index.html',
    'meta-health-dashboard':             'tools/engine/meta-health-dashboard/index.html',
    'synthetic-player-generator':        'tools/engine/synthetic-player-generator/index.html',
    'wave1-simulation-runner':           'tools/engine/wave1-simulation-runner/index.html',
    'balance-dashboard':                 'tools/engine/balance-dashboard/index.html'
  };

  /* Merged lookup table */
  const allToolPaths = Object.assign({}, rootTools, modularTools, engineTools);

  /* ── Tool path resolution ── */
  const resolveToolPath = (toolRef) => {
    if (!toolRef) return null;

    /* Direct path: if it contains a slash, treat as literal path */
    if (toolRef.includes('/')) {
      return toolRef.endsWith('.html') ? toolRef : `${toolRef}/index.html`;
    }

    if (legacyToolPathMap[toolRef]) return legacyToolPathMap[toolRef];

    /* Exact match in static map */
    if (allToolPaths[toolRef]) return allToolPaths[toolRef];

    /* Async fallback to registry */
    if (globalThis.ToolRegistry && typeof globalThis.ToolRegistry.findById === 'function') {
      return globalThis.ToolRegistry.findById(toolRef).then((tool) => tool?.entry || null);
    }

    return null;
  };

  /* ── Deep-link handler: ?tool=id ── */
  const openToolFromQuery = async () => {
    const params = new URLSearchParams(window.location.search);
    const toolRef = params.get('tool');
    if (!toolRef) return;

    const resolved = await resolveToolPath(toolRef);
    if (!resolved) return;

    window.location.href = resolved;
  };

    try {
      const resolved = await resolveToolPath(toolRef);
      if (resolved) {
        window.location.href = resolved;
        return;
      }
    } catch (e) {
      /* fall through to error display */
    }

    /* Tool not found — show inline error instead of silent fail */
    const container = document.getElementById('categorized-tools') || document.querySelector('main');
    if (container) {
      const notice = document.createElement('div');
      notice.setAttribute('role', 'alert');
      notice.style.cssText = 'background:#1e1225;border:1px solid #7f1d1d;border-radius:10px;padding:16px 20px;margin:18px 0;color:#fca5a5;font-size:0.95rem;';
      notice.innerHTML = `<strong>Tool not found:</strong> <code>${toolRef.replace(/</g, '&lt;')}</code><br><span style="color:#94a3b8;font-size:0.85rem;">Check the tool ID and try again. Browse available tools below.</span>`;
      container.prepend(notice);
    }
  };

  /* ── Section navigation listeners ── */
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
  /* ── Scroll spy ── */
  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.2, 0.5, 0.8] }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ── Initial state ── */
  const initial = window.location.hash.replace('#', '');
  if (initial && document.getElementById(initial)) {
    setTimeout(() => goToRoute(initial), 50);
  } else {
    setActive('home');
  }

  openToolFromQuery();
  /* ── Process ?tool= query ── */
  openToolFromQuery();

  /* ── Expose for external use ── */
  globalThis.Router = { resolveToolPath, allToolPaths };
})();
