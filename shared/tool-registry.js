(function (global) {
  'use strict';

  const ROOT_TOOL_DIRS = [
    'prompt-alchemy',
    'app-generator',
    'interview-prep',
    'student-research',
    'decision-brief-guide',
    'sales-dashboard',
    'founder',
    'wings-of-fire-quiz',
    'workflow-builder',
    'tool-graph'
  ];

  const CATEGORY_ALIASES = {
    operators: 'business',
    founders: 'business',
    students: 'education',
    engine: 'simulations'
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
  const DEFAULT_CATEGORY = 'misc';

  function resolveBase() {
    const script = document.currentScript;
    if (!script || !script.src) return '';
    const marker = '/shared/tool-registry.js';
    const idx = script.src.indexOf(marker);
    return idx === -1 ? '' : script.src.slice(0, idx + 1);
  }

  const BASE = repoBasePath();
  const PLUGIN_STORAGE_KEY = 'viadecide.tool-registry.plugins';

  function resolve(path) {
    if (!BASE) return path;
    return BASE + path;
  }
  const BASE = resolveBase();
  const abs = (path) => (BASE ? `${BASE}${path}` : path);

  function normalizeCategory(category) {
    const raw = String(category || '').trim();
    return CATEGORY_ALIASES[raw] || raw || DEFAULT_CATEGORY;
  }

  function normalizeTool(meta, toolDir) {
    const id = String(meta.id || toolDir.split('/').pop() || 'unknown').trim();
    const category = normalizeCategory(meta.category);
    const entry = String(meta.entry || `${toolDir}/index.html`).replace(/^\.\//, '');

    return {
      id,
      name: meta.name || id,
      description: meta.description || '',
      category,
      audience: Array.isArray(meta.audience) ? meta.audience : [],
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      inputs: Array.isArray(meta.inputs) ? meta.inputs : [],
      outputs: Array.isArray(meta.outputs) ? meta.outputs : [],
      relatedTools: Array.isArray(meta.relatedTools) ? meta.relatedTools : [],
      featured: Boolean(meta.featured),
      isEngineTool: category === 'simulations' || entry.startsWith('tools/engine/'),
      entry
    };
  }

  async function loadManifest() {
    try {
      const res = await fetch(abs('tools-manifest.json'), { cache: 'no-cache' });
      if (!res.ok) throw new Error('manifest unavailable');
      const payload = await res.json();
      return Array.isArray(payload.entries) ? payload.entries : [];
    } catch (_error) {
      return [];
    }
  }

  async function loadToolMeta({ toolDir, metaPath }) {
    try {
      const res = await fetch(abs(metaPath), { cache: 'no-cache' });
      if (!res.ok) return null;
      return normalizeTool(await res.json(), toolDir);
    } catch (_error) {
      return null;
    }
  }

  async function loadRootTools() {
    const roots = ROOT_TOOL_DIRS.map((dir) => ({ toolDir: dir, metaPath: `${dir}/config.json` }));
    const loaded = await Promise.all(roots.map(loadToolMeta));
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
  async function loadAll() {
    const [manifestEntries, rootTools] = await Promise.all([loadManifest(), loadRootTools()]);
    const loadedManifest = await Promise.all(manifestEntries.map(loadToolMeta));

    const combined = [...loadedManifest.filter(Boolean), ...rootTools];
    const deduped = new Map();
    combined.forEach((tool) => deduped.set(tool.id, tool));

    return Array.from(deduped.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async function findById(id) {
    const tools = await loadAll();
    return tools.find((tool) => tool.id === id) || null;
  }

  async function loadAll() {
    if (pluginTools.length === 0) registerPlugins(loadPersistedPlugins());
    if (Array.isArray(window.TOOL_REGISTRY_PLUGINS)) registerPlugins(window.TOOL_REGISTRY_PLUGINS);
    const imported = await loadImportedTools();
    const merged = [...getBuiltinTools(), ...imported, ...pluginTools];
    const deduped = new Map();
    merged.forEach((tool) => deduped.set(tool.id, tool));
    return Array.from(deduped.values());
  async function getCategories() {
    const tools = await loadAll();
    return Array.from(new Set(tools.map((tool) => tool.category))).sort();
  }

  async function getGraph() {
    const tools = await loadAll();
    const nodes = tools.map((tool) => ({ id: tool.id, category: tool.category, label: tool.name }));
    const nodeIds = new Set(nodes.map((node) => node.id));
    const edges = [];

    tools.forEach((tool) => {
      (tool.relatedTools || []).forEach((targetId) => {
        if (!nodeIds.has(targetId)) return;
        edges.push({ from: tool.id, to: targetId, type: 'related' });
      });
    });

    return { nodes, edges, tools };
  }

  global.ToolRegistry = {
    normalizeCategory,
    normalizeTool,
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
