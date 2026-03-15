You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
> Create a new branch feature/agent-builder-ui. Refactor the existing workflow-builder.html into agent-builder.html (or create a new file if it doesn't exist). Remove any 2D node-diagram canvas logic. Replace it with a vertical, step-based plan editor UI. Users must be able to click "Add Step", select a tool from window.ToolRegistry, and map inputs using variables from previous steps (e.g., {{step1.output}}). Add a "Save Agent" button that compiles this vertical plan into a strict JSON array and saves it to localStorage.getItem('engine_agent_plans'). Commit the changes with the message "feat: add step-based agent builder UI". Push the branch and open a Pull Request to main with the title "Feat: Agent Builder UI" and a description mentioning it replaces node diagrams with linear JSON step arrays.
> Create a new branch feature/agent-runtime. Create a file named shared/agent-runtime.js and populate it exactly with the code payload provided below. Commit the changes with the message "feat: implement sequential agent execution runtime". Push the branch to origin and open a Pull Request to the main branch with the title "Feat: Agent Runtime Engine" and a description mentioning it executes step-based JSON workflows and parses variables. Code Payload for agent-runtime.js: class AgentRuntime { constructor(plan) { this.plan = plan; // Array of step objects this.context = {}; // Stores outputs from previous steps } // Resolves {{stepId.outputKey}} dynamically resolveInputs(inputs) { const resolved = {}; for (const [key, value] of Object.entries(inputs)) { if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) { const path = value.slice(2, -2).split('.'); let current = this.context; for (const p of path) { if (current[p] !== undefined) current = current[p]; else { current = null; break; } } resolved[key] = current; } else { resolved[key] = value; } } return resolved; } async run() { window.dispatchEvent(new CustomEvent('agent:run_started', { detail: { planId: this.plan.id } })); for (const step of this.plan.steps) { window.dispatchEvent(new CustomEvent('agent:step_started', { detail: { stepId: step.id } })); try { const tool = window.ToolRegistry.getTool(step.toolId); if (!tool) throw new Error(Tool ${step.toolId} not found); const resolvedInputs = this.resolveInputs(step.inputs); const output = await tool.execute(resolvedInputs); this.context[step.id] = output; window.dispatchEvent(new CustomEvent('agent:step_success', { detail: { stepId: step.id, output } })); } catch (error) { window.dispatchEvent(new CustomEvent('agent:step_failed', { detail: { stepId: step.id, error: error.message } })); break; // Halt execution on failure } } window.dispatchEvent(new CustomEvent('agent:run_completed', { detail: { finalContext: this.context } })); return this.context; } } window.AgentRuntime = AgentRuntime;

CONSTRAINTS
> Do not modify the provided code payload. Ensure the directory path is exactly shared/agent-runtime.js. The PR must target main. Must handle asynchronous tool execution and variable injection.
> Create a new branch feature/agent-execution-logger. Create a file named shared/agent-logger.js and populate it exactly with the code payload provided below. Commit the changes with the message "feat: add global agent execution logger". Push the branch to origin and open a Pull Request to the main branch with the title "Feat: Agent Execution Logger" and a description mentioning it captures runtime events for the console UI. Code Payload for agent-logger.js: const AgentLogger = {

CONSTRAINTS
> Pure Vanilla JS and HTML/CSS. Responsive UI. Use existing CSS variables for styling. Ensure the JSON output strictly defines step execution order and data passing.

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
# Decide Engine Tools + Orchard Engine Foundation

This repository is a preservation-first browser-native tool mesh by **ViaDecide**.

It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career game system.

## Preservation-first policy

- Existing standalone tools are preserved.
- New systems are additive.
- No unrelated folder is deleted or replaced.
- Tools remain standalone HTML/CSS/JS.

## Tool categories

Tools are organized into 9 categories. The index page at `index.html` renders them grouped automatically from registry metadata.

| Category | Tools |
|---|---|
| **Creators** | PromptAlchemy, Script Generator |
| **Coders** | Code Generator, Code Reviewer, Agent Builder, App Generator |
| **Researchers** | Multi Source Research, Student Research |
| **Business** | Sales Dashbo

- AGENTS snippet:
Rules for coding agents in this repository:

1. Never delete tool folders.
2. Never remove working code from tools.
3. Never replace a tool with a placeholder.
4. Prefer additive changes.
5. Tools must remain standalone HTML apps.
6. Routing must never break existing tools.
7. If reorganizing tools, move them safely and update references.
ENGINE-TOOLS ARCHITECTURE (mandatory compliance)
Tool directory: tools/<tool>/
Required files: config.json, index.html, tool.js
Shared dependencies to import: shared/tool-storage.js, shared/shared.css
config.json must include: id, name, description, category, audience, inputs, outputs, tags
Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js
Do NOT modify any existing tool folder or shared utility file.
Do NOT use external frameworks, CDN packages, or bundlers.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.