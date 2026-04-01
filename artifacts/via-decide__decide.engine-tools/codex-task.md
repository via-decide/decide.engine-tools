You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'ValidatorCore' (The Autonomous PR Auditor). Create a new folder /ValidatorCore and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The PR Ingestor: - Input field for a GitHub PR URL. - Use Octokit to fetch the "Diff" of that PR. 2. The Multi-Modal Audit (The Test): - Send the PR Diff AND the user's original Telegram prompt (Text/Audio/Image) to Gemini 1.5 Pro.

CONSTRAINTS
Zero NPM dependencies. Must handle fetching binary image data from previous Telegram messages if the PR was triggered by a photo.
Build a new micro-frontend named 'DaxiniOrrery' (The 3D Neural Population Map). Create a new folder /DaxiniOrrery and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Population Loader: - Use Octokit to fetch the list of folders from via-decide/ViaLogic/people. - Fetch the identity.json for each persona (or a sampled batch to maintain speed). 2. The 3D Engine (Pure Canvas 2D - No Libraries): - Project 3D coordinates $(x, y, z)$ onto a 2D screen using basic perspective math: $x_{proj} = \frac{x \cdot fov}{z + fov} + center_{x}$ $y_{proj} = \frac{y \cdot fov}{z + fov} + center_{y}$ - Render 6,000 individual 'stars'. 3. Gravitational Clustering: - Assign each persona a color based on their 'Role' metadata. - Apply a 'Target Attraction' force so stars of the same role pull toward a central coordinate, creating 'Intelligence Nebulas'. 4. Interactive HUD: - As the user moves the mouse, rotate the starfield. - Clicking a star reveals a floating Daxini-style card with that person's bio and the "Tokens Saved" audit line. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Must use requestAnimationFrame for smooth 60FPS rendering of 6,000 points. The perspective projection math must be handled manually to keep the file lightweight and sovereign.

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
⭐ If this saved you $X in API costs, star this repo Help other devs discover metadata-driven development # VIA Platform: 58-Tool Ecosystem with 80% Token Savings > **Before you fork another monorepo: This one saved me $33,756 in API costs and 2.25M tokens. Here's how.** [Detailed breakdown...] #

- AGENTS snippet:
# AGENTS.md — ViaDecide Studio ## Rules for all AI coding agents working in this repository --- ## IDENTITY This is a **production codebase** for a $199/month subscription product on the Play Store. Every change you make affects paying subscribers. Treat it accordingly. --- ## HARD GATE 1 — DES
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