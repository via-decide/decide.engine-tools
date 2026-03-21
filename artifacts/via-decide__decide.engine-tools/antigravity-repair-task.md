Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Create the Headless Cutscene Validator CI Bot (via-cutscene-check). 1. Write a CLI script that parses all compiled cutscene_data.json files in the project. 2. Implement an automated validator that checks for broken references (e.g., the timeline triggers an animation or audio file that no longer exists in the asset directory). 3. Configure a GitHub Action to run this validator on every push, failing the build if a cutscene is broken.

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