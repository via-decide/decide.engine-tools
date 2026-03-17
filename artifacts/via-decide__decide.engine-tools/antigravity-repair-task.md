Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement a new engine tool called integrity-sandbox-analyzer. 1. Create directory tools/engine/integrity-sandbox-analyzer/. 2. Create config.json with category "engine", tags ["security", "moderation", "integrity"], and inputs ["test_payload", "active_filters"]. 3. Create index.html and tool.js. The tool should display a dual-pane interface: an input pane for drafting "mock user posts" (text or JSON metadata), and a live output pane showing the moderation sequence. 4. Import shared/agent-runtime.js and link shared/shared.css. 5. The tool.js logic must simulate a backend moderation pipeline. When a payload is submitted, route it through a sequential chain of mock AI agents (e.g., "Spam Filter", "Toxicity Check", "PII Redaction"). Visually display the execution time, status (Pass/Fail/Flagged), and confidence score for each step. 6. Register the tool in shared/tool-registry.js by adding its directory to the importableToolDirs array. 7. Add the tool route to the static map in router.js.

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