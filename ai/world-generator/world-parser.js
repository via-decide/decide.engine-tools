(function (global) {
  'use strict';

  function buildSlug(name) {
    return String(name || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function inferTemplate(prompt) {
    const text = String(prompt || '').toLowerCase();
    if (text.includes('voxel') || text.includes('minecraft') || text.includes('block')) return 'voxel-world';
    if (text.includes('strategy')) return 'strategy-world';
    if (text.includes('simulation')) return 'simulation-world';
    if (text.includes('social')) return 'social-world';
    return 'sandbox-world';
  }

  function deriveSeed(prompt) {
    const text = String(prompt || '');
    let seed = 0;
    for (let i = 0; i < text.length; i += 1) {
      seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
    }
    return seed || 1337;
  }

  function parsePrompt(prompt, options = {}) {
    const rawPrompt = String(prompt || '').trim();
    const fallbackPrompt = 'Create a voxel survival world.';
    const normalizedPrompt = rawPrompt || fallbackPrompt;
    const template = options.template || inferTemplate(normalizedPrompt);
    const baseName = options.worldName || normalizedPrompt.replace(/^create\s+/i, '').replace(/[.?!]+$/, '');
    const worldName = baseName || 'Generated World';
    const worldId = options.worldId || buildSlug(worldName) || `world-${Date.now()}`;

    return {
      prompt: normalizedPrompt,
      template,
      worldName,
      worldId,
      seed: Number(options.seed || deriveSeed(normalizedPrompt))
    };
  }

  global.WorldParser = {
    parsePrompt,
    inferTemplate,
    deriveSeed,
    buildSlug
  };
})(window);
