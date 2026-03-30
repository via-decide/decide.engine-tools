Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Create branch feature/logichub-dual-export. Update tools/engine/logichub/tool.js and index.html. Add two buttons to the action bar: "[EXPORT .MD (PROMPTS & CODE)]" and "[EXPORT PDF]". Implement exportArchitectureMarkdown(map). It must generate a .md file containing the ASCII tree diagram, and for each block, print the EXACT prompt used to generate it, followed by the generated code. Implement exportArchitecturePDF(map) using jspdf. For BOTH exports, implement the Native Web Share API (navigator.share) for mobile devices, gracefully falling back to a standard blob download (a.download) on desktop browsers. Ensure both buttons remain disabled ([LOCKED]) until all blocks are VERIFIED and the architecture is confirmed. Commit with message "feat: add PDF and Markdown dual-export to LogicHub". Push branch and open PR to main titled "Feat: Dual-Export Engine (PDF & MD)"
Create branch feature/logichub-gemini-integration. Update tools/engine/logichub/tool.js. Implement the generateCodeForBlock() function to call generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent. Ensure it passes the dependsOn block code as context in the prompt. Implement the getContextIdeas() function for Orphaned blocks using Gemini. Refactor saveMap() and loadMap() to use the OS's centralized localStorage key (e.g., orchard_logichub_maps) instead of temporary sessionStorage. Add a dynamic, scrolling terminal logger (#lh-logger) that keeps the last 20 events visible. Commit with message "feat: integrate Gemini API and persistent state for LogicHub". Push branch and open PR to main titled "Feat: Gemini API & State Sync"
Create branch feature/logichub-core-ui. Create a new directory tools/engine/logichub/. Inside, create index.html, tool.js, and config.json. Migrate the layout, SVG paths, and CSS of the latest LogicHub node-editor prototype into these files. Ensure the dragging logic, snap-to-port radius (50px), and mobile-responsive palettes are fully functional. Replace the prototype CSS variables (e.g., --bg) with the global OS variables (e.g., --color-soil-dark) so it matches the rest of the game engine's aesthetic. Commit with message "feat: add LogicHub node editor UI to engine tools". Push branch and open PR to main titled "Feat: LogicHub Core UI Migration"

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
⭐ If this saved you $X in API costs, star this repo Help other devs discover metadata-driven development # VIA Platform: 58-Tool Ecosystem with 80% Token Savings > **Before you fork another monorepo: This one saved me $33,756 in API costs and 2.25M tokens. Here's how.** [Detailed breakdown...] #
- AGENTS snippet:
# AGENTS.md — ViaDecide Studio ## Rules for all AI coding agents working in this repository --- ## IDENTITY This is a **production codebase** for a $199/month subscription product on the Play Store. Every change you make affects paying subscribers. Treat it accordingly. --- ## HARD GATE 1 — DES
- package.json snippet:
{ "name": "decide-engine-tools", "version": "1.0.0", "description": "ViaDecide Studio — 37 decision-making, productivity and game tools", "private": true, "scripts": { "test": "node tests/run-all.js", "test:unit": "node tests/unit/run.js", "test:smoke": "node tests/smoke/run.js