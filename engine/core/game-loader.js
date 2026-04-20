(function (global) {
  'use strict';

  const GAME_ROOT = './games';
  const CACHE = {};

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

  async function loadGame(name) {
    const gameName = normalizeGameName(name);
    if (CACHE[gameName]) return CACHE[gameName];

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
    normalizeGameName
  };
})(window);
