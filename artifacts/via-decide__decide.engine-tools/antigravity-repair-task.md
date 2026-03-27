Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Add SourceCartography as a single-file tool at tools/engine/source-cartography/index.html. SourceCartography is a "Citation Graph Mapper" - a pan/zoom network map that visualizes where research data actually comes from. It prevents "Circular Reporting" (where multiple fake news sites cite each other to look legitimate) by tracing data back to a single primary node. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/source-cartography/index.html - Use an inline HTML5 Canvas or SVG approach for the network graph. - Nodes represent URLs/Authors. Edges represent citations ("Source A cites Source B"). 2. GRAPH HIGHLIGHTING LOGIC - Primary Sources (Original Studies/Data) = Amber Nodes (#FF8F00). - Secondary Sources (Articles analyzing the data) = Blue Nodes. - Unverified/Circular Sources = Red Nodes with a pulsating CSS animation. - If the graph detects a "Loop" (A cites B, B cites C, C cites A), the UI must flash a "CIRCULAR REPORTING DETECTED" warning banner and sever the connection. 3. MOCK DATASET INJECTION - Provide a robust inline mockCitationData array to demonstrate the tool. - Include at least 3 distinct clusters: 1. A healthy academic cluster leading to a Tier 1 node. 2. A fake news echo-chamber (circular loop). 3. A solitary unverified blog post claiming a massive statistic. 4. MANIFEST ENTRY { "id": "source-cartography", "name": "SourceCartography", "title": "Citation Graph Mapper", "path": "tools/engine/source-cartography/index.html", "tags": ["research", "graph", "citations", "nodes"], "tier": "engine", "icon": "🕸️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "sourcegraph", "citations", "map-sources" Route to tools/engine/source-cartography/index.html. 6. HUD ADDITIONS

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