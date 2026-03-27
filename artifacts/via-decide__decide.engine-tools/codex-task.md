You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Add BiasPrism as a single-file tool at tools/engine/bias-prism/index.html. BiasPrism is a "Cognitive Linter" for text. When an AI agent generates a report or reads a webpage, this tool scans the text for emotional manipulation, logical fallacies, and extreme polarity, stripping away the noise to leave only objective facts. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/bias-prism/index.html - Build a two-pane UI: "Raw Input" (Left) and "Objective Output" (Right). 2. TEXT HIGHLIGHTING LOGIC - Write a Vanilla JS text-parsing function that uses regex dictionaries to find: * Emotionally Charged Words (e.g., "destroyed", "shocking", "outrageous") -> Highlight Red. * Sweeping Generalizations (e.g., "always", "never", "everyone") -> Highlight Yellow. * Hedge Words (e.g., "might", "possibly", "experts say" without naming them) -> Highlight Purple. - The Right Pane ("Objective Output") automatically generates a version of the text with these flagged words redacted or replaced by neutral brackets [subjective claim removed]. 3. THE OBJECTIVITY SCORE (Persistence) Use localStorage key "bias_prism_stats" to persist: { totalDocumentsScanned, averageObjectivityScore, fallaciesCaught } Update and save after every scan. 4. MANIFEST ENTRY { "id": "bias-prism", "name": "BiasPrism", "title": "Cognitive Linter", "path": "tools/engine/bias-prism/index.html", "tags": ["research", "bias", "linter", "text-analysis"], "tier": "engine", "icon": "👁️🗨️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "biasprism", "linter", "objective", "scan" Route to tools/engine/bias-prism/index.html. 6. HUD ADDITIONS

CONSTRAINTS
Preserve existing code; prefer additive changes.

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