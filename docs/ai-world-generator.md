# AI World Generator (Milestone 1)

## Goal

Provide an optional world-generation layer that turns natural language prompts into playable runtime worlds inside Decide Engine Studio.

## Modules Added

- `/ai/world-generator/world-parser.js`
  - Parses prompts into `{ worldId, worldName, template, seed }`.
- `/ai/world-generator/world-template-selector.js`
  - Selects template metadata and loads `world-config.json` when available.
- `/ai/world-generator/world-builder.js`
  - Builds runtime-compatible dynamic world modules (`gameFactory`, `uiFactory`).
- `/ai/world-generator/world-registry.js`
  - Stores generated world metadata and registers modules for runtime loading.
- `/ai/world-pipeline.js`
  - Orchestrates the flow: parse -> template -> build -> register -> optional launch.

## Voxel Template (Initial Playable World)

- `/world-templates/voxel-world/world-config.json`
- `/world-templates/voxel-world/terrain-generator.js`
- `/world-templates/voxel-world/entity-system.js`
- `/world-templates/voxel-world/ui-template.js`

This template supports:
- seed-based terrain generation
- chunk map creation
- starter entities (animals/resources/structure)
- simulation tick updates
- runtime UI rendering panel

## Launch Flow

From any page that loads the pipeline scripts:

```js
createWorld('voxel-demo');
```

`voxel-demo` preset maps to:
- prompt: `Create a Minecraft-style survival world.`
- template: `voxel-world`
- world id: `voxel-demo`
- seed: `424242`

If `EngineCore` is available, the world auto-launches by default.

## Registry

- Runtime registry is persisted in `localStorage` under `viadecide.ai.generated-worlds`.
- Static sample metadata is included at `/worlds/voxel-demo-world-index.json`.

## Minimal Studio Hook

`games/ai-simulation-studio.html` now includes a **Create Voxel World** template option and wires generation through `createWorld(...)` for voxel flows.

