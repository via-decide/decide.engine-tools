You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Initiate Daxini Revival Protocol on a game/simulation tool (e.g., ViaLogic, ViaMath, or Mars Sim). 1. Consolidate into a SINGLE index.html file. 2. IFRAME & TOUCH OPTIMIZATION: Games break inside iframes if the user accidentally scrolls. Add touch-action: none; to the CSS body and e.preventDefault() to touch event listeners to lock the viewport. 3. UI UPGRADE: Apply the Daxini Aesthetic. Background: #030508. Fonts: JetBrains Mono (tech/scores) & Syne (titles). Accents: Matrix Green (#00e5ff) for success, Saffron (#ff671f) for warnings/errors. 4. GAME LOGIC REPAIR: Ensure the core game loop, score tracking, and win/loss states are fully functional. Add a "Game Over" glass-morphic modal with a "Restart" button.

CONSTRAINTS
Pure Vanilla JS. No Canvas libraries (Phaser/Threejs) unless already present. No NPM.

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