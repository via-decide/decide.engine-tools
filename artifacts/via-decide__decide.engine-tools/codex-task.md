You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Add a new standalone tool "Tetris Game" (id: tetris-game) at tools/games/tetris-game/. Description: "Falling block puzzle with rotation and line clears.". Category: "games" (normalized: "games"). Required files: tools/games/tetris-game/config.json, tools/games/tetris-game/index.html, tools/games/tetris-game/tool.js. config.json must include: id, name, description, category ("games"), audience, inputs, outputs, tags. Load shared/tool-storage.js, shared/shared.css. Use ToolStorage for persistence. Do not use external frameworks. Register in shared/tool-registry.js: add "tools/games/tetris-game" to importableToolDirs array. Register in router.js: add to the tool path static map and modularTools if present. Update index.html: confirm the categorized tool grid will discover the tool via registry. Update README.md: add tool entry under the correct category section. Do NOT modify any existing tool folder. Do NOT break existing shared utilities.

CONSTRAINTS
preserve all existing tool folders and shared modules; additive changes only — never remove or overwrite existing files; do not break category routing or tool discovery; shared/tool-registry.js importableToolDirs: append only, do not reorder; router.js: add to static map only, do not restructure; config.json must pass normalizeTool() without errors; tool.js must work standalone in browser without bundler; use minimal corrective edits — prefer smallest safe changeset

MEMORY CONTEXT
No persistent memory for this chat.

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
# Decide Engine Tools + Orchard Engine Foundation

This repository is a preservation-first browser-native tool mesh by **ViaDecide**.

It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career game system.

## Preservation-first policy

- Existing standalone tools are preserved.
- New systems are additive.
- No unrelated folder is deleted or replaced.
- Tools remain standalone HTML/CSS/JS.

## Tool categories

Tools are organized into 9 categories. The index page at `index.html` renders them grouped automatically from registry metadata.

| Category | Tools |
|---|---|
| **Creators** | PromptAlchemy, Script Generator |
| **Coders** | Code Generator, Code Reviewer, Agent Builder, App Generator |
| **Researchers** | Multi Source Research, Student Research |
| **Business** | Sales Dashbo

- AGENTS snippet:
Rules for coding agents in this repository:

1. Never delete tool folders.
2. Never remove working code from tools.
3. Never replace a tool with a placeholder.
4. Prefer additive changes.
5. Tools must remain standalone HTML apps.
6. Routing must never break existing tools.
7. If reorganizing tools, move them safely and update references.
ENGINE-TOOLS ARCHITECTURE (mandatory compliance)
Tool directory: tools/<tool>/
Required files: config.json, index.html, tool.js
Shared dependencies to import: shared/tool-storage.js, shared/shared.css
config.json must include: id, name, description, category, audience, inputs, outputs, tags
Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js
Do NOT modify any existing tool folder or shared utility file.
Do NOT use external frameworks, CDN packages, or bundlers.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.