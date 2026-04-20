# Game Module Guide

Each simulation environment follows this contract:

- `game-entry.js` registers module metadata in `window.DECIDE_GAME_MODULES`.
- `scripts/` contains simulation logic and optional subsystem scripts.
- `ui/` contains runtime HUD rendering modules.
- `config/config.json` stores environment metadata.

## Required game API
`gameFactory()` result must expose:
- `createInitialState()`
- `update(state, frameContext, ecs)`

## Required UI API
`uiFactory()` result must expose:
- `mount(hostNode)`
- `render(state, ecs)`

## Workspace integration targets
- Daxini workspace route: `games/<env>/index.html`
- Zayvora execution route: `games/<env>/index.html`

Environments currently initialized:
- Mars Simulation
- Orchade Strategy
- SkillHex Capability Graph
