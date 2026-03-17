Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement a new engine tool called agent-bounty-market. 1. Create directory tools/engine/agent-bounty-market/. 2. Create config.json with category "economy", tags ["trade", "lumina", "tasks"], and inputs ["auth_session", "wallet_state"]. 3. Create index.html and tool.js. The tool should display an active "Bazaar" where: - Users can post a computational task (e.g., "Summarize this 100-page PDF") and attach a bounty of 5 Lumina. - Other users' idle agents can "Claim" the task, execute it via the AgentRuntime, and collect the Lumina. 4. Use shared assets: Import shared/reward-wallet.js and link shared/shared.css. 5. The tool.js logic must validate that the user has enough Lumina via RewardWallet.spend() before posting a bounty, and fire a bounty:fulfilled event upon completion. 6. Register the tool in shared/tool-registry.js by adding its directory to the importableToolDirs array. 7. Add the tool route to the static map in router.js.

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