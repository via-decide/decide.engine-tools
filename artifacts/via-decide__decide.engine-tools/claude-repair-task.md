Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
> Create a new branch feature/agent-runtime. Create a file named shared/agent-runtime.js and populate it exactly with the code payload provided below. Commit the changes with the message "feat: implement sequential agent execution runtime". Push the branch to origin and open a Pull Request to the main branch with the title "Feat: Agent Runtime Engine" and a description mentioning it executes step-based JSON workflows and parses variables. Code Payload for agent-runtime.js: class AgentRuntime { constructor(plan) { this.plan = plan; // Array of step objects this.context = {}; // Stores outputs from previous steps } // Resolves {{stepId.outputKey}} dynamically resolveInputs(inputs) { const resolved = {}; for (const [key, value] of Object.entries(inputs)) { if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) { const path = value.slice(2, -2).split('.'); let current = this.context; for (const p of path) { if (current[p] !== undefined) current = current[p]; else { current = null; break; } } resolved[key] = current; } else { resolved[key] = value; } } return resolved; } async run() { window.dispatchEvent(new CustomEvent('agent:run_started', { detail: { planId: this.plan.id } })); for (const step of this.plan.steps) { window.dispatchEvent(new CustomEvent('agent:step_started', { detail: { stepId: step.id } })); try { const tool = window.ToolRegistry.getTool(step.toolId); if (!tool) throw new Error(Tool ${step.toolId} not found); const resolvedInputs = this.resolveInputs(step.inputs); const output = await tool.execute(resolvedInputs); this.context[step.id] = output; window.dispatchEvent(new CustomEvent('agent:step_success', { detail: { stepId: step.id, output } })); } catch (error) { window.dispatchEvent(new CustomEvent('agent:step_failed', { detail: { stepId: step.id, error: error.message } })); break; // Halt execution on failure } } window.dispatchEvent(new CustomEvent('agent:run_completed', { detail: { finalContext: this.context } })); return this.context; } } window.AgentRuntime = AgentRuntime;

RULES
1. Audit touched files first and identify regressions.
2. Preserve architecture and naming conventions.
3. Make minimal repairs only; do not expand scope.
4. Re-run checks and provide concise root-cause notes.
5. Return complete contents for changed files only.

REPO CONTEXT
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
- package.json snippet:
not found
- pyproject snippet:
not found