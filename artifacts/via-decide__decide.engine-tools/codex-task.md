You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build 'DaxiniFactory'-the master orchestrator that connects Harvester, Forge, Judge, and Sweep into a single autonomous pipeline. CORE ARCHITECTURE (The Sovereign Conveyor): 1. The Flow Controller: - Create factory/main.js to manage the lifecycle of a 'Wave' (100 PRs). - Step 1: Trigger 'DaxiniHarvester' to pull 100 new entities. - Step 2: Pass data to 'DaxiniForge' to generate folder structures. - Step 3: Run 'DaxiniJudge' to validate code purity. - Step 4: Execute 'DaxiniSweep' to push and merge. 2. The Self-Healing Logic: - If 'DaxiniJudge' rejects more than 10% of a batch, the Factory must automatically re-run the 'Forge' with a different 'Logic Archetype' seed. 3. The Throttle Sync: - Coordinate with 'DaxiniSentinel' to adjust the 'Factory Speed' based on GitHub's real-time rate-limit responses. 4. The 24K Countdown: - Implement a persistent 'State Manager' that tracks exactly how many steps are left to hit 24,000 and estimates the "Time of Completion" based on current velocity.

CONSTRAINTS
Use 'Node.js event emitters' for clean communication between modules. Ensure the MacBook Air M2 stays within safe thermal limits by pausing the factory for 30 seconds if CPU temp spikes.

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