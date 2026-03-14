(function (global) {
  const CATEGORY_MAP = {
    creators: 'creators',
    coders: 'coders',
    researchers: 'researchers',
    operators: 'business',
    founders: 'business',
    students: 'education',
    gamers: 'games',
    engine: 'simulations',
    system: 'system',
    misc: 'misc'
  };

  const builtinTools = [
    {
      id: 'prompt-alchemy-main',
      name: 'PromptAlchemy (Main)',
      description: 'First-render prompt pack engine for creators.',
      category: 'creators',
      audience: ['creators', 'founders', 'operators'],
      inputs: ['platform', 'format', 'idea', 'brand'],
      outputs: ['prompt_pack'],
      relatedTools: ['promptalchemy', 'script-generator', 'spec-builder'],
      entry: 'prompt-alchemy/index.html',
      tags: ['legacy', 'main-tool', 'prompting']
    },
    {
      id: 'agent',
      name: 'Agent Builder',
      description: 'Design simple AI agents and workflows.',
      category: 'coders',
      audience: ['coders', 'operators'],
      inputs: ['task', 'constraints'],
      outputs: ['agent_workflow'],
      relatedTools: ['app-generator', 'spec-builder'],
      entry: 'agent/index.html',
      tags: ['legacy', 'workflow']
    },
    {
      id: 'app-generator',
      name: 'App Generator',
      description: 'Create lightweight tools and micro-apps.',
      category: 'coders',
      audience: ['coders', 'founders'],
      inputs: ['idea', 'features'],
      outputs: ['app_plan'],
      relatedTools: ['code-generator', 'code-reviewer'],
      entry: 'app-generator/index.html',
      tags: ['legacy', 'generation']
    },
    {
      id: 'interview-prep',
      name: 'Interview Prep',
      description: 'Prepare structured interview responses.',
      category: 'education',
      audience: ['students'],
      inputs: ['role', 'experience'],
      outputs: ['interview_answers'],
      relatedTools: ['spec-builder'],
      entry: 'interview-prep/index.html',
      tags: ['legacy', 'career']
    },
    {
      id: 'student-research',
      name: 'Student Research',
      description: 'Structure learning and research insights.',
      category: 'education',
      audience: ['students', 'researchers'],
      inputs: ['topic', 'sources'],
      outputs: ['research_summary'],
      relatedTools: ['multi-source-research-explained', 'export-studio'],
      entry: 'student-research/index.html',
      tags: ['legacy', 'research']
    },
    {
      id: 'decision-brief-guide',
      name: 'Decision Brief Guide',
      description: 'Convert analysis into concise decision briefs.',
      category: 'business',
      audience: ['operators', 'founders'],
      inputs: ['context', 'decision'],
      outputs: ['decision_brief'],
      relatedTools: ['spec-builder', 'export-studio'],
      entry: 'decision-brief-guide/index.html',
      tags: ['legacy', 'decision']
    },
    {
      id: 'multi-source-research-explained',
      name: 'Multi Source Research Explained',
      description: 'Synthesize findings from multiple sources.',
      category: 'researchers',
      audience: ['researchers', 'students'],
      inputs: ['question', 'sources'],
      outputs: ['synthesis'],
      relatedTools: ['student-research', 'export-studio'],
      entry: 'multi-source-research-explained/index.html',
      tags: ['legacy', 'research']
    },
    {
      id: 'sales-dashboard',
      name: 'Sales Dashboard',
      description: 'Track and review sales performance snapshots.',
      category: 'business',
      audience: ['operators', 'founders'],
      inputs: ['metrics'],
      outputs: ['dashboard_summary'],
      relatedTools: ['decision-brief-guide'],
      entry: 'sales-dashboard/index.html',
      tags: ['legacy', 'analytics']
    },
    {
      id: 'founder',
      name: 'Founder Narrative Builder',
      description: 'Build founder positioning and narrative assets.',
      category: 'business',
      audience: ['founders', 'creators'],
      inputs: ['story', 'offer'],
      outputs: ['founder_narrative'],
      relatedTools: ['prompt-alchemy-main', 'script-generator'],
      entry: 'founder/index.html',
      tags: ['legacy', 'positioning']
    },
    {
      id: 'wings-of-fire-quiz',
      name: 'Wings of Fire Quiz',
      description: 'Interactive quiz tool.',
      category: 'games',
      audience: ['students'],
      inputs: ['answers'],
      outputs: ['score'],
      relatedTools: [],
      entry: 'wings-of-fire-quiz/index.html',
      tags: ['legacy', 'quiz']
    }
  ];

  const importableToolDirs = [
    'tools/promptalchemy',
    'tools/script-generator',
    'tools/spec-builder',
    'tools/code-generator',
    'tools/code-reviewer',
    'tools/tool-router',
    'tools/export-studio',
    'tools/template-vault',
    'tools/idea-remixer',
    'tools/task-splitter',
    'tools/prompt-compare',
    'tools/repo-improvement-brief',
    'tools/workflow-template-gallery',
    'tools/tool-search-discovery',
    'tools/context-packager',
    'tools/output-evaluator',
    'tools/engine/player-signup',
    'tools/engine/orchard-profile-builder',
    'tools/engine/starter-farm-generator',
    'tools/engine/root-strength-calculator',
    'tools/engine/trunk-growth-calculator',
    'tools/engine/fruit-yield-engine',
    'tools/engine/daily-quest-generator',
    'tools/engine/weekly-harvest-engine',
    'tools/engine/thirty-day-promotion-engine',
    'tools/engine/fair-ranking-engine',
    'tools/engine/seed-exchange',
    'tools/engine/fruit-sharing',
    'tools/engine/circle-builder',
    'tools/engine/peer-validation-engine',
    'tools/engine/trust-score-engine',
    'tools/engine/recruiter-dashboard',
    'tools/engine/orchard-discovery-search',
    'tools/engine/hire-readiness-scorer',
    'tools/engine/four-direction-pipeline',
    'tools/engine/growth-path-recommender',
    'tools/engine/ai-coach-console',
    'tools/engine/simulation-runner',
    'tools/engine/seed-quality-scorer',
    'tools/engine/meta-health-dashboard',
    'tools/engine/synthetic-player-generator',
    'tools/engine/wave1-simulation-runner',
    'tools/engine/balance-dashboard'
  ];

  function repoBasePath() {
    const current = document.currentScript;
    if (!current || !current.src) return '';
    const marker = '/shared/tool-registry.js';
    const idx = current.src.indexOf(marker);
    if (idx === -1) return '';
    return current.src.slice(0, idx + 1);
  }

  const BASE = repoBasePath();

  function resolve(path) {
    if (!BASE) return path;
    return BASE + path;
  }

  function normalizeCategory(category) {
    return CATEGORY_MAP[category] || category || 'misc';
  }

  function normalizeTool(meta, fallbackDir) {
    const id = meta.id || (fallbackDir ? fallbackDir.split('/').pop() : 'unknown-tool');
    const category = normalizeCategory(meta.category);
    const defaultEntry = fallbackDir ? `${fallbackDir}/index.html` : '';
    return {
      id,
      name: meta.name || id,
      description: meta.description || '',
      category,
      audience: Array.isArray(meta.audience) ? meta.audience : [],
      inputs: Array.isArray(meta.inputs) ? meta.inputs : [],
      outputs: Array.isArray(meta.outputs) ? meta.outputs : [],
      relatedTools: Array.isArray(meta.relatedTools) ? meta.relatedTools : [],
      entry: meta.entry || defaultEntry,
      tags: Array.isArray(meta.tags) ? meta.tags : []
    };
  }

  function getBuiltinTools() {
    return builtinTools.map((tool) => normalizeTool(tool));
  }

  async function loadImportedTools() {
    const loaded = await Promise.all(
      importableToolDirs.map(async (dir) => {
        try {
          const response = await fetch(resolve(`${dir}/config.json`), { cache: 'no-cache' });
          if (!response.ok) return null;
          const meta = await response.json();
          return normalizeTool(meta, dir);
        } catch (error) {
          return null;
        }
      })
    );
    return loaded.filter(Boolean);
  }

  function getTools() {
    const ids = [
      ...builtinTools.map((tool) => tool.id),
      ...importableToolDirs.map((path) => path.split('/').pop())
    ];
    return Array.from(new Set(ids));
  }

  function isRegistered(id) {
    return getTools().includes(id);
  }

  async function loadAll() {
    const imported = await loadImportedTools();
    const merged = [...getBuiltinTools(), ...imported];
    const deduped = new Map();
    merged.forEach((tool) => deduped.set(tool.id, tool));
    return Array.from(deduped.values());
  }

  async function findById(id) {
    const all = await loadAll();
    return all.find((tool) => tool.id === id) || null;
  }

  global.ToolRegistry = {
    normalizeCategory,
    normalizeTool,
    getBuiltinTools,
    loadImportedTools,
    loadAll,
    findById,
    getTools,
    isRegistered
  };
})(window);
