Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'PayloadPruner' (The JSON Token Optimizer). Create a new folder /PayloadPruner and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI: Left pane <textarea> for pasting raw, bloated JSON. Right pane <textarea> for the pruned output. 2. The Pruning Engine: Write a recursive JavaScript function that parses the input JSON and applies these rules: - IF it encounters an Array: Keep ONLY the first item (index 0) and discard the rest. Add a dummy string "_NOTE": "Array truncated for LLM context" as the second item if it was truncated. - IF it encounters a String longer than 40 characters: Truncate it and append .... 3. Feature Toggle: Add a checkbox [ ] "Generate TypeScript Interfaces Instead". If checked, instead of pruned JSON, use basic JS logic to map the JSON keys to a TS Interface (e.g., id: string;). 4. Real-Time Stats: Display a token/character comparison at the top: Original: 45KB ➔ Pruned: 2KB (95% Saved). 5. Add a [ COPY PRUNED PAYLOAD ] button. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

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