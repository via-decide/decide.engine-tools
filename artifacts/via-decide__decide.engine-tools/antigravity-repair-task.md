Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
<<<<<<< simba/build-a-new-micro-frontend-named-airmount-the-lo
Build a new micro-frontend named 'AIRMount' (The Local File System Bridge). Create a new folder /AIRMount and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Secure Mounting Engine: - A massive [ MOUNT LOCAL DIRECTORY ] button. - When clicked, trigger window.showDirectoryPicker() to prompt the user to select a local folder on their machine. - Request persistent read/write permissions for that directory handle. 2. The File Tree Explorer: - Recursively read the mounted directory. - Render a visual, collapsible File Tree UI on the left side of the screen (e.g., 📁 src, 📄 index.html, 📄 data.csv). - Clicking a file opens its contents in a <textarea> on the right side for manual review/editing. 3. The Agent API Bridge: - Wrap the File System Access API into 3 pure JS functions: agentReadFile(path), agentWriteFile(path, content), and agentListDirectory(path). - Expose these functions to the window object so they can be injected into the AIRSwarm execution environment. 4. Telemetry UI & Safeguards: - Display an "Active Mount" status indicator (e.g., Mounted: /Users/admin/projects/LogicHub). - Show a live event log: [10:45:02] Agent 'Viaco Coder' modified /src/styles.css. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.
=======
Build a new micro-frontend named 'DaxiniPulse' (The Sovereign Heartbeat Monitor). Create a new folder /DaxiniPulse and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. API Health Checkers: - Use fetch to ping the Gemini API and GitHub API (using stored keys) to verify they are active and check remaining rate limits.
Build a new micro-frontend named 'DaxiniWall' (The Sovereign Proof-of-Work Gallery). Create a new folder /DaxiniWall and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Global Record Counter: - Fetch the current 'Merge' count from the ViaLogic repository using Octokit. - Display a massive, glowing number: 'OFFICIAL RECORD STATUS: [N] / 24,000'. 2. The Uniqueness Validator: - Load the metadata for all 24,000 entities. - Perform a 'Fingerprint Check' (hashing the identity.json/manifesto.md files). - Display the Uniqueness Metric: "Uniqueness Probability: 99.9999% (Verified by DaxiniWall)". 3. The Infinite Scroll Gallery: - Implement a high-performance virtualized list to render 24,000 entity thumbnails without crashing the browser. - Each thumbnail should be a miniature version of the Daxini Glass-morphic card. 4. The Efficiency Banner: - A permanent footer displaying: "Total Sovereign Savings: 18.7M Tokens ($1,200 saved using decide.engine-tools)". UI/UX AESTHETIC: - Adhere to the Daxini OS standard.
Build a new micro-frontend named 'DaxiniForge' (The Sovereign App Factory). Create a new folder /DaxiniForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Blueprint Selector: - Allow the user to drag-and-drop URLs or IDs from DaxiniSearch/DaxiniHive into a 'Forge Slot'.
Build a new micro-frontend named 'DaxiniHive' (The Collective Intelligence Interface). Create a new folder /DaxiniHive and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Hive Assembly Engine:
Build a new micro-frontend named 'DaxiniImmune' (The Self-Healing Sentinel). Create a new folder /DaxiniImmune' and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Random Patrol Engine: - Use a 'Random Walk' algorithm to select 50 random folders from ViaLogic/people, /logic, /assets, and /ops every hour. 2. The Diagnostic Layer: - For the selected entities, run a 'Dry Run' of the JS logic. - Use Gemini 1.5 Flash to 'Spot Check' the README content against the manifest.json.
>>>>>>> main

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