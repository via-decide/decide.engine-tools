(function (global) {
  'use strict';

  function buildVoxelWorld(parsedPrompt, template) {
    const voxelTerrain = global.VoxelWorldTerrain;
    const voxelEntities = global.VoxelWorldEntities;
    const voxelUi = global.VoxelWorldUi;
    const templateConfig = (template && template.config) || {};

    return {
      name: parsedPrompt.worldId,
      config: {
        name: parsedPrompt.worldId,
        title: parsedPrompt.worldName,
        status: 'Generated World',
        type: template.id,
        creator: 'zayvora',
        seed: parsedPrompt.seed,
        prompt: parsedPrompt.prompt,
        launchUrl: './games/ai-simulation-studio.html'
      },
      definition: {
        scripts: [],
        gameFactory() {
          return {
            createInitialState() {
              const mapSize = templateConfig.mapSize || 48;
              const terrain = voxelTerrain.generateTerrain({
                seed: parsedPrompt.seed,
                chunkSize: templateConfig.chunkSize || 16,
                mapSize,
                biomeSet: templateConfig.biomeSet || ['plains', 'forest', 'hills']
              });

              return {
                tick: 0,
                seed: parsedPrompt.seed,
                terrain,
                player: { x: 2, y: 2, hp: 100, hunger: 100, energy: 100 },
                entities: voxelEntities.spawnStarterEntities(terrain),
                resources: { wood: 0, stone: 0, food: 0 },
                worldStats: { mapSize, chunks: terrain.chunks.length }
              };
            },
            update(state, frame) {
              const tick = (state.tick || 0) + 1;
              const entityDelta = voxelEntities.updateEntities(state.entities, state.terrain, tick, frame);
              const resources = {
                ...state.resources,
                wood: state.resources.wood + (tick % 3 === 0 ? 1 : 0),
                food: state.resources.food + (tick % 4 === 0 ? 1 : 0)
              };

              return {
                ...state,
                tick,
                entities: entityDelta.entities,
                player: {
                  ...state.player,
                  hunger: Math.max(0, state.player.hunger - 0.08),
                  energy: Math.max(0, state.player.energy - 0.04)
                },
                resources,
                lastEvent: entityDelta.lastEvent
              };
            }
          };
        },
        uiFactory() {
          return voxelUi.createUiRenderer({ title: parsedPrompt.worldName, templateConfig });
        }
      }
    };
  }

  function buildWorld(parsedPrompt, template) {
    if (!template || template.id === 'voxel-world') {
      return buildVoxelWorld(parsedPrompt, template || { id: 'voxel-world', config: {} });
    }

    const fallbackPrompt = {
      ...parsedPrompt,
      template: 'voxel-world'
    };
    return buildVoxelWorld(fallbackPrompt, { id: 'voxel-world', config: {} });
  }

  global.WorldBuilder = {
    buildWorld,
    buildVoxelWorld
  };
})(window);
