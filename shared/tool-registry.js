(function (global) {
  'use strict';

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

  const ENGINE_TOOL_IDS = new Set([
    'engine-state-manager',
    'llm-action-parser',
    'daily-weather-replenisher',
    'admin-moderation-panel',
    'simulation-runner',
    'player-signup',
    'orchard-profile-builder',
    'root-strength-calculator',
    'trunk-growth-calculator',
    'fruit-yield-engine',
    'daily-quest-generator',
    'weekly-harvest-engine',
    'thirty-day-promotion-engine',
    'fair-ranking-engine',
    'seed-exchange',
    'fruit-sharing',
    'circle-builder',
    'peer-validation-engine',
    'trust-score-engine',
    'recruiter-dashboard',
    'orchard-discovery-search',
    'hire-readiness-scorer',
    'four-direction-pipeline',
    'growth-path-recommender',
    'ai-coach-console',
    'seed-quality-scorer',
    'meta-health-dashboard',
    'synthetic-player-generator',
    'wave1-simulation-runner',
    'balance-dashboard',
    'growth-milestone-engine'
  ]);

  // Per-tool overrides — used by the hub to surface player-facing metadata
  const TOOL_OVERRIDES = {
    'starter-farm-generator': {
      isEngineTool: false,
      featured: true,
      category: 'engine',
      gameIcon: '🌱',
      gameDescription: 'Initialize your farm identity and start your orchard run.',
      entry: 'tools/engine/starter-farm-generator/index.html'
    },
    'orchard-profile-builder': {
      isEngineTool: false,
      category: 'engine',
      gameIcon: '🪪',
      gameDescription: 'Shape your orchard profile, role, and growth direction.',
      entry: 'tools/engine/orchard-profile-builder/index.html'
    },
    'daily-quest-generator': {
      isEngineTool: false,
      category: 'engine',
      gameIcon: '📜',
      gameDescription: 'Generate your daily quest loop and actionable growth tasks.'
    },
    'weekly-harvest-engine': {
      isEngineTool: false,
      category: 'engine',
      gameIcon: '🧺',
      gameDescription: 'Convert your weekly actions into measurable harvest outcomes.'
    },
    'seed-exchange': {
      isEngineTool: false,
      category: 'engine',
      gameIcon: '🛒',
      gameDescription: 'Trade seeds and unlock better orchard opportunities.'
    },
    'growth-milestone-engine': {
      isEngineTool: false,
      category: 'engine',
      gameIcon: '📈',
      gameDescription: 'Track root strength, manage pests, and evolve your tree.'
    }
  };

  function inferEngineTool(meta, normalizedCategory, defaultEntry, id) {
    if (typeof meta.isEngineTool === 'boolean') return meta.isEngineTool;
    if (typeof meta.hidden === 'boolean') return meta.hidden;

    if (ENGINE_TOOL_IDS.has(id)) return true;
    if (normalizedCategory === 'simulations' || normalizedCategory === 'system') return true;
    const entry = (meta.entry || defaultEntry || '').toLowerCase();
    return entry.startsWith('tools/engine/');
  }

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
    'tools/promptalchemy', 'tools/script-generator', 'tools/spec-builder',
    'tools/code-generator', 'tools/code-reviewer', 'tools/tool-router',
    'tools/export-studio', 'tools/template-vault', 'tools/idea-remixer',
    'tools/task-splitter', 'tools/prompt-compare', 'tools/repo-improvement-brief',
    'tools/workflow-template-gallery', 'tools/tool-search-discovery',
    'tools/context-packager', 'tools/output-evaluator',
    'tools/engine/player-signup', 'tools/engine/orchard-profile-builder',
    'tools/engine/starter-farm-generator', 'tools/engine/root-strength-calculator',
    'tools/engine/trunk-growth-calculator', 'tools/engine/fruit-yield-engine',
    'tools/engine/daily-quest-generator', 'tools/engine/weekly-harvest-engine',
    'tools/engine/thirty-day-promotion-engine', 'tools/engine/fair-ranking-engine',
    'tools/engine/seed-exchange', 'tools/engine/fruit-sharing',
    'tools/engine/circle-builder', 'tools/engine/peer-validation-engine',
    'tools/engine/trust-score-engine', 'tools/engine/recruiter-dashboard',
    'tools/engine/orchard-discovery-search', 'tools/engine/hire-readiness-scorer',
    'tools/engine/four-direction-pipeline', 'tools/engine/growth-path-recommender',
    'tools/engine/ai-coach-console', 'tools/engine/simulation-runner',
    'tools/engine/seed-quality-scorer', 'tools/engine/meta-health-dashboard',
    'tools/engine/synthetic-player-generator', 'tools/engine/wave1-simulation-runner',
    'tools/engine/balance-dashboard', 'tools/engine/growth-milestone-engine',
    'tools/games/hex-wars', 'tools/games/wings-of-fire-quiz',
    'tools/engine/script-generator-files', 'tools/engine/layer1-swipe-crucible',
    'tools/ai-tool-generator'
  ];

  function fallbackManifestEntries() {
    return importableToolDirs.map((dir) => ({
      toolDir: dir,
      metaPath: `${dir}/config.json`
    }));
  }

  function repoBasePath() {
    const current = document.currentScript;
    if (!current || !current.src) return '';
    const marker = '/shared/tool-registry.js';
    const idx = current.src.indexOf(marker);
    if (idx === -1) return '';
    return current.src.slice(0, idx + 1);
  }

  const BASE = repoBasePath();
  const PLUGIN_STORAGE_KEY = 'viadecide.tool-registry.plugins';

  function resolve(path) {
    if (!BASE) return path;
    return BASE + path;
  }

  function normalizeCategory(category) {
    return CATEGORY_MAP[category] || category || 'misc';
  }

  function normalizeTool(meta, fallbackDir) {
    const id = meta.id || (fallbackDir ? fallbackDir.split('/').pop() : 'unknown-tool');
    const normalizedCategory = normalizeCategory(meta.category);
    const defaultEntry = fallbackDir ? `${fallbackDir}/index.html` : '';
    const override = TOOL_OVERRIDES[id] || {};
    const category = override.category || normalizedCategory;
    const isEngineTool = (typeof override.isEngineTool === 'boolean')
      ? override.isEngineTool
      : inferEngineTool(meta, normalizedCategory, defaultEntry, id);

    return {
      id,
      name: meta.name || id,
      description: meta.description || '',
      category,
      isEngineTool,
      featured: (typeof override.featured === 'boolean') ? override.featured : !!meta.featured,
      gameIcon: override.gameIcon || meta.gameIcon || '',
      gameDescription: override.gameDescription || meta.gameDescription || '',
      audience: Array.isArray(meta.audience) ? meta.audience : [],
      inputs: Array.isArray(meta.inputs) ? meta.inputs : [],
      outputs: Array.isArray(meta.outputs) ? meta.outputs : [],
      relatedTools: Array.isArray(meta.relatedTools) ? meta.relatedTools : [],
      entry: override.entry || meta.entry || defaultEntry,
      tags: Array.isArray(meta.tags) ? meta.tags : []
    };
  }

  function getBuiltinTools() {
    return builtinTools.map((tool) => normalizeTool(tool));
  }

  async function loadManifestEntries() {
    try {
      const response = await fetch(resolve('tools-manifest.json'), { cache: 'no-cache' });
      if (!response.ok) return fallbackManifestEntries();

      const manifest = await response.json();
      if (!manifest || !Array.isArray(manifest.entries)) return fallbackManifestEntries();

      return manifest.entries
        .map((entry) => {
          if (!entry || typeof entry !== 'object') return null;
          const toolDir = typeof entry.toolDir === 'string' ? entry.toolDir : '';
          const metaPath = typeof entry.metaPath === 'string' ? entry.metaPath : '';
          if (!toolDir || !metaPath) return null;
          return { toolDir, metaPath };
        })
        .filter(Boolean);
    } catch (_) {
      return fallbackManifestEntries();
    }
  }

  async function loadImportedTools() {
    const manifestEntries = await loadManifestEntries();
    const loaded = await Promise.all(
      manifestEntries.map(async ({ toolDir, metaPath }) => {
        try {
          const response = await fetch(resolve(metaPath), { cache: 'no-cache' });
          if (!response.ok) return null;
          const meta = await response.json();
          return normalizeTool(meta, toolDir);
        } catch (_) {
          return null;
        }
      })
    );
    return loaded.filter(Boolean);
  }



  const pluginTools = [];



  function loadPersistedPlugins() {
    try {
      const raw = localStorage.getItem(PLUGIN_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function persistPlugins() {
    try {
      localStorage.setItem(PLUGIN_STORAGE_KEY, JSON.stringify(pluginTools));
      return true;
    } catch (_) {
      return false;
    }
  }

  function registerPlugin(pluginMeta) {
    if (!pluginMeta || typeof pluginMeta !== 'object') return null;
    const normalized = normalizeTool(pluginMeta, pluginMeta.toolDir || 'tools/plugin');
    const index = pluginTools.findIndex((tool) => tool.id === normalized.id);
    if (index >= 0) pluginTools[index] = normalized;
    else pluginTools.push(normalized);
    persistPlugins();
    return normalized;
  }

  function registerPlugins(plugins) {
    if (!Array.isArray(plugins)) return [];
    return plugins.map(registerPlugin).filter(Boolean);
  }

  async function getCategories() {
    const all = await loadAll();
    return Array.from(new Set(all.map((tool) => tool.category))).sort();
  }

  async function getGraph() {
    const tools = await loadAll();
    if (window.ToolIntelligenceEngine && typeof window.ToolIntelligenceEngine.analyze === 'function') {
      const graph = window.ToolIntelligenceEngine.analyze(tools);
      return { ...graph, tools };
    }

    const byId = new Set(tools.map((tool) => tool.id));
    const nodes = tools.map((tool) => ({ id: tool.id, label: tool.name, category: tool.category }));
    const edges = [];
    tools.forEach((tool) => {
      (tool.relatedTools || []).forEach((targetId) => {
        if (!byId.has(targetId)) return;
        edges.push({ from: tool.id, to: targetId, relation: 'related' });
      });
    });
    return { nodes, edges, tools };
  }

  function getTools() {
    const ids = [
      ...builtinTools.map((t) => t.id),
      ...importableToolDirs.map((p) => p.split('/').pop())
    ];
    return Array.from(new Set(ids));
  }

  function isRegistered(id) {
    return getTools().includes(id);
  }

  async function loadAll() {
    if (pluginTools.length === 0) registerPlugins(loadPersistedPlugins());
    if (Array.isArray(window.TOOL_REGISTRY_PLUGINS)) registerPlugins(window.TOOL_REGISTRY_PLUGINS);
    const imported = await loadImportedTools();
    const merged = [...getBuiltinTools(), ...imported, ...pluginTools];
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
    isRegistered,
    registerPlugin,
    registerPlugins,
    getCategories,
    getGraph
  };

})(window);
