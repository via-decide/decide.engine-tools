Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Create tools/engine/skin-street-food-theme/. Build a CSS/JS utility that activates when orchard_engine_active_skin equals street-food-cart. It must dynamically overwrite the root CSS variables with the Indian street cart palette: --color-soil-dark (Terracotta/Charcoal #2A1F1D), --color-leaf-green (Mint Chutney #4ade80), --color-water-blue (Turmeric Yellow #fbbf24 for ingredients), and --color-mineral-gold (Saffron #f97316). Ensure these colors pass accessibility contrast checks against white text.
Update index.html and router.js. Integrate the new agent-builder.html, tool-registry.html, execution-console.html, and the updated tool-graph.html into the main application layout and routing system. Ensure the navigation menu reflects this new "Agent Platform" architecture. Verify shared/agent-runtime.js is loaded globally so agents can be triggered from anywhere in the OS.
Create a new branch feature/eco-engine-test. Create a new directory at the root level called tools/eco-engine-test/. Inside this directory, create an index.html file and populate it exactly with the code payload provided below. After creating the file, commit the changes with the message "feat: add isolated test environment for unified auth, wallet, and plant engine logic". Push the branch to origin and open a Pull Request to the main branch with the title "Feat: Eco-Hack Engine Foundation" and a description mentioning it establishes async state management. Code Payload for index.html: <!doctype html> <html lang="en"> <head> <meta charset="UTF-8"/> <meta name="viewport" content="width=device-width,initial-scale=1.0"/> <title>Eco-Hack Engine Test</title> <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet"/> <style> :root {

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