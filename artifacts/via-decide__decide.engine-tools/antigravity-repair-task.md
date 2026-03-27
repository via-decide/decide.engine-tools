Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Add AgentInterrogator as a single-file tool at tools/engine/agent-interrogator/index.html. AgentInterrogator is a "Red Team Dashboard." Before an agent is allowed to finalize a research brief, this tool forces the agent to defend its findings against a simulated "Devil's Advocate." If the agent's data is hallucinated, it will fail the interrogation. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/agent-interrogator/index.html - UI resembles a split-screen messaging interface. Left side: The Research Agent. Right side: The Interrogator. 2. INTERROGATION LOGIC (Simulation) - Create a JS array of standard "Interrogation Prompts" (e.g., "What is the counter-evidence to this claim?", "Provide the exact URL for this statistic. If you cannot, delete it."). - Provide a UI button: "Initiate Red Team Test". - When clicked, simulate a 3-turn dialogue where the Interrogator challenges the Research Agent's drafted text. - If the text lacks citations, the UI marks the test as FAILED: HALLUCINATION RISK and blocks the "Export" button. 3. COSTS & PERSISTENCE - Running the Interrogator costs 5 "Lumina". Integrate with localStorage.getItem('wallet_state') to deduct the currency before running. - Save the results of the interrogation to localStorage.getItem('interrogation_logs'). 4. MANIFEST ENTRY { "id": "agent-interrogator", "name": "AgentInterrogator", "title": "Red Team Dashboard", "path": "tools/engine/agent-interrogator/index.html", "tags": ["research", "red-team", "hallucination", "security"], "tier": "engine", "icon": "⚖️", "sparks": true } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "interrogate", "redteam", "defend" Route to tools/engine/agent-interrogator/index.html. 6. HUD ADDITIONS

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