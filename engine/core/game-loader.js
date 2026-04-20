(function (global) {
  'use strict';

  const GAME_ROOT = './games';
  const CACHE = {};
  const MANIFEST_PATH = `${GAME_ROOT}/manifest.json`;

  function normalizeGameName(name) {
    return String(name || '').trim().toLowerCase();
  }

  function buildGamePath(name) {
    const gameName = normalizeGameName(name);
    if (!gameName) throw new Error('GameLoader requires a game name.');
    return `${GAME_ROOT}/${gameName}`;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadConfig(gameName) {
    const candidates = [
      `${buildGamePath(gameName)}/config/config.json`,
      `${buildGamePath(gameName)}/config.json`
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      const response = await fetch(candidates[i], { cache: 'no-cache' });
      if (response.ok) return response.json();
    }

    throw new Error(`Unable to load config for ${gameName}.`);
  }

  async function loadManifest() {
    try {
      const response = await fetch(MANIFEST_PATH, { cache: 'no-cache' });
      if (!response.ok) return [];
      const payload = await response.json();
      return Array.isArray(payload.games) ? payload.games : [];
    } catch (_error) {
      return [];
    }
  }

  function registerDynamicModule(environment) {
    if (!environment || !environment.name) return null;
    if (!global.DECIDE_DYNAMIC_MODULES) global.DECIDE_DYNAMIC_MODULES = {};
    global.DECIDE_DYNAMIC_MODULES[environment.name] = environment;
    return environment;
  }

  function getDynamicModule(name) {
    if (!global.DECIDE_DYNAMIC_MODULES) return null;
    return global.DECIDE_DYNAMIC_MODULES[normalizeGameName(name)] || null;
  }

  async function loadGame(name) {
    const gameName = normalizeGameName(name);
    if (CACHE[gameName]) return CACHE[gameName];

    const dynamicModule = getDynamicModule(gameName);
    if (dynamicModule) {
      const loadedDynamic = {
        name: gameName,
        config: dynamicModule.config,
        game: dynamicModule.definition.gameFactory(global),
        ui: dynamicModule.definition.uiFactory(global)
      };
      CACHE[gameName] = loadedDynamic;
      return loadedDynamic;
    }

    if (!global.DECIDE_GAME_MODULES) global.DECIDE_GAME_MODULES = {};

    const basePath = buildGamePath(gameName);
    await loadScript(`${basePath}/game-entry.js`);

    const moduleDef = global.DECIDE_GAME_MODULES[gameName];
    if (!moduleDef) throw new Error(`Missing game entry module for ${gameName}.`);

    for (let i = 0; i < moduleDef.scripts.length; i += 1) {
      await loadScript(`${basePath}/${moduleDef.scripts[i]}`);
    }

    const loaded = {
      name: gameName,
      config: await loadConfig(gameName),
      game: moduleDef.gameFactory(global),
      ui: moduleDef.uiFactory(global)
    };

    CACHE[gameName] = loaded;
    return loaded;
  }

  global.GameLoader = {
    loadGame,
    loadManifest,
    registerDynamicModule,
    normalizeGameName
  };
})(window);
