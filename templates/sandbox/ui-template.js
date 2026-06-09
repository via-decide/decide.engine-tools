(function (global) {
  'use strict';

  global.DECIDE_TEMPLATE_UI = {
    mount(host, title) {
      if (!host) return;
      host.innerHTML = `<h2>${title || 'AI Simulation Template'}</h2><p>Template UI scaffold loaded.</p>`;
    }
  };
})(window);
