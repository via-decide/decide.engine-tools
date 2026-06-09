# Decide Engine Studio Architecture

## Runtime Overview

Decide Engine Studio now uses a shared runtime in `/engine` to load and execute simulation environments.

Flow:

1. `EngineCore.loadGame(name)` requests game modules from `GameLoader`.
2. `GameLoader` resolves `/games/<name>` and loads `config.json`, `game.js`, and `ui.js`.
3. `UiOrchestrator` mounts the selected environment into `#engine-game-host`.
4. `SimulationRuntime` executes the update loop and calls each game's `ui.render(state)`.

## Engine Modules

- `engine/engine-core.js`
  - Public API: `loadGame`, `startSimulation`, `pauseSimulation`, `resetSimulation`
  - Coordinates loader, UI orchestrator, and runtime state.
- `engine/game-loader.js`
  - Loads environment config and scripts for each game module.
- `engine/simulation-runtime.js`
  - Central frame loop (`requestAnimationFrame`) and pause/reset controls.
- `engine/ui-orchestrator.js`
  - Responsible for host mounting and status updates.

## Game Module Contract

Each environment under `/games/<name>` follows:

- `config.json` — metadata and environment status.
- `game.js` — state model and simulation update logic.
- `ui.js` — mount + render responsibilities.

Additional environment systems can be colocated with each game:

- Orchade: `strategy-engine.js`, `game-map.js`, `economy-system.js`
- SkillHex: `graph-engine.js`, `reputation-system.js`, `player-profile.js`

## Environment Routing

The platform exposes browser routes:

- `/games/mars`
- `/games/orchade`
- `/games/skillhex`

Each route is a standalone runtime page that boots via `EngineCore` and runs through `SimulationRuntime`.

## Workspace Integration

The launcher page `/games/index.html` provides a single studio entrypoint titled **DECIDE ENGINE STUDIO** with cards for Mars, Orchade, and SkillHex.

This structure is ready for workspace callers (such as daxini.xyz and Zayvora execution surfaces) to deep-link directly into each environment route.
