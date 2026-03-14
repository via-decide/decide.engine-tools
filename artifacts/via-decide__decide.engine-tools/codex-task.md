You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
rewrite tools/engine/daily-quest-generator/tool.js to add hydrateState() pulling from localStorage key orchard_engine_player_state, syncState() pushing back on every quest generation, emitEvent(name, data) for engine:quest_generated events, and a guard that prevents generation if state.water is 0; add Orchard palette inline styles to index.html matching Soil #1A1614 Leaf #52B756 Water #29B6F6 Gold #FFCA28

CONSTRAINTS
additive rewrite of tool.js; update index.html style block only; do not touch config.json or shared files
rewrite tools/engine/seed-exchange/tool.js to add hydrateState() pulling from localStorage key orchard_engine_player_state, syncState() pushing back on every exchange, emitEvent(name, data) for engine:seed_exchanged events, and a credits guard that blocks exchange if state.credits is less than 1; add Orchard palette inline styles to index.html matching Soil #1A1614 Leaf #52B756 Water #29B6F6 Gold #FFCA28

CONSTRAINTS
additive rewrite of tool.js; update index.html style block only; do not touch config.json or shared files
rewrite tools/engine/seed-exchange/tool.js only - replace generic stub with: hydrateState() reading localStorage.getItem('orchard_engine_player_state'), syncState() writing back after each exchange, emitEvent dispatching engine:seed_exchanged, and a guard returning early if state.credits<1; add a <style> block inside tools/engine/seed-exchange/index.html only setting body background #1A1614 and button accent #FFCA28

CONSTRAINTS
edit tools/engine/seed-exchange/tool.js and tools/engine/seed-exchange/index.html only; do not touch router.js tool-registry.js config.json README or any file outside this folder
in tools/engine/growth-milestone-engine/tool.js fix the animate3D function to pause rendering when the tab is hidden - add document.addEventListener visibilitychange to set a paused flag and only call requestAnimationFrame when document.visibilityState is visible; also add a once flag to wireIncomingEvents so listeners are never duplicated if init fires more than once

CONSTRAINTS
minimal edit to existing tool.js only; do not change index.html or config.json; preserve all existing game logic

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

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.