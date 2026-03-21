Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement the WASM Web Player Packager (via-wasm-wrap). 1. Create a packaging tool that takes the engine's compiled WebAssembly (.wasm) output and wraps it in a standardized HTML/JS component. 2. Build the JavaScript interop layer that allows viadecide.com to send commands to the engine (e.g., resizing, fullscreen, passing user inputs). 3. Output a clean <via-engine-player> web component bundle that can be dropped seamlessly into the viadecide.com repository.
Develop the Engine-to-Web Documentation Generator (via-doc-gen). 1. Build a parser that scans the main engine's source code for specially formatted comments and API definitions. 2. Write an exporter that converts these parsed comments into structured JSON and static Markdown files. 3. Format the output so it can be directly ingested and rendered by viadecide.com's frontend for a live "API Reference" page.
Build the Web Asset Optimizer CLI (via-web-export). 1. Create a command-line tool that targets the engine's raw assets and specifically optimizes them for viadecide.com's web player. 2. Implement an image converter that crushes textures into highly compressed WebP formats for fast browser loading. 3. Implement a 3D model converter that translates raw engine meshes into web-standard glTF/glb files.

RULES
1. Audit touched files first and identify regressions.
2. Preserve architecture and naming conventions.
3. Make minimal repairs only; do not expand scope.
4. Re-run checks and provide concise root-cause notes.
5. Return complete contents for changed files only.

SOP: REPAIR PROTOCOL (MANDATORY)
1. Strict Fix Only: Do not use repair mode to expand scope or add features.
2. Regression Check: Audit why previous attempt failed before proposing a fix.
3. Minimal Footprint: Only return contents for the actual repaired files.

REPO CONTEXT
- README snippet:
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g
- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
- package.json snippet:
not found