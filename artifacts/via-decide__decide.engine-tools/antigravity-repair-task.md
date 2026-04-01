Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'AIRMount' (The Local File System Bridge). Create a new folder /AIRMount and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Secure Mounting Engine: - A massive [ MOUNT LOCAL DIRECTORY ] button. - When clicked, trigger window.showDirectoryPicker() to prompt the user to select a local folder on their machine. - Request persistent read/write permissions for that directory handle. 2. The File Tree Explorer: - Recursively read the mounted directory. - Render a visual, collapsible File Tree UI on the left side of the screen (e.g., 📁 src, 📄 index.html, 📄 data.csv). - Clicking a file opens its contents in a <textarea> on the right side for manual review/editing. 3. The Agent API Bridge: - Wrap the File System Access API into 3 pure JS functions: agentReadFile(path), agentWriteFile(path, content), and agentListDirectory(path). - Expose these functions to the window object so they can be injected into the AIRSwarm execution environment. 4. Telemetry UI & Safeguards: - Display an "Active Mount" status indicator (e.g., Mounted: /Users/admin/projects/LogicHub). - Show a live event log: [10:45:02] Agent 'Viaco Coder' modified /src/styles.css. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

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