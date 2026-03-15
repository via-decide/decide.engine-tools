You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Create tools/engine/locust-king-view/. Build an interactive UI for "The Locust King" boss. Display a large HP bar (100,000 HP). Integrate a swipe-card mini-interface directly in this view, where dispatching correct swipe events immediately decrements the local visual HP and sends updates to the server-boss-engine. Display the community's total damage dealt versus the player's personal damage contribution.

CONSTRAINTS
pure Vanilla JS; standalone execution; must handle rapid event dispatching smoothly without UI lag.
Create tools/engine/blight-boss-view/. Build a dramatic, high-stakes UI for "The Blight" server boss. Read orchard_engine_boss_progress and the target goal (50,000 pests) from the active event. Render a massive, collective progress bar. Include a local contribution counter showing how many pests the current player has cleared during the event timeframe. Update dynamically by listening to the server-boss-engine.
Create shared/agent-runtime.js. Build a Vanilla JS class/object AgentRuntime. It takes a JSON plan from engine_agent_plans. It executes the array of steps sequentially. It must maintain a context object to store outputs from step 1 to pass into step 2. Wrap executions in try/catch blocks. Dispatch custom events (agent:step_started, agent:step_success, agent:step_failed) during the loop so the UI can react.

CONSTRAINTS
pure Vanilla JS; asynchronous execution loop (support Promises/async-await for API calls); strictly isolated variable context per agent run.
Refactor shared/tool-registry.js. Define a standard schema for tools that agents can use. Each tool must have an id, name, description, inputs (array of expected variables), and an execute function placeholder. Create a new tool-registry.html page to serve as a UI directory where users can view all available tools and their required schemas.

CONSTRAINTS
pure Vanilla JS; do not break existing routing; tools must be exportable/accessible to the global scope or event bus.
Create execution-console.html. Build a developer-style dashboard that listens to window.OrchardBus (or window.dispatchEvent) for agent execution events (agent:step_started, etc.). Display a real-time, auto-scrolling terminal/log feed of active agent runs. Show the exact JSON input/output payload for each step as it succeeds or fails.

CONSTRAINTS
pure Vanilla JS; use a monospace font for logs; ensure it can handle rapid event firing without freezing the DOM.
Refactor tool-graph.html. Update the visualization logic to map the new Agent ecosystem. The graph should read engine_agent_plans and tool-registry.js. Render Agents as primary nodes, and draw directed edges to the specific Tools they utilize in their JSON steps. This allows the user to visually see which tools are heavily relied upon and which agents share dependencies.

CONSTRAINTS
pure Vanilla JS; reuse existing Canvas/SVG/D3 setup; do not build a new graph engine from scratch.
Update index.html and router.js. Integrate the new agent-builder.html, tool-registry.html, execution-console.html, and the updated tool-graph.html into the main application layout and routing system. Ensure the navigation menu reflects this new "Agent Platform" architecture. Verify shared/agent-runtime.js is loaded globally so agents can be triggered from anywhere in the OS.

CONSTRAINTS
maintain existing history pushState routing; do not break any remaining legacy tools that the user still wants access to.

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