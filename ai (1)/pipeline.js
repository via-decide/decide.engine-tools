(function (global) {
  'use strict';

  function parseRequest(prompt) {
    const text = String(prompt || '').trim();
    const fallbackName = `Generated Simulation ${new Date().toISOString().slice(0, 19)}`;
    return {
      prompt: text,
      name: text ? text.replace(/^create\s+/i, '').replace(/[.?!]+$/, '') : fallbackName
    };
  }

  function selectTemplate(parsedRequest, preferredTemplate) {
    return global.GameScaffoldGenerator.normalizeTemplate(preferredTemplate, parsedRequest.prompt || parsedRequest.name);
  }

  function generateModule(parsedRequest, template, meta = {}) {
    const request = global.GameScaffoldGenerator.buildScaffoldRequest(parsedRequest.name, template, parsedRequest.prompt);
    return global.SimulationGenerator.generateModule({
      ...request,
      creator: meta.creator || 'zayvora'
    });
  }

  async function registerModule(moduleDef) {
    if (global.GameLoader && typeof global.GameLoader.registerDynamicModule === 'function') {
      global.GameLoader.registerDynamicModule(moduleDef);
    }
    return moduleDef;
  }

  async function launchSimulation(name) {
    if (!global.EngineCore || typeof global.EngineCore.startSimulation !== 'function') {
      throw new Error('EngineCore is not available.');
    }
    await global.EngineCore.startSimulation(name);
    return { name, launched: true };
  }

  async function runPipeline(prompt, options = {}) {
    const parsedRequest = parseRequest(prompt);
    const template = selectTemplate(parsedRequest, options.template);
    const moduleDef = generateModule(parsedRequest, template, options);
    await registerModule(moduleDef);

    if (options.autoLaunch) {
      await launchSimulation(moduleDef.name);
    }

    return {
      parsedRequest,
      template,
      module: moduleDef
    };
  }

  global.AISimulationPipeline = {
    parseRequest,
    selectTemplate,
    generateModule,
    registerModule,
    launchSimulation,
    runPipeline
  };
})(window);
