Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Initiate Daxini Revival Protocol on the 'ViaLogic' and 'ViaMath' game modules. (Execute on one, then adapt for the other). 1. Consolidate into a single index.html file. 2. VIEWPORT LOCK: Add touch-action: none; to the CSS body and e.preventDefault() on all game container touch events to prevent the iframe from scrolling during gameplay. 3. GAME LOOP REPAIR: Ensure the core logic (timer, score tracking, win/loss states) is intact. 4. UI UPGRADE: Apply Daxini aesthetic. Dark void (#030508) background. Use glass-morphic tiles for the puzzle pieces. Saffron (#ff671f) for errors/timer warnings, Cyan (#00e5ff) for success. 5. MODALS: Build a pure CSS/JS glass-morphic "Game Over / Score" modal with a Restart button.

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