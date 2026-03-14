Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Integrate vanilla-tilt.js via CDN into the root index.html. Apply the data-tilt attribute and initialize the tilt physics on all .orchard-panel game cards in the Bento Grid. Configure it for a subtle 3D glare effect (data-tilt-glare="true") to enhance the glassmorphism look when the user hovers over the games.
Create _assets/js/engine-bus.js. This is the central wiring hub. Create a global window.OrchardBus object with .on(event, callback) and .emit(event, payload) methods (wrapping standard CustomEvents). Update the new router to automatically clear specific tool listeners when navigating away to prevent memory leaks, while keeping core state listeners alive.
Update orchard-router.js and global-theme.css to add view transitions. Before injecting new HTML into #game-stage, apply a CSS class .fade-out-scale to the old content. Wait for the transition duration, swap the innerHTML, and apply .fade-in-scale to the new content. If the browser supports the native document.startViewTransition() API, use that as the primary method for buttery smooth, morphing transitions between tools.
Create a new core script _assets/js/orchard-router.js. Implement a Vanilla JS SPA router that intercepts all <a href> clicks to internal tools. Prevent default navigation. Instead, use fetch() to get the target HTML, parse it, extract the contents of the .orchard-panel or main container, and inject it into a central <main id="game-stage"> in the root index.html. Execute any accompanying <script> tags safely.

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