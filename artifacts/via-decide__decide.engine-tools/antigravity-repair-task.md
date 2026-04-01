Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'DaxiniOrrery' (The 3D Neural Population Map). Create a new folder /DaxiniOrrery and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Population Loader: - Use Octokit to fetch the list of folders from via-decide/ViaLogic/people. - Fetch the identity.json for each persona (or a sampled batch to maintain speed). 2. The 3D Engine (Pure Canvas 2D - No Libraries): - Project 3D coordinates $(x, y, z)$ onto a 2D screen using basic perspective math: $x_{proj} = \frac{x \cdot fov}{z + fov} + center_{x}$ $y_{proj} = \frac{y \cdot fov}{z + fov} + center_{y}$ - Render 6,000 individual 'stars'. 3. Gravitational Clustering: - Assign each persona a color based on their 'Role' metadata. - Apply a 'Target Attraction' force so stars of the same role pull toward a central coordinate, creating 'Intelligence Nebulas'. 4. Interactive HUD: - As the user moves the mouse, rotate the starfield. - Clicking a star reveals a floating Daxini-style card with that person's bio and the "Tokens Saved" audit line. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

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