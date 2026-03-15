Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Integrate the vanilla version of tsparticles via CDN into _assets/js/environment-particles.js. Replace the custom canvas drawing logic with a tsparticles configuration. Create three config profiles: 'Rain' (falling blue drops), 'Sun' (floating golden dust), and 'Toxic' (erratic green spores). Hook these profiles to listen to the engine:weather_changed event.
> Create a new branch feature/agent-tool-registry. Create a new directory shared/ if it does not exist. Inside, create a file named tool-registry.js and populate it exactly with the code payload provided below. Commit the changes with the message "feat: establish core AI agent tool registry". Push the branch to origin and open a Pull Request to the main branch with the title "Feat: Agent Tool Registry" and a description mentioning it standardizes the tools agents can call. Code Payload for tool-registry.js: const ToolRegistry = {
> Create a new branch feature/agent-platform-routing. Update index.html and router.js (or your primary routing utility). Integrate the new agent-builder.html, tool-registry.html (if created), execution-console.html, and the updated tool-graph.html into the main application layout and routing system. Ensure the main navigation menu reflects this new "Agent Platform" architecture (e.g., links for "Builder", "Console", "Tools"). Verify shared/agent-runtime.js, shared/tool-registry.js, and shared/agent-logger.js are loaded globally via <script> tags in the root index.html so agents can be triggered from anywhere. Commit the changes with the message "feat: integrate agent platform pages into main OS routing". Push the branch and open a Pull Request to main with the title "Feat: OS Routing Integration" and a description mentioning navigation updates.
> Create a new branch feature/update-tool-graph. Refactor the existing tool-graph.html file. Update the visualization logic to map the new Agent ecosystem. The graph must read from localStorage.getItem('engine_agent_plans') and window.ToolRegistry. Render Agents as primary nodes, and draw directed edges (arrows) to the specific Tools they utilize in their JSON steps. This allows the user to visually see which tools are heavily relied upon and which agents share dependencies. Commit the changes with the message "feat: update tool graph to map agent dependencies". Push the branch and open a Pull Request to main with the title "Feat: Agent Ecosystem Visualizer" and a description mentioning it parses JSON plans to draw tool connections.
> Create a new branch feature/execution-console-ui. Create a new file named execution-console.html. Build a developer-style dashboard that lists all agents saved in localStorage.getItem('engine_agent_plans'). Add a "Run Agent" button next to each plan that instantiates window.AgentRuntime and calls .run(). Create a visual terminal window in the UI that listens to window.addEventListener('agent:log_updated') (fired by AgentLogger). Display a real-time, auto-scrolling log feed of the active agent run, showing the JSON input/output payload for each step as it succeeds or fails. Commit the changes with the message "feat: add real-time execution console dashboard". Push the branch and open a Pull Request to main with the title "Feat: Execution Console" and a description mentioning it monitors live AgentRuntime events.
> Create a new branch feature/agent-builder-ui. Refactor the existing workflow-builder.html into agent-builder.html (or create a new file if it doesn't exist). Remove any 2D node-diagram canvas logic. Replace it with a vertical, step-based plan editor UI. Users must be able to click "Add Step", select a tool from window.ToolRegistry, and map inputs using variables from previous steps (e.g., {{step1.output}}). Add a "Save Agent" button that compiles this vertical plan into a strict JSON array and saves it to localStorage.getItem('engine_agent_plans'). Commit the changes with the message "feat: add step-based agent builder UI". Push the branch and open a Pull Request to main with the title "Feat: Agent Builder UI" and a description mentioning it replaces node diagrams with linear JSON step arrays.
> Create a new branch feature/agent-runtime. Create a file named shared/agent-runtime.js and populate it exactly with the code payload provided below. Commit the changes with the message "feat: implement sequential agent execution runtime". Push the branch to origin and open a Pull Request to the main branch with the title "Feat: Agent Runtime Engine" and a description mentioning it executes step-based JSON workflows and parses variables. Code Payload for agent-runtime.js: class AgentRuntime { constructor(plan) { this.plan = plan; // Array of step objects this.context = {}; // Stores outputs from previous steps } // Resolves {{stepId.outputKey}} dynamically resolveInputs(inputs) { const resolved = {}; for (const [key, value] of Object.entries(inputs)) { if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) { const path = value.slice(2, -2).split('.'); let current = this.context; for (const p of path) { if (current[p] !== undefined) current = current[p]; else { current = null; break; } } resolved[key] = current; } else { resolved[key] = value; } } return resolved; } async run() { window.dispatchEvent(new CustomEvent('agent:run_started', { detail: { planId: this.plan.id } })); for (const step of this.plan.steps) { window.dispatchEvent(new CustomEvent('agent:step_started', { detail: { stepId: step.id } })); try { const tool = window.ToolRegistry.getTool(step.toolId); if (!tool) throw new Error(Tool ${step.toolId} not found); const resolvedInputs = this.resolveInputs(step.inputs); const output = await tool.execute(resolvedInputs); this.context[step.id] = output; window.dispatchEvent(new CustomEvent('agent:step_success', { detail: { stepId: step.id, output } })); } catch (error) { window.dispatchEvent(new CustomEvent('agent:step_failed', { detail: { stepId: step.id, error: error.message } })); break; // Halt execution on failure } } window.dispatchEvent(new CustomEvent('agent:run_completed', { detail: { finalContext: this.context } })); return this.context; } } window.AgentRuntime = AgentRuntime;
> Create a new branch feature/agent-execution-logger. Create a file named shared/agent-logger.js and populate it exactly with the code payload provided below. Commit the changes with the message "feat: add global agent execution logger". Push the branch to origin and open a Pull Request to the main branch with the title "Feat: Agent Execution Logger" and a description mentioning it captures runtime events for the console UI. Code Payload for agent-logger.js: const AgentLogger = {

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