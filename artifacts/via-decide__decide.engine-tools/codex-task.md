You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
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