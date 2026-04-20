(function (global) {
  'use strict';

  const PACKAGE_STORAGE_KEY = 'viadecide.marketplace.packages';

  function readStoredPackages() {
    if (!global.ToolStorage || typeof global.ToolStorage.read !== 'function') return [];
    const items = global.ToolStorage.read(PACKAGE_STORAGE_KEY, []);
    return Array.isArray(items) ? items : [];
  }

  function persistPackage(pkg) {
    if (!global.ToolStorage || typeof global.ToolStorage.write !== 'function') return false;
    const current = readStoredPackages().filter((item) => item && item.id !== pkg.id);
    current.push(pkg);
    return global.ToolStorage.write(PACKAGE_STORAGE_KEY, current);
  }

  function normalizeAssetList(simulationDef) {
    if (Array.isArray(simulationDef.assets)) return simulationDef.assets.filter(Boolean);

    const scripts = simulationDef.definition && Array.isArray(simulationDef.definition.scripts)
      ? simulationDef.definition.scripts
      : [];

    const configAssets = simulationDef.config && Array.isArray(simulationDef.config.assets)
      ? simulationDef.config.assets
      : [];

    return [...scripts, ...configAssets].filter(Boolean);
  }

  function simpleFingerprint(payload) {
    const text = JSON.stringify(payload);
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return `pkg-${Math.abs(hash)}`;
  }

  function buildPackage(simulationDef, options) {
    if (!global.SimulationManifest || typeof global.SimulationManifest.buildManifest !== 'function') {
      throw new Error('SimulationManifest is not available.');
    }

    const meta = options || {};
    const rawName = simulationDef.name
      || (simulationDef.config && simulationDef.config.title)
      || 'untitled-simulation';
    const entry = meta.entry
      || simulationDef.entry
      || (simulationDef.config && simulationDef.config.entry)
      || `games/${global.SimulationManifest.slugify(rawName)}/game-entry.js`;
    const assets = normalizeAssetList(simulationDef);

    const manifest = global.SimulationManifest.buildManifest({
      id: meta.id,
      title: meta.title || (simulationDef.config && simulationDef.config.title) || rawName,
      name: rawName,
      creator: meta.creator || (simulationDef.config && simulationDef.config.creator) || 'zayvora',
      description: meta.description || (simulationDef.config && simulationDef.config.prompt) || '',
      engine: meta.engine || 'decide-engine',
      entry,
      version: meta.version || '1.0',
      assets,
      simulation_type: meta.simulation_type || (simulationDef.config && simulationDef.config.type) || 'simulation',
      engine_version: meta.engine_version || '1.0.0',
      launch_url: meta.launch_url,
      created_at: meta.created_at
    });

    const packageName = `${global.SimulationManifest.slugify(manifest.name) || manifest.id}.pkg`;
    const packagePath = `dist/${packageName}`;
    const payload = {
      id: manifest.id,
      package_path: packagePath,
      manifest,
      scripts: (simulationDef.definition && simulationDef.definition.scripts) || [],
      assets,
      generated_at: new Date().toISOString()
    };

    return {
      ...payload,
      fingerprint: simpleFingerprint(payload)
    };
  }

  function packageSimulation(simulationDef, options) {
    const pkg = buildPackage(simulationDef, options);
    persistPackage(pkg);
    return pkg;
  }

  global.SimulationPackager = {
    buildPackage,
    packageSimulation,
    normalizeAssetList,
    simpleFingerprint,
    readStoredPackages
  };
})(window);
