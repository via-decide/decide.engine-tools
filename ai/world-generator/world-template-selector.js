(function (global) {
  'use strict';

  const TEMPLATE_MAP = {
    'voxel-world': {
      id: 'voxel-world',
      title: 'Voxel World',
      configPath: './world-templates/voxel-world/world-config.json'
    },
    'strategy-world': {
      id: 'strategy-world',
      title: 'Strategy World'
    },
    'simulation-world': {
      id: 'simulation-world',
      title: 'Simulation World'
    },
    'social-world': {
      id: 'social-world',
      title: 'Social World'
    },
    'sandbox-world': {
      id: 'sandbox-world',
      title: 'Sandbox World'
    }
  };

  async function loadTemplateConfig(template) {
    if (!template || !template.configPath || typeof fetch !== 'function') return {};

    try {
      const response = await fetch(template.configPath, { cache: 'no-cache' });
      if (!response.ok) return {};
      return await response.json();
    } catch (_error) {
      return {};
    }
  }

  async function selectTemplate(parsedPrompt) {
    const id = (parsedPrompt && parsedPrompt.template) || 'sandbox-world';
    const selected = TEMPLATE_MAP[id] || TEMPLATE_MAP['sandbox-world'];
    const config = await loadTemplateConfig(selected);
    return { ...selected, config };
  }

  global.WorldTemplateSelector = {
    selectTemplate,
    loadTemplateConfig,
    TEMPLATE_MAP
  };
})(window);
