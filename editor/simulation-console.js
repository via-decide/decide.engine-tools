(function (global) {
  'use strict';

  function render(host, payload) {
    host.textContent = payload && payload.message ? payload.message : 'No simulation logs yet.';
  }

  global.SimulationConsole = { render };
})(window);
