Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Develop the Automated WebAssembly Publisher CI/CD Bot (via-wasm-publish). 1. Write a shell/Python script that triggers the Emscripten build chain to compile the core C++ engine into a .wasm binary. 2. Implement an automated versioning system that bumps the semantic version number and generates a CHANGELOG.md based on recent commit messages. 3. Build a deployment script that automatically creates a Pull Request (PR) pushing the new .wasm payload directly to the viadecide.com repository.
Build the Web-Optimized Level Exporter (via-level-export). 1. Create a CLI tool that parses the engine's proprietary 3D scene files (e.g., .via_scene). 2. Implement a spatial partitioner (like an Octree generator) that chunks the level data so the viadecide.com web player can stream large maps asynchronously. 3. Output the parsed level into a highly compressed JSON or custom binary format specifically tailored for WebAssembly/WebGL consumption.
Create the Cloud Save & Web Leaderboard Mocker (via-backend-mock). 1. Build a local CLI tool that generates synthetic player data, mock cloud save files, and realistic leaderboard scores. 2. Implement a local HTTP server that mimics the exact REST API responses of viadecide.com's production backend. 3. Allow engine developers to test web-integrated features (like uploading high scores to the site) entirely locally without hitting production databases.
Implement the Live Scene Inspector Bridge (via-scene-bridge). 1. Create a local WebSocket server tool that hooks into the running native game engine. 2. Serialize live game data (Entity IDs, 3D Transforms, Health/Stats) into lightweight JSON packets. 3. Format the data stream so a web-based "Remote Inspector" portal on viadecide.com can connect and visualize the live game state in the browser.
Develop the Engine-to-Web Localization Sync (via-l10n-sync). 1. Build a parser that scans the engine's source code and game scripts for localization tags (e.g., _TR("Start Game")). 2. Write a compiler that extracts these strings and formats them into optimized locale_[lang].json files. 3. Ensure the output schema exactly matches the i18n format expected by the viadecide.com frontend so the game and website share the same translation database.
Build the Web Asset CDN Packager (via-cdn-deploy). 1. Create a CLI tool that takes large compiled game assets (audio, heavy textures) and chunks them into small, streamable binary files for the web. 2. Implement a hashing algorithm (e.g., SHA-256) to generate a web_manifest.json file that viadecide.com uses to load and cache game assets incrementally. 3. Build an auto-uploader script that securely pushes these chunks to a web server or CDN bucket.
Create the Public Telemetry Aggregator Bot. 1. Build a script that processes daily engine usage logs, crash reports, or game session data. 2. Aggregate this data into a sanitized public_telemetry.json file designed to be fetched by viadecide.com to display "Live Engine Stats" (e.g., total sessions, average FPS). 3. Configure a GitHub Action in the tools repo that runs this aggregator script on a cron schedule. 4. CRITICAL: The Action must auto-commit the updated public_telemetry.json file back to the tools repo every few hours.
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