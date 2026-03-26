(function (global) {
  'use strict';

  const VIA_LOGIC_PATH = 'tools/games/vialogic/index.html';
  const commandAliases = {
    vialogic: VIA_LOGIC_PATH,
    mathmap: VIA_LOGIC_PATH,
    cartography: VIA_LOGIC_PATH,
    minds: VIA_LOGIC_PATH
  };

  function resolveCommandRoute(command) {
    const normalized = String(command || '').trim().toLowerCase();
    return commandAliases[normalized] || null;
  }

  global.CommandRouter = global.CommandRouter || {};
  global.CommandRouter.aliases = {
    ...(global.CommandRouter.aliases || {}),
    ...commandAliases
  };
  global.CommandRouter.resolve = resolveCommandRoute;
})(window);
