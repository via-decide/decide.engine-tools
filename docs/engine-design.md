# Engine Design

## Core
- `engine/core/engine-core.js`: orchestrates loading, start/pause/reset, and ECS integration.
- `engine/core/game-loader.js`: loads modular environment entries and related scripts.
- `engine/core/asset-loader.js`: central asset fetch + cache entry point.

## Runtime
- `engine/runtime/simulation-loop.js`: frame loop abstraction using `requestAnimationFrame`.

## ECS
- `engine/systems/entity-manager.js`: entity spawn/lifecycle.
- `engine/systems/component-registry.js`: component attachment/indexing.
- `engine/systems/system-runner.js`: frame system execution.
- `engine/systems/entity-system.js`: aggregated ECS API consumed by runtime.

## Compatibility
Existing launcher/runtime pages remain available at:
- `/games/index.html`
- `/games/mars/index.html`
- `/games/orchade/index.html`
- `/games/skillhex/index.html`
