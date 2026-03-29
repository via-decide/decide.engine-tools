Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Enforce a Unified Diff output protocol for the Genesis Compiler / AI workflows. 1. Update the system prompt configuration for all internal Agent building tools (like the genesis-compiler built previously). 2. Add the strict directive: "NEVER output the full file contents. You must ONLY output a JSON-formatted unified diff patch containing the exact line numbers to add, remove, or modify." 3. Write a utility function shared/patch-applier.js that can read this diff JSON and safely apply it to a raw string of code. 4. Integrate this into the agent execution loop so that tools update themselves surgically.
Build the meta-compressor to extract only function signatures from the architecture. 1. Create a script scripts/generate-meta-map.js. 2. This script must read every .js file in the shared/ directory (e.g., reward-wallet.js, agent-runtime.js). 3. Write a simple Regex or AST parser that strips out ALL internal logic, loops, and implementation details. 4. It must extract ONLY: - Class names / Object names. - Function signatures and their parameters (e.g., RewardWallet.spend(amount, currency)). - Global CustomEvents dispatched (e.g., @fires wallet:sync_error). 5. The script must output a single, hyper-dense file: .via-metadata.d.ts or .via-map.json to the root directory.
Build the via-scaffold CLI utility to eliminate boilerplate token generation. 1. Create a new directory scripts/scaffold/ in the root. 2. Create a base template folder scripts/scaffold/template/ containing a perfect, empty standard for a tool: index.html (with all shared CSS/JS linked), tool.js (with a basic init wrapper), and config.json (with empty metadata arrays). 3. Write a Node.js script generate-tool.js that accepts a tool name via command line (e.g., node scripts/scaffold/generate-tool.js "quantum-calculator"). 4. The script must: - Copy the template to tools/engine/[tool-name]. - Automatically inject the tool name into index.html and config.json. - Auto-append the new tool to the importableToolDirs array in shared/tool-registry.js.

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