Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build 'DaxiniFactory'-the master orchestrator that connects Harvester, Forge, Judge, and Sweep into a single autonomous pipeline. CORE ARCHITECTURE (The Sovereign Conveyor): 1. The Flow Controller: - Create factory/main.js to manage the lifecycle of a 'Wave' (100 PRs). - Step 1: Trigger 'DaxiniHarvester' to pull 100 new entities. - Step 2: Pass data to 'DaxiniForge' to generate folder structures. - Step 3: Run 'DaxiniJudge' to validate code purity. - Step 4: Execute 'DaxiniSweep' to push and merge. 2. The Self-Healing Logic: - If 'DaxiniJudge' rejects more than 10% of a batch, the Factory must automatically re-run the 'Forge' with a different 'Logic Archetype' seed. 3. The Throttle Sync: - Coordinate with 'DaxiniSentinel' to adjust the 'Factory Speed' based on GitHub's real-time rate-limit responses. 4. The 24K Countdown: - Implement a persistent 'State Manager' that tracks exactly how many steps are left to hit 24,000 and estimates the "Time of Completion" based on current velocity.

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