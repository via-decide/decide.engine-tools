(function (global) {
  'use strict';

  global.DECIDE_TEMPLATE_ENTRY = global.DECIDE_TEMPLATE_ENTRY || {};
  global.DECIDE_TEMPLATE_ENTRY.current = {
    scripts: [],
    gameFactory() { return null; },
    uiFactory() { return null; }
  };
})(window);
