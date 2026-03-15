(function (global) {
  'use strict';

  const DEFAULT_CATEGORY = 'misc';
  const PLUGIN_STORAGE_KEY = 'viadecide.tool-registry.plugins';

  const CATEGORY_ALIASES = {
    operators: 'business',
    founders: 'business',
    students: 'education',
    engine: 'simulations'
  };

  const BUILTIN_TOOLS = [
    {
      id: 'workflow-builder',
      name: 'Agent Plan Editor',
      description: 'Build step-based agent workflows and run previews.',
      category: 'coders',
      tags: ['workflow', 'agent'],
      entry: 'workflow-builder.html',
      outputs: ['agent_workflow_json']
    },
    {
      id: 'tool-graph',
      name: 'Agent Tool Graph',
      description: 'Visualize tool, workflow and agent relationships.',
      category: 'system',
      tags: ['graph', 'registry'],
      entry: 'tool-graph.html'
    },
    {
      id: 'agent-builder',
      name: 'Agent Builder',
      description: 'Create and save agents as JSON documents.',
      category: 'coders',
      tags: ['agent', 'builder'],
      entry: 'agent-builder.html',
      outputs: ['agent_json']
    },
    {
      id: 'tool-registry-console',
      name: 'Tool Registry Console',
      description: 'Inspect and manage registered tools and plugins.',
      category: 'system',
      tags: ['registry'],
      entry: 'tool-registry.html'
    },
    {
      id: 'execution-console',
      name: 'Execution Console',
      description: 'Run saved agents and inspect sequential execution logs.',
      category: 'system',
      tags: ['runtime', 'execution'],
      entry: 'execution-console.html',
      outputs: ['execution_log']
    }
  ];

  function normalizeCategory(category) {
    const raw = String(category || '').trim().toLowerCase();
    return CATEGORY_ALIASES[raw] || raw || DEFAULT_CATEGORY;
  }

  function normalizeTool(meta, toolDir) {
    const id = String(meta.id || toolDir.split('/').pop() || 'unknown').trim();
    const entry = String(meta.entry || `${toolDir}/index.html`).replace(/^\.\//, '');
    const category = normalizeCategory(meta.category);

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
      isEngineTool: Boolean(meta.isEngineTool) || entry.startsWith('tools/engine/'),
      entry
    };
  }

  function getPersistedPlugins() {
    try {
      const raw = localStorage.getItem(PLUGIN_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function savePlugins(plugins) {
    try {
      localStorage.setItem(PLUGIN_STORAGE_KEY, JSON.stringify(plugins));
      return true;
    } catch (_error) {
      return false;
    }
  }

  async function loadManifest() {
    try {
      const res = await fetch('tools-manifest.json', { cache: 'no-cache' });
      if (!res.ok) return [];
      const payload = await res.json();
      return Array.isArray(payload.entries) ? payload.entries : [];
    } catch (_error) {
      return [];
    }
  }

  async function loadToolMeta({ toolDir, metaPath }) {
    try {
      const res = await fetch(metaPath, { cache: 'no-cache' });
      if (!res.ok) return null;
      const json = await res.json();
      return normalizeTool(json, toolDir);
    } catch (_error) {
      return null;
    }
  }

  async function loadAll() {
    const [entries, manifest] = await Promise.all([
      Promise.resolve(BUILTIN_TOOLS.map((tool) => normalizeTool(tool, tool.id))),
      loadManifest()
    ]);

    const loaded = await Promise.all(manifest.map(loadToolMeta));
    const plugins = getPersistedPlugins().map((tool) => normalizeTool(tool, tool.toolDir || 'tools/plugin'));
    const runtimePlugins = Array.isArray(global.TOOL_REGISTRY_PLUGINS)
      ? global.TOOL_REGISTRY_PLUGINS.map((tool) => normalizeTool(tool, tool.toolDir || 'tools/plugin'))
      : [];

    const merged = new Map();
    [...loaded.filter(Boolean), ...entries, ...plugins, ...runtimePlugins].forEach((tool) => {
      merged.set(tool.id, tool);
    });

    return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async function findById(id) {
    const all = await loadAll();
    return all.find((tool) => tool.id === id) || null;
  }

  async function getCategories() {
    const all = await loadAll();
    return Array.from(new Set(all.map((tool) => tool.category))).sort();
  }

  function registerPlugin(pluginMeta) {
    if (!pluginMeta || typeof pluginMeta !== 'object') return null;
    const plugins = getPersistedPlugins();
    const normalized = normalizeTool(pluginMeta, pluginMeta.toolDir || 'tools/plugin');
    const next = plugins.filter((tool) => tool.id !== normalized.id);
    next.push(normalized);
    savePlugins(next);
    return normalized;
  }

  function registerPlugins(plugins) {
    if (!Array.isArray(plugins)) return [];
    return plugins.map(registerPlugin).filter(Boolean);
  }

  async function getGraph() {
    const tools = await loadAll();
    const nodes = tools.map((tool) => ({
      id: tool.id,
      label: tool.name,
      category: tool.category,
      nodeType: 'tool',
      entry: tool.entry,
      description: tool.description
    }));

    const edges = [];
    const known = new Set(tools.map((tool) => tool.id));
    tools.forEach((tool) => {
      (tool.relatedTools || []).forEach((target) => {
        if (known.has(target)) {
          edges.push({ from: tool.id, to: target, relation: 'related' });
        }
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
    registerPlugin,
    registerPlugins,
    getGraph
  };
})(window);
