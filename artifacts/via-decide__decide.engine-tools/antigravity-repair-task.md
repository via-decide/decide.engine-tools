Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement the Weapon DPS Simulator & Balancer (via-weapon-balance). 1. Create a script that parses a weapon_stats.csv file containing fire rates, damage values, reload times, and recoil curves. 2. Build a headless simulation loop that runs 10,000 virtual firefights against different armor types to calculate exact Time-To-Kill (TTK) and DPS metrics. 3. Compile the raw CSV data into an encrypted binary blob (weapons.dat) for the engine, and output a balance_report.html for the Operations Console.

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
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g
- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
- package.json snippet:
not found