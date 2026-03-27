You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Add AgentInterrogator as a single-file tool at tools/engine/agent-interrogator/index.html. AgentInterrogator is a "Red Team Dashboard." Before an agent is allowed to finalize a research brief, this tool forces the agent to defend its findings against a simulated "Devil's Advocate." If the agent's data is hallucinated, it will fail the interrogation. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/agent-interrogator/index.html - UI resembles a split-screen messaging interface. Left side: The Research Agent. Right side: The Interrogator. 2. INTERROGATION LOGIC (Simulation) - Create a JS array of standard "Interrogation Prompts" (e.g., "What is the counter-evidence to this claim?", "Provide the exact URL for this statistic. If you cannot, delete it."). - Provide a UI button: "Initiate Red Team Test". - When clicked, simulate a 3-turn dialogue where the Interrogator challenges the Research Agent's drafted text. - If the text lacks citations, the UI marks the test as FAILED: HALLUCINATION RISK and blocks the "Export" button. 3. COSTS & PERSISTENCE - Running the Interrogator costs 5 "Lumina". Integrate with localStorage.getItem('wallet_state') to deduct the currency before running. - Save the results of the interrogation to localStorage.getItem('interrogation_logs'). 4. MANIFEST ENTRY { "id": "agent-interrogator", "name": "AgentInterrogator", "title": "Red Team Dashboard", "path": "tools/engine/agent-interrogator/index.html", "tags": ["research", "red-team", "hallucination", "security"], "tier": "engine", "icon": "⚖️", "sparks": true } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "interrogate", "redteam", "defend" Route to tools/engine/agent-interrogator/index.html. 6. HUD ADDITIONS

CONSTRAINTS
Preserve existing code; prefer additive changes.

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
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g

- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
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