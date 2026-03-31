You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Initiate Daxini Revival Protocol on a data/utility tool (e.g., SOP Builder or Revenue Forecaster). 1. Consolidate into a SINGLE index.html file. 2. STATE PERSISTENCE: Wire the tool to automatically save user inputs to localStorage on every keystroke, so data isn't lost if the iframe reloads. Add a "Clear Data" button. 3. EXPORT ENGINE: Repair or implement the final output generation. Add clear, glowing buttons for [COPY TO CLIPBOARD] and [EXPORT AS .TXT / .MD]. 4. UI UPGRADE: Apply Daxini styling. Dark mode (#030508), glass-morphic input fields (rgba(255,255,255,0.05) with backdrop-filter), and Cyan/Saffron accents for primary actions.

CONSTRAINTS
Pure Vanilla JS. Do not use external PDF libraries unless absolutely necessary (prefer simple text/MD export).
Initiate Daxini Revival Protocol on a swipe-based learning/assessment tool (e.g., Alchemist). 1. Consolidate into a SINGLE index.html file. 2. GESTURE ENGINE FIX: Repair the touchstart/touchmove/touchend logic for the swipe cards. Ensure cards visually rotate and fade out as they are dragged left or right. 3. DECK LOGIC: Ensure the array of questions/cards loops correctly or shows a "Deck Completed" glass modal with a final score/analysis when empty. 4. UI UPGRADE: Apply Daxini styling. Dark void background (#030508). The swipe cards must be glass-morphic (rgba(10, 12, 18, 0.8)) with a subtle Cyan border (rgba(0, 229, 255, 0.3)).

CONSTRAINTS
Pure Vanilla JS. No Hammer.js or external gesture libraries. Math must be handled via native TouchEvents.

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