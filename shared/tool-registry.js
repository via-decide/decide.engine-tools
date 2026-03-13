(function (global) {
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
      category: 'students',
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
      category: 'students',
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
      category: 'operators',
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
      category: 'operators',
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
      category: 'founders',
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
      category: 'students',
      audience: ['students'],
      inputs: ['answers'],
      outputs: ['score'],
      relatedTools: [],
      entry: 'wings-of-fire-quiz/index.html',
      tags: ['legacy', 'quiz']
    }
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

  const importableToolDirs = [
    'tools/promptalchemy',
    'tools/script-generator',
    'tools/spec-builder',
    'tools/code-generator',
    'tools/code-reviewer',
    'tools/tool-router',
    'tools/export-studio',
    'tools/template-vault'
  ];

  function normalizeTool(meta) {
    return {
      id: meta.id || 'unknown-tool',
      name: meta.name || meta.id || 'Unnamed Tool',
      description: meta.description || '',
      category: meta.category || 'uncategorized',
      audience: Array.isArray(meta.audience) ? meta.audience : [],
      inputs: Array.isArray(meta.inputs) ? meta.inputs : [],
      outputs: Array.isArray(meta.outputs) ? meta.outputs : [],
      relatedTools: Array.isArray(meta.relatedTools) ? meta.relatedTools : [],
      entry: meta.entry || '',
      tags: Array.isArray(meta.tags) ? meta.tags : []
    };
  }

  function getBuiltinTools() {
    return builtinTools.map(normalizeTool);
  }

  async function loadImportedTools() {
    const loaded = await Promise.all(
      importableToolDirs.map(async (dir) => {
        try {
          const response = await fetch(resolve(`${dir}/config.json`), { cache: 'no-cache' });
          if (!response.ok) return null;
          return normalizeTool(await response.json());
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
    normalizeTool,
    getBuiltinTools,
    loadImportedTools,
    loadAll,
    findById,
    getTools,
    isRegistered
  };
  const tools = [
    'promptalchemy',
    'script-generator',
    'spec-builder',
    'code-generator',
    'code-reviewer',
    'tool-router',
    'export-studio',
    'template-vault'
  ];

  function getTools() {
    return tools.slice();
  }

  function isRegistered(id) {
    return tools.includes(id);
  }

  global.ToolRegistry = { getTools, isRegistered };
})(window);
