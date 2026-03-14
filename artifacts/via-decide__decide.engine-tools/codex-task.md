You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Create tools/engine/upsc-master-os/. Take the provided monolithic "UPSC 2026 Engine" prototype and split it into the standard Orchard Engine 3-file structure. 1. index.html: Contain the DOM, Tailwind/Chart.js/PDF.js CDN scripts, and the inline CSS. 2. tool.js: Extract all the vanilla JavaScript objects (AppData, YouTubeAPI, PDFExtractor, Orb, StudyEngine, Missions, ResearchVault, Tracker, PYQ, AIEval, ChartsData) and the DOMContentLoaded event listeners into this file. 3. config.json: Create the metadata for the tool registry (e.g., isEngineTool: false, gameIcon: "🏛️", gameDescription: "Master Operating System for UPSC 2026 Preparation").

CONSTRAINTS
pure Vanilla JS; standalone execution; do not modify existing tools in the repo; retain the specific CDNs used in the prototype to ensure PDF parsing and Chart rendering function correctly; ensure localStorage key upsc_os_state_v6 persists correctly across reloads.

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