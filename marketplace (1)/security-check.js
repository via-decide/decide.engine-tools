(function (global) {
  'use strict';

  function verifyCompatibility(manifest, options) {
    const supportedEngine = String((options && options.supportedEngine) || 'decide-engine');
    const expectedPrefix = String((options && options.expectedEntryPrefix) || 'games/');
    const errors = [];

    if (String(manifest.engine || '').trim() !== supportedEngine) {
      errors.push(`Unsupported engine: ${manifest.engine || 'unknown'}`);
    }

    if (!String(manifest.entry || '').startsWith(expectedPrefix)) {
      errors.push(`Entry point must start with "${expectedPrefix}".`);
    }

    return { ok: errors.length === 0, errors };
  }

  function validateEntryPoint(manifest) {
    const entry = String(manifest.entry || '').trim();
    const errors = [];

    if (!entry) errors.push('Entry point is required.');
    if (entry.includes('..')) errors.push('Entry point cannot traverse parent directories.');
    if (!/\.js$/i.test(entry)) errors.push('Entry point must be a JavaScript file path.');

    return { ok: errors.length === 0, errors };
  }

  function scanAssets(manifest) {
    const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
    const errors = [];

    assets.forEach((asset, index) => {
      const path = String(asset || '').trim();
      if (!path) {
        errors.push(`Asset at index ${index} is empty.`);
        return;
      }
      if (path.includes('..')) errors.push(`Asset path cannot traverse parent directories: ${path}`);
      if (/^https?:\/\//i.test(path)) errors.push(`Asset must be repo-relative, not remote: ${path}`);
    });

    return { ok: errors.length === 0, errors };
  }

  function verifyManifestIntegrity(manifest) {
    if (!global.SimulationManifest || typeof global.SimulationManifest.validateManifest !== 'function') {
      return { ok: false, errors: ['SimulationManifest validator is unavailable.'] };
    }
    return global.SimulationManifest.validateManifest(manifest);
  }

  function runSecurityChecks(manifest, options) {
    const checks = [
      verifyManifestIntegrity(manifest),
      verifyCompatibility(manifest, options),
      validateEntryPoint(manifest),
      scanAssets(manifest)
    ];

    const errors = checks.flatMap((result) => result.errors || []);
    return { ok: errors.length === 0, errors };
  }

  global.SimulationSecurity = {
    verifyCompatibility,
    validateEntryPoint,
    scanAssets,
    verifyManifestIntegrity,
    runSecurityChecks
  };
})(window);
