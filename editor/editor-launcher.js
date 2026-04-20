(function (global) {
  'use strict';

  function bootstrap() {
    const browser = document.getElementById('environment-browser');
    const consoleNode = document.getElementById('simulation-console');

    if (browser && global.EnvironmentBrowser) {
      global.EnvironmentBrowser.render(browser);
    }

    if (consoleNode && global.SimulationConsole) {
      global.SimulationConsole.render(consoleNode, {
        message: 'Editor ready: Mars, Orchade, SkillHex runtime targets online.'
      });
    }
  }

  global.EditorLauncher = { bootstrap };
})(window);
