Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build 'DaxiniSearch'-a high-performance local indexing and search engine for the ViaLogic ecosystem. CORE ARCHITECTURE (The Inverted Index): 1. The Index Builder: - Create a module indexer/build.js that scans all sub-directories in '/people/'. - Extract 'name', 'id', 'tags', and 'role' from every 'metadata.json'. - Generate a minified atlas-index.bin (Binary format) to keep the payload under 500KB even for 24,000 entries. 2. The Fuzzy-Match Logic: - Implement a 'Levenshtein Distance' algorithm for fuzzy searching. - Ensure the search can handle typos (e.g., 'Newton' instead of 'Isac Newton'). 3. The Portal Integration: - Add a 'Quantum Search Bar' to the root 'index.html'.

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
⭐ If this saved you $X in API costs, star this repo Help other devs discover metadata-driven development # VIA Platform: 58-Tool Ecosystem with 80% Token Savings > **Before you fork another monorepo: This one saved me $33,756 in API costs and 2.25M tokens. Here's how.** [Detailed breakdown...] #
- AGENTS snippet:
# AGENTS.md — ViaDecide Studio ## Rules for all AI coding agents working in this repository --- ## IDENTITY This is a **production codebase** for a $199/month subscription product on the Play Store. Every change you make affects paying subscribers. Treat it accordingly. --- ## HARD GATE 1 — DES
- package.json snippet:
{ "name": "decide-engine-tools", "version": "1.0.0", "description": "ViaDecide Studio — 37 decision-making, productivity and game tools", "private": true, "scripts": { "test": "node tests/run-all.js", "test:unit": "node tests/unit/run.js", "test:smoke": "node tests/smoke/run.js