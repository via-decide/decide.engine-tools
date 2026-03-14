Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Create tools/engine/upsc-master-os/. Take the provided monolithic "UPSC 2026 Engine" prototype and split it into the standard Orchard Engine 3-file structure. 1. index.html: Contain the DOM, Tailwind/Chart.js/PDF.js CDN scripts, and the inline CSS. 2. tool.js: Extract all the vanilla JavaScript objects (AppData, YouTubeAPI, PDFExtractor, Orb, StudyEngine, Missions, ResearchVault, Tracker, PYQ, AIEval, ChartsData) and the DOMContentLoaded event listeners into this file. 3. config.json: Create the metadata for the tool registry (e.g., isEngineTool: false, gameIcon: "🏛️", gameDescription: "Master Operating System for UPSC 2026 Preparation").

RULES
1. Audit touched files first and identify regressions.
2. Preserve architecture and naming conventions.
3. Make minimal repairs only; do not expand scope.
4. Re-run checks and provide concise root-cause notes.
5. Return complete contents for changed files only.

REPO CONTEXT
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
- package.json snippet:
not found
- pyproject snippet:
not found