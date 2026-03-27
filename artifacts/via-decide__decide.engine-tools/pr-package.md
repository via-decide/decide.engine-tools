Branch: simba/add-sourcecartography-as-a-single-file-tool-at-t
Title: Add SourceCartography as a single-file tool at tools/engine/source-ca...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add SourceCartography as a single-file tool at tools/engine/source-cartography/index.html. SourceCartography is a "Citation Graph Mapper" - a pan/zoom network map that visualizes where research data actually comes from. It prevents "Circular Reporting" (where multiple fake news sites cite each other to look legitimate) by tracing data back to a single primary node. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/source-cartography/index.html - Use an inline HTML5 Canvas or SVG approach for the network graph. - Nodes represent URLs/Authors. Edges represent citations ("Source A cites Source B"). 2. GRAPH HIGHLIGHTING LOGIC - Primary Sources (Original Studies/Data) = Amber Nodes (#FF8F00). - Secondary Sources (Articles analyzing the data) = Blue Nodes. - Unverified/Circular Sources = Red Nodes with a pulsating CSS animation. - If the graph detects a "Loop" (A cites B, B cites C, C cites A), the UI must flash a "CIRCULAR REPORTING DETECTED" warning banner and sever the connection. 3. MOCK DATASET INJECTION - Provide a robust inline mockCitationData array to demonstrate the tool. - Include at least 3 distinct clusters: 1. A healthy academic cluster leading to a Tier 1 node. 2. A fake news echo-chamber (circular loop). 3. A solitary unverified blog post claiming a massive statistic. 4. MANIFEST ENTRY { "id": "source-cartography", "name": "SourceCartography", "title": "Citation Graph Mapper", "path": "tools/engine/source-cartography/index.html", "tags": ["research", "graph", "citations", "nodes"], "tier": "engine", "icon": "🕸️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "sourcegraph", "citations", "map-sources" Route to tools/engine/source-cartography/index.html. 6. HUD ADDITIONS

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.