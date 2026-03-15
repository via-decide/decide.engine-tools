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

  const DEFAULT_CATEGORY = 'misc';

  function resolveBase() {
    const script = document.currentScript;
    if (!script || !script.src) return '';
    const marker = '/shared/tool-registry.js';
    const idx = script.src.indexOf(marker);
    return idx === -1 ? '' : script.src.slice(0, idx + 1);
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
    getCategories,
    getGraph
  };
})(window);
