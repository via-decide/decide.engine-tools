You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Implement a new engine tool called system-telemetry-dashboard to monitor the health and throughput of the AI agent backend. 1. Create directory tools/engine/system-telemetry-dashboard/. 2. Create config.json with category "engine", tags ["monitoring", "metrics", "health"], and inputs ["telemetry_stream"]. 3. Create index.html and tool.js. The tool should display a multi-panel command center. 4. Import shared/agent-runtime.js and link shared/shared.css. 5. Connect tool.js to the backend telemetry streams established by the PredictiveEngine, EdgeStore, and WorkerPool. 6. Build visual components for: - Live requests per second (RPS). - Active autonomous agents currently deployed and running tasks. - Edge cache hit/miss ratio. - Swarm worker pool availability (Idle vs. Busy threads). 7. Register the tool in shared/tool-registry.js by adding its directory to the importableToolDirs array, and add the route to router.js.

CONSTRAINTS
Do NOT use external charting libraries like Chart.js or Recharts. You must build a lightweight, custom sparkline and bar chart renderer using the HTML5 <canvas> API or raw SVG generation in Vanilla JS. The UI must update at least once per second without memory leaks.

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