(function (global) {
  'use strict';

  const MODULE_PATHS = {
    workspace: '../workspace/index.html',
    studyos: '../StudyOS/index.html',
    tools: '../tools/index.html',
    agent: '../agent/index.html',
    settings: '../founder/index.html',
    'hex-wars': '../tools/games/hex-wars/index.html',
    'snake-game': '../tools/games/snake-game/index.html'
  };

  function openModule(moduleName, options = {}) {
    const containerId = options.containerId || 'workspace';
    const statusSelector = options.statusSelector || '[data-status]';
    const container = document.getElementById(containerId);
    const modulePath = MODULE_PATHS[moduleName];
    console.log('Loading module:', moduleName);

    if (!container) {
      throw new Error('Workspace container missing');
    }

    if (!modulePath) {
      if (global.VDStatus?.setError) {
        global.VDStatus.setError(statusSelector, `Module not found: ${moduleName}`);
      }
      container.innerHTML = '<div class="module-error">Module failed to load.<br>Check console for details.</div>';
      return;
    }

    if (global.VDStatus?.setLoading) {
      global.VDStatus.setLoading(statusSelector, `Loading ${moduleName}...`);
    }

    const frame = document.createElement('iframe');
    frame.className = 'module-frame';
    frame.loading = 'lazy';
    frame.title = `${moduleName} module`;
    frame.src = modulePath;
    frame.addEventListener('load', () => {
      if (global.VDStatus?.setProgress) {
        global.VDStatus.setProgress(statusSelector, `Loaded ${moduleName}.`);
      }
    });
    frame.addEventListener('error', () => {
      if (global.VDStatus?.setError) {
        global.VDStatus.setError(statusSelector, `Failed to load module: ${moduleName}`);
      }
      container.innerHTML = '<div class="module-error">Module failed to load.<br>Check console for details.</div>';
    });
    container.replaceChildren(frame);
  }

  global.VDModuleLoader = { openModule, MODULE_PATHS };
})(window);
