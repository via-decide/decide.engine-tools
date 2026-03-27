You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Add SourceCartography as a single-file tool at tools/engine/source-cartography/index.html. SourceCartography is a "Citation Graph Mapper" - a pan/zoom network map that visualizes where research data actually comes from. It prevents "Circular Reporting" (where multiple fake news sites cite each other to look legitimate) by tracing data back to a single primary node. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/source-cartography/index.html - Use an inline HTML5 Canvas or SVG approach for the network graph. - Nodes represent URLs/Authors. Edges represent citations ("Source A cites Source B"). 2. GRAPH HIGHLIGHTING LOGIC - Primary Sources (Original Studies/Data) = Amber Nodes (#FF8F00). - Secondary Sources (Articles analyzing the data) = Blue Nodes. - Unverified/Circular Sources = Red Nodes with a pulsating CSS animation. - If the graph detects a "Loop" (A cites B, B cites C, C cites A), the UI must flash a "CIRCULAR REPORTING DETECTED" warning banner and sever the connection. 3. MOCK DATASET INJECTION - Provide a robust inline mockCitationData array to demonstrate the tool. - Include at least 3 distinct clusters: 1. A healthy academic cluster leading to a Tier 1 node. 2. A fake news echo-chamber (circular loop). 3. A solitary unverified blog post claiming a massive statistic. 4. MANIFEST ENTRY { "id": "source-cartography", "name": "SourceCartography", "title": "Citation Graph Mapper", "path": "tools/engine/source-cartography/index.html", "tags": ["research", "graph", "citations", "nodes"], "tier": "engine", "icon": "🕸️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "sourcegraph", "citations", "map-sources" Route to tools/engine/source-cartography/index.html. 6. HUD ADDITIONS

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