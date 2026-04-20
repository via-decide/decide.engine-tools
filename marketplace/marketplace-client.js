(function (global) {
  'use strict';

  const DEFAULT_BASE_URL = 'https://daxini.space';

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function request(path, payload, options) {
    const config = options || {};
    const retries = Number.isFinite(config.retries) ? config.retries : 2;
    const retryDelayMs = Number.isFinite(config.retryDelayMs) ? config.retryDelayMs : 300;
    const baseUrl = String(config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');

    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload || {})
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Marketplace request failed (${response.status}): ${text}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        if (attempt < retries) await sleep(retryDelayMs * (attempt + 1));
      }
    }

    throw lastError || new Error('Marketplace request failed.');
  }

  function toMarketplaceMetadata(manifest) {
    return {
      id: manifest.id,
      title: manifest.title || manifest.name,
      creator: manifest.creator,
      simulation_type: manifest.simulation_type,
      engine_version: manifest.engine_version,
      launch_url: manifest.launch_url,
      created_at: manifest.created_at
    };
  }

  function registerSimulation(metadata, options) {
    return request('/marketplace/register', metadata, options);
  }

  function sendMetadata(metadata, options) {
    return request('/marketplace/metadata', metadata, options);
  }

  function updateSimulationInfo(simulationId, metadata, options) {
    return request('/marketplace/update', {
      id: simulationId,
      metadata: metadata || {}
    }, options);
  }

  async function fetchMarketplaceApps(options) {
    const config = options || {};
    const baseUrl = String(config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/marketplace/apps`);
    if (!response.ok) {
      throw new Error(`Marketplace fetch failed (${response.status}).`);
    }
    return response.json();
  }

  global.MarketplaceClient = {
    request,
    registerSimulation,
    sendMetadata,
    updateSimulationInfo,
    fetchMarketplaceApps,
    toMarketplaceMetadata
  };
})(window);
