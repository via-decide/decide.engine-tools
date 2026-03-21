You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build the Web Audio Compressor & Soundbank Generator (via-audio-crusher). 1. Create a CLI tool that scans the engine's raw /audio_src directory (WAV/FLAC files). 2. Implement an automated compression pipeline that transcodes these heavy files into web-optimized Ogg Vorbis and WebM formats for viadecide.com. 3. Generate a soundbank_manifest.json that maps audio events (e.g., "player_jump") to the compressed file paths, complete with pre-calculated volume normalization data.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write unit tests for the file scanner, the transcoder execution, and the JSON serializer. Commit each of these three modules as separate, atomic pushes.
Implement the Asset Webhook & Cache Invalidator Daemon (via-asset-webhook). 1. Create a background service that watches the final compiled web_assets/ output directory. 2. Upon detecting new optimized web assets (textures, sounds, scripts), generate an MD5 checksum for the new files. 3. Send an authenticated HTTP POST webhook to the viadecide.com backend to immediately invalidate the CDN cache for those specific assets.

CONSTRAINTS
Use a robust HTTP client library. Implement unit tests with mocked HTTP responses to simulate web server success/failure. Commit the file watcher, the hashing logic, and the HTTP client separately.
Create the Playtest Analytics Dashboard Generator (via-playtest-report). 1. Build a local tool that ingests SQLite databases or raw log files generated during local engine playtesting (player pathing, death heatmaps, frame drops). 2. Implement a data aggregator that structures this data into lightweight analytics_payload.json files. 3. Generate a static HTML/JS report widget that can be directly embedded into a secure "Developer Portal" route on viadecide.com.

CONSTRAINTS
@GN8RBot MUST commit the SQLite ingestion, the JSON aggregation, and the HTML generation as completely independent modules. Use TDD for all data transformation functions to inflate commit count.
Develop the Automated WebAssembly Publisher CI/CD Bot (via-wasm-publish). 1. Write a shell/Python script that triggers the Emscripten build chain to compile the core C++ engine into a .wasm binary. 2. Implement an automated versioning system that bumps the semantic version number and generates a CHANGELOG.md based on recent commit messages. 3. Build a deployment script that automatically creates a Pull Request (PR) pushing the new .wasm payload directly to the viadecide.com repository.

CONSTRAINTS
The bot must auto-commit the version bump and the updated changelog back to the tools repository on every successful build. Ensure the build pipeline caches intermediate object files to keep CI runtimes under 3 minutes.
Build the Web-Optimized Level Exporter (via-level-export). 1. Create a CLI tool that parses the engine's proprietary 3D scene files (e.g., .via_scene). 2. Implement a spatial partitioner (like an Octree generator) that chunks the level data so the viadecide.com web player can stream large maps asynchronously. 3. Output the parsed level into a highly compressed JSON or custom binary format specifically tailored for WebAssembly/WebGL consumption.

CONSTRAINTS
Strict TDD required. @GN8RBot MUST write unit tests for every node type (Lights, Meshes, Spawners) before implementing the parsing logic. Commit each node parser as a standalone, atomic push.
Create the Cloud Save & Web Leaderboard Mocker (via-backend-mock). 1. Build a local CLI tool that generates synthetic player data, mock cloud save files, and realistic leaderboard scores. 2. Implement a local HTTP server that mimics the exact REST API responses of viadecide.com's production backend. 3. Allow engine developers to test web-integrated features (like uploading high scores to the site) entirely locally without hitting production databases.

CONSTRAINTS
Implement as a suite of modular data generators (names, scores, inventory items). @GN8RBot MUST write a test for each generator, commit, implement the generator, commit, and verify.
Implement the Live Scene Inspector Bridge (via-scene-bridge). 1. Create a local WebSocket server tool that hooks into the running native game engine. 2. Serialize live game data (Entity IDs, 3D Transforms, Health/Stats) into lightweight JSON packets. 3. Format the data stream so a web-based "Remote Inspector" portal on viadecide.com can connect and visualize the live game state in the browser.

CONSTRAINTS
Implement the network message protocol piece-by-piece. @GN8RBot MUST commit the serialization, deserialization, and socket handling as completely independent modules and pull requests.
Develop the Engine-to-Web Localization Sync (via-l10n-sync). 1. Build a parser that scans the engine's source code and game scripts for localization tags (e.g., _TR("Start Game")). 2. Write a compiler that extracts these strings and formats them into optimized locale_[lang].json files. 3. Ensure the output schema exactly matches the i18n format expected by the viadecide.com frontend so the game and website share the same translation database.

CONSTRAINTS
Commit the regex parser, the JSON serializer, and the test suite in separate pushes. Automate a GitHub Action that auto-commits the locale_*.json files back to the repo whenever source strings are updated.
Build the Web Asset CDN Packager (via-cdn-deploy). 1. Create a CLI tool that takes large compiled game assets (audio, heavy textures) and chunks them into small, streamable binary files for the web. 2. Implement a hashing algorithm (e.g., SHA-256) to generate a web_manifest.json file that viadecide.com uses to load and cache game assets incrementally. 3. Build an auto-uploader script that securely pushes these chunks to a web server or CDN bucket.

