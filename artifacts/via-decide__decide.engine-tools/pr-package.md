Branch: simba/add-agentinterrogator-as-a-single-file-tool-at-t
Title: Add AgentInterrogator as a single-file tool at tools/engine/agent-int...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add AgentInterrogator as a single-file tool at tools/engine/agent-interrogator/index.html. AgentInterrogator is a "Red Team Dashboard." Before an agent is allowed to finalize a research brief, this tool forces the agent to defend its findings against a simulated "Devil's Advocate." If the agent's data is hallucinated, it will fail the interrogation. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/agent-interrogator/index.html - UI resembles a split-screen messaging interface. Left side: The Research Agent. Right side: The Interrogator. 2. INTERROGATION LOGIC (Simulation) - Create a JS array of standard "Interrogation Prompts" (e.g., "What is the counter-evidence to this claim?", "Provide the exact URL for this statistic. If you cannot, delete it."). - Provide a UI button: "Initiate Red Team Test". - When clicked, simulate a 3-turn dialogue where the Interrogator challenges the Research Agent's drafted text. - If the text lacks citations, the UI marks the test as FAILED: HALLUCINATION RISK and blocks the "Export" button. 3. COSTS & PERSISTENCE - Running the Interrogator costs 5 "Lumina". Integrate with localStorage.getItem('wallet_state') to deduct the currency before running. - Save the results of the interrogation to localStorage.getItem('interrogation_logs'). 4. MANIFEST ENTRY { "id": "agent-interrogator", "name": "AgentInterrogator", "title": "Red Team Dashboard", "path": "tools/engine/agent-interrogator/index.html", "tags": ["research", "red-team", "hallucination", "security"], "tier": "engine", "icon": "⚖️", "sparks": true } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "interrogate", "redteam", "defend" Route to tools/engine/agent-interrogator/index.html. 6. HUD ADDITIONS

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.