You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
> Create a new branch feature/ui-smart-visualizer. Update the execution-console.html file. Instead of dumping raw JSON.stringify() outputs into the terminal feed, build a SmartVisualizer utility. When an agent logs an event, check the payload: 1. If it's a flat JSON object, render it as a clean HTML table or a list of pill-shaped key-value pairs. 2. If the payload contains a string with markdown (e.g., ### Title), use a basic regex replacer to render it as actual HTML headers/bold text inside the log card. 3. Highlight success events in green, errors in red, and system events in blue. Commit the changes with the message "feat: add smart JSON/Markdown visualizer to execution terminal". Push the branch and open a Pull Request to main with the title "Feat: Smart Data Visualizer" and a description mentioning it makes AI outputs human-readable.

CONSTRAINTS
> Pure Vanilla JS. Do not use external Markdown parsers (write a simple regex parser for headers, bold, and lists). Keep the terminal scroll performant.
> Create a new branch feature/ui-drag-drop. Refactor the agent-builder.html file. Implement the native HTML5 Drag and Drop API (draggable="true", ondragstart, ondragover, ondrop) on the workflow step containers. Allow users to click and drag a step to reorder its position in the sequential flow. Upon a successful drop, automatically update the underlying JSON array in memory to reflect the new execution order, and re-render the step numbers. Add visual feedback (like a dashed drop-zone border or slight opacity change) while a step is being dragged. Commit the changes with the message "feat: add HTML5 drag-and-drop sorting to agent builder". Push the branch and open a Pull Request to main with the title "Feat: Drag and Drop Step Sorter" and a description mentioning it improves UX for modifying workflows.

CONSTRAINTS
> Pure Vanilla JS. Do not use external libraries like SortableJS. Handle drag events efficiently to prevent flickering. Ensure the JSON state strictly matches the DOM order after a drop.

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