Branch: simba/add-sourcecartography-as-a-single-file-tool-at-t
Title: Add SourceCartography as a single-file tool at tools/engine/source-ca...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add SourceCartography as a single-file tool at tools/engine/source-cartography/index.html. SourceCartography is a "Citation Graph Mapper" - a pan/zoom network map that visualizes where research data actually comes from. It prevents "Circular Reporting" (where multiple fake news sites cite each other to look legitimate) by tracing data back to a single primary node. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/source-cartography/index.html - Use an inline HTML5 Canvas or SVG approach for the network graph. - Nodes represent URLs/Authors. Edges represent citations ("Source A cites Source B"). 2. GRAPH HIGHLIGHTING LOGIC - Primary Sources (Original Studies/Data) = Amber Nodes (#FF8F00). - Secondary Sources (Articles analyzing the data) = Blue Nodes. - Unverified/Circular Sources = Red Nodes with a pulsating CSS animation. - If the graph detects a "Loop" (A cites B, B cites C, C cites A), the UI must flash a "CIRCULAR REPORTING DETECTED" warning banner and sever the connection. 3. MOCK DATASET INJECTION - Provide a robust inline mockCitationData array to demonstrate the tool. - Include at least 3 distinct clusters: 1. A healthy academic cluster leading to a Tier 1 node. 2. A fake news echo-chamber (circular loop). 3. A solitary unverified blog post claiming a massive statistic. 4. MANIFEST ENTRY { "id": "source-cartography", "name": "SourceCartography", "title": "Citation Graph Mapper", "path": "tools/engine/source-cartography/index.html", "tags": ["research", "graph", "citations", "nodes"], "tier": "engine", "icon": "🕸️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "sourcegraph", "citations", "map-sources" Route to tools/engine/source-cartography/index.html. 6. HUD ADDITIONS
Branch: simba/add-truthseer-as-a-single-file-tool-at-toolsengi
Title: Add TruthSeer as a single-file tool at tools/engine/truth-seer/index....

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add TruthSeer as a single-file tool at tools/engine/truth-seer/index.html. TruthSeer is a "Fact Provenance Firewall" - a visual dashboard that intercepts raw research data fetched by AI agents, breaks it down into individual claims, and scores their reliability before allowing the data into the agent's memory. It filters out fake data by cross-referencing a strict whitelist of top-level domains. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/truth-seer/index.html - Zero external HTML pages. All filtering logic lives inline. - CSS must be scoped to this tool using Vanilla JS and CSS variables matching the global theme. - Include a visual "Confidence Gauge" (SVG or Canvas) that shows a score from 0 to 100. 2. CLAIM EXTRACTION & DOMAIN FILTERING LOGIC - The tool accepts a text payload (the AI's raw research). - It simulates extracting 3-5 "Core Claims" from the text. - For each claim, it runs a Reliability Check: * Trust Tier 1 (100 pts): .gov, .edu, pubmed, arxiv * Trust Tier 2 (70 pts): .org, established news wire (reuters, ap) * Blocked Tier (0 pts - Auto-Reject): social media domains, known clickbait URLs, missing citations. - If a claim falls into the Blocked Tier, it is highlighted in red and visually "quarantined" (strikethrough text). 3. THE TRUTH VAULT (Persistence) Use localStorage key "truth_seer_vault" to persist: { totalClaimsVerified, blockedFakes, savedFacts: [] } Load on init, save every time a payload passes the firewall. 4. MANIFEST ENTRY The tool must register itself with the manifest so the engine can find it: { "id": "truth-seer", "name": "TruthSeer", "title": "Provenance Firewall", "path": "tools/engine/truth-seer/index.html", "tags": ["research", "fact-check", "filter", "security"], "tier": "engine", "icon": "🛡️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "truthseer", "factcheck", "firewall", "verify" All four must route to tools/engine/truth-seer/index.html. 6. HUD ADDITIONS - "Quarantine Zone" UI box on the right side showing recently blocked fake data.
Branch: simba/add-vialogic-as-a-single-file-tool-at-toolsgames
Title: Add ViaLogic as a single-file tool at tools/games/vialogic/index.html...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add ViaLogic as a single-file tool at tools/games/vialogic/index.html. ViaLogic is a "Cartography of Minds" - a pan/zoom exploration map where each mathematician is a living node that grows via tree-root logic (Orchade

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.