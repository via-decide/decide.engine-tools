Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'ChunkForge' (The Semantic Text Splitter). Create a new folder /ChunkForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Input Panel: - A massive <textarea> for pasting raw documentation, SOPs, or massive codebases. - Slider 1: Chunk Size (Characters) (Range: 250 to 2000, Default 1000). - Slider 2: Overlap (Characters) (Range: 0 to 500, Default 150). - A massive [ FORGE SEMANTIC CHUNKS ] button. 2. The Splitting Engine: - Write a vanilla JS function that splits the text intelligently. - It should prioritize splitting at double newlines (\n\n), then single newlines (\n), then periods (. ), to avoid cutting in the middle of a sentence or code block. - It must respect the Overlap setting (the end of Chunk 1 becomes the beginning of Chunk 2 to preserve contextual flow). 3. Live Telemetry UI: - On the right side, display the results in a scrollable, glass-morphic list.

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