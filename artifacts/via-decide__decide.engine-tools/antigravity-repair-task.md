Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Add BiasPrism as a single-file tool at tools/engine/bias-prism/index.html. BiasPrism is a "Cognitive Linter" for text. When an AI agent generates a report or reads a webpage, this tool scans the text for emotional manipulation, logical fallacies, and extreme polarity, stripping away the noise to leave only objective facts. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/bias-prism/index.html - Build a two-pane UI: "Raw Input" (Left) and "Objective Output" (Right). 2. TEXT HIGHLIGHTING LOGIC - Write a Vanilla JS text-parsing function that uses regex dictionaries to find: * Emotionally Charged Words (e.g., "destroyed", "shocking", "outrageous") -> Highlight Red. * Sweeping Generalizations (e.g., "always", "never", "everyone") -> Highlight Yellow. * Hedge Words (e.g., "might", "possibly", "experts say" without naming them) -> Highlight Purple. - The Right Pane ("Objective Output") automatically generates a version of the text with these flagged words redacted or replaced by neutral brackets [subjective claim removed]. 3. THE OBJECTIVITY SCORE (Persistence) Use localStorage key "bias_prism_stats" to persist: { totalDocumentsScanned, averageObjectivityScore, fallaciesCaught } Update and save after every scan. 4. MANIFEST ENTRY { "id": "bias-prism", "name": "BiasPrism", "title": "Cognitive Linter", "path": "tools/engine/bias-prism/index.html", "tags": ["research", "bias", "linter", "text-analysis"], "tier": "engine", "icon": "👁️🗨️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "biasprism", "linter", "objective", "scan" Route to tools/engine/bias-prism/index.html. 6. HUD ADDITIONS

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