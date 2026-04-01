Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'AIRManager' (The AI Resource Manager). Create a new folder /AIRManager and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Roster Dashboard: - A grid displaying currently active "Agent Profiles" as glass-morphic ID cards. - A massive [ + ONBOARD NEW AGENT ] button. 2. The Onboarding Modal: - Agent Name (e.g., "Viaco Scheduler"). - LLM Model (Dropdown: Gemini 3.1 Pro, Claude 3.5, Local Llama). - System Role (Textarea - meant to paste output from PromptMatrix). - Tool Permissions (Checkboxes/Input to define which functions from ToolForge this agent is allowed to call). - Token Budget (Slider: Max tokens allowed per session - acts as their compute "salary"). 3. The Roster State: - Save the deployed agents to an array of objects in localStorage so the roster persists across reloads. - Add [ EDIT ] and [ OFFBOARD ] (Delete) buttons to each agent's ID card. 4. The Payload Delivery: - A [ DOWNLOAD AIR_ROSTER.JSON ] button. This compiles the entire organization of agents into a single master JSON configuration file that a backend router can use to orchestrate the multi-agent system. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

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