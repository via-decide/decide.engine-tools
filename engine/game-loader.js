(function (global) {
  'use strict';

  let gameRootPrefix = '.';
  const scriptTags = document.getElementsByTagName('script');
  for (let i = 0; i < scriptTags.length; i++) {
    const src = scriptTags[i].getAttribute('src') || '';
    if (src.includes('game-loader.js')) {
      const idx = src.indexOf('engine/game-loader.js');
      if (idx !== -1) {
        gameRootPrefix = src.substring(0, idx) || '.';
        if (gameRootPrefix.endsWith('/')) {
          gameRootPrefix = gameRootPrefix.substring(0, gameRootPrefix.length - 1);
        }
      }
      break;
    }
  }
  const GAME_ROOT = `${gameRootPrefix}/games`;
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

  function ensureRegistry(name) {
    if (!global.DECIDE_GAMES) global.DECIDE_GAMES = {};
    if (!global.DECIDE_GAMES[name]) {
      global.DECIDE_GAMES[name] = {
        name,
        config: null,
        game: null,
        ui: null
      };
    }
    return global.DECIDE_GAMES[name];
  }

  async function loadConfig(name) {
    const path = `${buildGamePath(name)}/config.json`;
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Unable to load config for ${name}.`);
    return response.json();
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

    const registry = ensureRegistry(gameName);
    registry.config = await loadConfig(gameName);

    const basePath = buildGamePath(gameName);
    await loadScript(`${basePath}/game.js`);
    await loadScript(`${basePath}/ui.js`);

    if (!registry.game || !registry.ui) {
      throw new Error(`Game module incomplete: ${gameName}.`);
    }

    CACHE[gameName] = registry;
    return registry;
  }

  global.GameLoader = {
    loadGame,
    registerDynamicModule,
    normalizeGameName
  };
})(window);
