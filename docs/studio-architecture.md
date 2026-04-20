# Studio Architecture

DECIDE Engine Studio now follows a layered AAA-style structure:

- `engine/` contains runtime core, ECS systems, simulation loop, and render/physics/simulation/ui domains.
- `games/` contains modular environments (`mars`, `orchade`, `skillhex`) each with `scripts/`, `ui/`, `config/`, and `game-entry.js`.
- `assets/` centralizes textures, models, audio, icons, and UI resources for shared pipeline loading.
- `tools/` hosts internal dev tooling (`map-editor`, `simulation-debugger`, `ui-builder`).
- `editor/` provides studio control interfaces for browsing environments and runtime logs.

Runtime flow:

`launcher -> engine/core/engine-core.js -> games/<env>/game-entry.js -> engine/runtime/simulation-loop.js`.
