(function (global) {
  'use strict';

  function launchEnvironment(name) {
    global.location.href = `./${name}/index.html`;
  }

  global.GameLauncher = { launchEnvironment };
})(window);
