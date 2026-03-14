You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Add a new standalone tool called json-formatter in tools/json-formatter/. Title: "JSON Formatter". Description: "Paste JSON, get formatted and validated output.". Category: "coders". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.
Add a new standalone tool called api-request-builder in tools/api-request-builder/. Title: "API Request Builder". Description: "Build and test HTTP requests with headers and body.". Category: "coders". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.
Add a new standalone tool called health-check-dashboard in tools/health-check-dashboard/. Title: "Health Check Dashboard". Description: "Monitor tool ecosystem health: registry, router, broken links.". Category: "system". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.
Add llm-action-parser tool in tools/engine/llm-action-parser/ with config.json, index.html, tool.js. Backend testing UI that accepts plain-text real-world actions (e.g., "Read React docs"). Simulates the 4-pipeline logic (Absorption, Consolidation, Specialization, Yield) to generate a strict JSON payload mapping the action to game stat changes (Root increase, Water cost). Vanilla JS.
Add growth-milestone-engine tool in tools/engine/growth-milestone-engine/ with config.json, index.html, tool.js. Listens for the first successful LLM validation payload (Pipeline 1) and triggers the visual/state change from "Dormant Seed" to "Sprout". Updates UI state and unlocks further trunk growth. Vanilla JS.
Add daily-weather-replenisher tool in tools/engine/daily-weather-replenisher/ with config.json, index.html, tool.js. Simulates the 24-hour real-world cycle. Restores the player's Water (energy) supply to a baseline maximum based on their Soil and Root level to prevent volume-spamming. Vanilla JS logic testing dashboard.
Add genesis-seed-initializer tool in tools/engine/genesis-seed-initializer/ with config.json, index.html, tool.js. Interface for new players to receive an ID and select their "Soil" (industry/domain). Initializes the player profile in localStorage with 0 roots, 10 starting Water, and "Dormant Seed" status. Vanilla JS, UI based on global-theme.css.

CONSTRAINTS
preserve all existing tool folders; preserve standalone behavior; do not break category routing; update router/index/registry/README only as needed; use minimal corrective edits

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