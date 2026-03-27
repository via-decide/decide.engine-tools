Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Add TruthSeer as a single-file tool at tools/engine/truth-seer/index.html. TruthSeer is a "Fact Provenance Firewall" - a visual dashboard that intercepts raw research data fetched by AI agents, breaks it down into individual claims, and scores their reliability before allowing the data into the agent's memory. It filters out fake data by cross-referencing a strict whitelist of top-level domains. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/truth-seer/index.html - Zero external HTML pages. All filtering logic lives inline. - CSS must be scoped to this tool using Vanilla JS and CSS variables matching the global theme. - Include a visual "Confidence Gauge" (SVG or Canvas) that shows a score from 0 to 100. 2. CLAIM EXTRACTION & DOMAIN FILTERING LOGIC - The tool accepts a text payload (the AI's raw research). - It simulates extracting 3-5 "Core Claims" from the text. - For each claim, it runs a Reliability Check: * Trust Tier 1 (100 pts): .gov, .edu, pubmed, arxiv * Trust Tier 2 (70 pts): .org, established news wire (reuters, ap) * Blocked Tier (0 pts - Auto-Reject): social media domains, known clickbait URLs, missing citations. - If a claim falls into the Blocked Tier, it is highlighted in red and visually "quarantined" (strikethrough text). 3. THE TRUTH VAULT (Persistence) Use localStorage key "truth_seer_vault" to persist: { totalClaimsVerified, blockedFakes, savedFacts: [] } Load on init, save every time a payload passes the firewall. 4. MANIFEST ENTRY The tool must register itself with the manifest so the engine can find it: { "id": "truth-seer", "name": "TruthSeer", "title": "Provenance Firewall", "path": "tools/engine/truth-seer/index.html", "tags": ["research", "fact-check", "filter", "security"], "tier": "engine", "icon": "🛡️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "truthseer", "factcheck", "firewall", "verify" All four must route to tools/engine/truth-seer/index.html. 6. HUD ADDITIONS - "Quarantine Zone" UI box on the right side showing recently blocked fake data.

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