(function (global) {
  'use strict';

  function createSystemRunner() {
    const systems = [];

    return {
      register(name, fn) {
        systems.push({ name, fn });
      },
      run(frameContext, ecs) {
        systems.forEach((system) => {
          system.fn(frameContext, ecs);
        });
      },
      reset() {
        systems.length = 0;
      }
    };
  }

  global.SystemRunner = { createSystemRunner };
})(window);
