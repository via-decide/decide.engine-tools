You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'DaxiniWall' (The Sovereign Proof-of-Work Gallery). Create a new folder /DaxiniWall and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Global Record Counter: - Fetch the current 'Merge' count from the ViaLogic repository using Octokit. - Display a massive, glowing number: 'OFFICIAL RECORD STATUS: [N] / 24,000'. 2. The Uniqueness Validator: - Load the metadata for all 24,000 entities. - Perform a 'Fingerprint Check' (hashing the identity.json/manifesto.md files). - Display the Uniqueness Metric: "Uniqueness Probability: 99.9999% (Verified by DaxiniWall)". 3. The Infinite Scroll Gallery: - Implement a high-performance virtualized list to render 24,000 entity thumbnails without crashing the browser. - Each thumbnail should be a miniature version of the Daxini Glass-morphic card. 4. The Efficiency Banner: - A permanent footer displaying: "Total Sovereign Savings: 18.7M Tokens ($1,200 saved using decide.engine-tools)". UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Use 'IntersectionObserver' for the infinite scroll. The hash-check logic must be optimized to run on the client-side without lagging the main UI thread.
Build a new micro-frontend named 'DaxiniForge' (The Sovereign App Factory). Create a new folder /DaxiniForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Blueprint Selector: - Allow the user to drag-and-drop URLs or IDs from DaxiniSearch/DaxiniHive into a 'Forge Slot'.
Build a new micro-frontend named 'DaxiniHive' (The Collective Intelligence Interface). Create a new folder /DaxiniHive and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Hive Assembly Engine:

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Must interface with the existing 'DaxiniSearch' metadata index to ensure instantaneous team selection without redundant API calls.
Build a new micro-frontend named 'DaxiniImmune' (The Self-Healing Sentinel). Create a new folder /DaxiniImmune' and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Random Patrol Engine: - Use a 'Random Walk' algorithm to select 50 random folders from ViaLogic/people, /logic, /assets, and /ops every hour. 2. The Diagnostic Layer: - For the selected entities, run a 'Dry Run' of the JS logic. - Use Gemini 1.5 Flash to 'Spot Check' the README content against the manifest.json.

CONSTRAINTS
Zero NPM dependencies for the core logic. If using a library for ZIP generation, use a CDN link. The dependency resolution must handle missing files gracefully by suggesting alternatives from the 24,000-unit pool.

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