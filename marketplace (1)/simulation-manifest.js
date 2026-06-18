(function (global) {
  'use strict';

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function buildManifest(input) {
    const payload = input || {};
    const name = String(payload.name || 'untitled-simulation').trim();
    const creator = String(payload.creator || 'unknown').trim();
    const assets = Array.isArray(payload.assets) ? payload.assets.filter(Boolean) : [];
    const createdAt = payload.created_at || new Date().toISOString();
    const simulationType = String(payload.simulation_type || payload.type || 'simulation').trim();
    const slug = slugify(name) || `simulation-${Date.now()}`;

    return {
      id: payload.id || slug,
      title: String(payload.title || name).trim(),
      name,
      creator,
      description: String(payload.description || '').trim(),
      engine: String(payload.engine || 'decide-engine').trim(),
      entry: String(payload.entry || payload.entry_point || '').trim(),
      entry_point: String(payload.entry || payload.entry_point || '').trim(),
      version: String(payload.version || '1.0').trim(),
      assets,
      simulation_type: simulationType,
      engine_version: String(payload.engine_version || '1.0.0').trim(),
      launch_url: String(payload.launch_url || `https://daxini.space/simulations/${slug}`).trim(),
      created_at: createdAt
    };
  }

  function validateManifest(manifest) {
    const errors = [];
    if (!manifest || typeof manifest !== 'object') {
      return { ok: false, errors: ['Manifest must be an object.'] };
    }

    const required = ['name', 'creator', 'engine', 'entry', 'version', 'assets', 'created_at'];
    required.forEach((field) => {
      if (field === 'assets') {
        if (!Array.isArray(manifest.assets)) errors.push('Manifest assets must be an array.');
        return;
      }

      if (!String(manifest[field] || '').trim()) {
        errors.push(`Missing required manifest field: ${field}`);
      }
    });

    return { ok: errors.length === 0, errors };
  }

  global.SimulationManifest = {
    slugify,
    buildManifest,
    validateManifest
  };
})(window);
