Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Initiate Daxini Revival Protocol on a game/simulation tool (e.g., ViaLogic, ViaMath, or Mars Sim). 1. Consolidate into a SINGLE index.html file. 2. IFRAME & TOUCH OPTIMIZATION: Games break inside iframes if the user accidentally scrolls. Add touch-action: none; to the CSS body and e.preventDefault() to touch event listeners to lock the viewport. 3. UI UPGRADE: Apply the Daxini Aesthetic. Background: #030508. Fonts: JetBrains Mono (tech/scores) & Syne (titles). Accents: Matrix Green (#00e5ff) for success, Saffron (#ff671f) for warnings/errors. 4. GAME LOGIC REPAIR: Ensure the core game loop, score tracking, and win/loss states are fully functional. Add a "Game Over" glass-morphic modal with a "Restart" button.
Initiate the "Daxini Revival Protocol" on the broken tools within this repository. Target the first broken or incomplete tool (e.g., SOP Builder, HexWars, or any pending tool). Refactor the tool to match the exact architectural standard of the 'PromptAlchemy' repository: 1. Consolidate into a SINGLE index.html file containing HTML, CSS, and Vanilla JS. 2. Fix all broken UI components. Apply the "Daxini Aesthetic":
Initiate Daxini Revival Protocol on a data/utility tool (e.g., SOP Builder or Revenue Forecaster). 1. Consolidate into a SINGLE index.html file. 2. STATE PERSISTENCE: Wire the tool to automatically save user inputs to localStorage on every keystroke, so data isn't lost if the iframe reloads. Add a "Clear Data" button. 3. EXPORT ENGINE: Repair or implement the final output generation. Add clear, glowing buttons for [COPY TO CLIPBOARD] and [EXPORT AS .TXT / .MD]. 4. UI UPGRADE: Apply Daxini styling. Dark mode (#030508), glass-morphic input fields (rgba(255,255,255,0.05) with backdrop-filter), and Cyan/Saffron accents for primary actions.
Initiate Daxini Revival Protocol on a swipe-based learning/assessment tool (e.g., Alchemist). 1. Consolidate into a SINGLE index.html file. 2. GESTURE ENGINE FIX: Repair the touchstart/touchmove/touchend logic for the swipe cards. Ensure cards visually rotate and fade out as they are dragged left or right. 3. DECK LOGIC: Ensure the array of questions/cards loops correctly or shows a "Deck Completed" glass modal with a final score/analysis when empty. 4. UI UPGRADE: Apply Daxini styling. Dark void background (#030508). The swipe cards must be glass-morphic (rgba(10, 12, 18, 0.8)) with a subtle Cyan border (rgba(0, 229, 255, 0.3)).

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