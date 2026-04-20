(function (global) {
  'use strict';

  function resolvePreset(promptOrPreset) {
    const text = String(promptOrPreset || '').trim();
    if (text === 'voxel-demo') {
      return {
        prompt: 'Create a Minecraft-style survival world.',
        options: {
          template: 'voxel-world',
          worldName: 'Voxel Demo World',
          worldId: 'voxel-demo',
          seed: 424242
        }
      };
    }

    return {
      prompt: text,
      options: {}
    };
  }

  async function runPipeline(promptOrPreset, options = {}) {
    const resolved = resolvePreset(promptOrPreset);
    const parsed = global.WorldParser.parsePrompt(resolved.prompt, {
      ...resolved.options,
      ...options
    });
    const selectedTemplate = await global.WorldTemplateSelector.selectTemplate(parsed);
    const worldModule = global.WorldBuilder.buildWorld(parsed, selectedTemplate);
    const metadata = global.WorldRegistry.registerWorld(worldModule);

    if (options.autoLaunch && global.EngineCore && typeof global.EngineCore.startSimulation === 'function') {
      await global.EngineCore.startSimulation(worldModule.name);
    }

    return {
      parsed,
      selectedTemplate,
      worldModule,
      metadata
    };
  }

  async function createWorld(promptOrPreset, options = {}) {
    const world = await runPipeline(promptOrPreset, {
      autoLaunch: options.autoLaunch !== false,
      ...options
    });
    return world.worldModule.config;
  }

  global.AIWorldPipeline = {
    resolvePreset,
    runPipeline,
    createWorld
  };

  global.createWorld = createWorld;
})(window);
