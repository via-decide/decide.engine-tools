(function (global) {
  'use strict';

  const REGISTRY_KEY = 'viadecide.marketplace.registry';

  function buildLaunchUrl(name, options) {
    const baseUrl = String((options && options.marketplaceBaseUrl) || 'https://daxini.space').replace(/\/$/, '');
    const slug = global.SimulationManifest.slugify(name);
    return `${baseUrl}/simulations/${slug}`;
  }

  function readRegistry() {
    if (global.ToolStorage && typeof global.ToolStorage.read === 'function') {
      const stored = global.ToolStorage.read(REGISTRY_KEY, []);
      return Array.isArray(stored) ? stored : [];
    }
    return [];
  }

  function writeRegistry(registry) {
    if (global.ToolStorage && typeof global.ToolStorage.write === 'function') {
      global.ToolStorage.write(REGISTRY_KEY, registry);
    }
  }

  function registerDiscoveryEntry(manifest) {
    const entry = {
      simulation_id: manifest.id,
      creator: manifest.creator,
      launch_url: manifest.launch_url,
      publish_timestamp: new Date().toISOString(),
      engine_version: manifest.engine_version
    };

    const next = readRegistry().filter((item) => item && item.simulation_id !== entry.simulation_id);
    next.push(entry);
    writeRegistry(next);
    return entry;
  }

  async function publishSimulation(simulationDef, options) {
    if (!global.SimulationPackager || !global.SimulationSecurity || !global.MarketplaceClient) {
      throw new Error('Marketplace pipeline dependencies are missing.');
    }

    const launchUrl = buildLaunchUrl(simulationDef.name, options);
    const pkg = global.SimulationPackager.packageSimulation(simulationDef, {
      ...options,
      launch_url: launchUrl
    });

    const security = global.SimulationSecurity.runSecurityChecks(pkg.manifest, options);
    if (!security.ok) {
      return {
        ok: false,
        stage: 'security-check',
        errors: security.errors,
        package: pkg
      };
    }

    const metadata = global.MarketplaceClient.toMarketplaceMetadata(pkg.manifest);
    const registration = await global.MarketplaceClient.registerSimulation(metadata, options);
    const metadataResponse = await global.MarketplaceClient.sendMetadata(metadata, options);
    const discovery = registerDiscoveryEntry(pkg.manifest);

    return {
      ok: true,
      package: pkg,
      manifest: pkg.manifest,
      launch_url: pkg.manifest.launch_url,
      metadata,
      registration,
      metadataResponse,
      discovery
    };
  }

  function findSimulationByName(name) {
    if (global.SimulationGenerator && typeof global.SimulationGenerator.getAllGenerated === 'function') {
      const all = global.SimulationGenerator.getAllGenerated();
      const match = all.find((item) => item && item.name === name);
      if (match) return match;
    }

    if (name === 'mars') {
      return {
        name: 'Mars Colony Economy',
        config: {
          title: 'Mars Colony Economy',
          creator: 'zayvora',
          type: 'simulation',
          entry: 'games/mars/game-entry.js'
        },
        definition: {
          scripts: ['games/mars/scripts/simulation.js', 'games/mars/ui/runtime-ui.js']
        },
        assets: ['games/mars/config/config.json']
      };
    }

    return null;
  }

  async function exportSimulation(name, options) {
    const simulation = findSimulationByName(name);
    if (!simulation) {
      throw new Error(`Simulation not found: ${name}`);
    }

    return publishSimulation(simulation, {
      ...(options || {}),
      entry: (simulation.config && simulation.config.entry) || options.entry || ''
    });
  }

  global.SimulationPublisher = {
    publishSimulation,
    exportSimulation,
    buildLaunchUrl,
    registerDiscoveryEntry,
    findSimulationByName,
    readRegistry
  };
})(window);