CONSTRAINTS
Strict TDD required. @GN8RBot MUST commit the chunking logic, the hashing function, and the manifest generator as completely isolated, atomic commits.
Create the Public Telemetry Aggregator Bot. 1. Build a script that processes daily engine usage logs, crash reports, or game session data. 2. Aggregate this data into a sanitized public_telemetry.json file designed to be fetched by viadecide.com to display "Live Engine Stats" (e.g., total sessions, average FPS). 3. Configure a GitHub Action in the tools repo that runs this aggregator script on a cron schedule. 4. CRITICAL: The Action must auto-commit the updated public_telemetry.json file back to the tools repo every few hours.

CONSTRAINTS
Ensure no sensitive data is leaked into the public JSON. The automated cron commits must have a distinct bot signature.
Add a new standalone tool "Tetris Game" (id: tetris-game) at tools/games/tetris-game/. Description: "Falling block puzzle with rotation and line clears.". Category: "games" (normalized: "games"). Required files: tools/games/tetris-game/config.json, tools/games/tetris-game/index.html, tools/games/tetris-game/tool.js. config.json must include: id, name, description, category ("games"), audience, inputs, outputs, tags. Load shared/tool-storage.js, shared/shared.css. Use ToolStorage for persistence. Do not use external frameworks. Register in shared/tool-registry.js: add "tools/games/tetris-game" to importableToolDirs array. Register in router.js: add to the tool path static map and modularTools if present. Update index.html: confirm the categorized tool grid will discover the tool via registry. Update README.md: add tool entry under the correct category section. Do NOT modify any existing tool folder. Do NOT break existing shared utilities.

CONSTRAINTS
preserve all existing tool folders and shared modules; additive changes only — never remove or overwrite existing files; do not break category routing or tool discovery; shared/tool-registry.js importableToolDirs: append only, do not reorder; router.js: add to static map only, do not restructure; config.json must pass normalizeTool() without errors; tool.js must work standalone in browser without bundler; use minimal corrective edits — prefer smallest safe changeset

MEMORY CONTEXT
No persistent memory for this chat.
Implement the WASM Web Player Packager (via-wasm-wrap). 1. Create a packaging tool that takes the engine's compiled WebAssembly (.wasm) output and wraps it in a standardized HTML/JS component. 2. Build the JavaScript interop layer that allows viadecide.com to send commands to the engine (e.g., resizing, fullscreen, passing user inputs). 3. Output a clean <via-engine-player> web component bundle that can be dropped seamlessly into the viadecide.com repository.

CONSTRAINTS
Isolate the JS interop layer, the CSS canvas styling, and the packaging logic. @GN8RBot MUST commit each of these as separate feature branches and merges.
Develop the Engine-to-Web Documentation Generator (via-doc-gen). 1. Build a parser that scans the main engine's source code for specially formatted comments and API definitions. 2. Write an exporter that converts these parsed comments into structured JSON and static Markdown files. 3. Format the output so it can be directly ingested and rendered by viadecide.com's frontend for a live "API Reference" page.

CONSTRAINTS
Commit each language parser (C++, JS, etc.) independently. Implement automated tests to verify the JSON output matches the expected schema for the website.
Build the Web Asset Optimizer CLI (via-web-export). 1. Create a command-line tool that targets the engine's raw assets and specifically optimizes them for viadecide.com's web player. 2. Implement an image converter that crushes textures into highly compressed WebP formats for fast browser loading. 3. Implement a 3D model converter that translates raw engine meshes into web-standard glTF/glb files.

CONSTRAINTS
Strict TDD. @GN8RBot MUST commit every single file parser, compression algorithm, and unit test as a separate, atomic push.

PROCESS (MANDATORY)
1. Read README.md and AGENTS.md before editing.
2. Audit architecture before coding. Summarize current behavior.
3. Preserve unrelated working code. Prefer additive modular changes.
4. Implement the smallest safe change set for the stated goal.
5. Run validation commands and fix discovered issues.
6. Self-review for regressions, missing env wiring, and docs drift.
7. Return complete final file contents for every modified or created file.

REPO AUDIT CONTEXT
- Description: 
- Primary language: HTML
- README snippet:
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g

- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
ENGINE-TOOLS ARCHITECTURE (mandatory compliance)
Tool directory: tools/<tool>/
Required files: config.json, index.html, tool.js
Shared dependencies to import: shared/tool-storage.js, shared/shared.css
config.json must include: id, name, description, category, audience, inputs, outputs, tags
Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js
Do NOT modify any existing tool folder or shared utility file.
Do NOT use external frameworks, CDN packages, or bundlers.

SOP: PRE-MODIFICATION PROTOCOL (MANDATORY)
1. Adherence to Instructions: No deviations without explicit user approval.
2. Mandatory Clarification: Immediately ask if instructions are ambiguous or incomplete.
3. Proposal First: Always propose optimizations or fixes before implementing them.
4. Scope Discipline: Do not add unrequested features or modify unrelated code.
5. Vulnerability Check: Immediately flag and explain security risks.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.