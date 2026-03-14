You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Add a new standalone tool called memory-match in tools/games/memory-match/. Title: "Memory Match". Description: "Card flip memory game with scoring and timer.". Category: "games". The tool must contain: config.json, index.html, tool.js. The game must run in browser, use vanilla JS, have simple UI, no external frameworks. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.

CONSTRAINTS
preserve all existing tool folders; preserve standalone behavior; do not break category routing; update router/index/registry/README only as needed; use minimal corrective edits
Add a new standalone tool called pricing-calculator in tools/pricing-calculator/. Title: "Pricing Calculator". Description: "Compare pricing models: freemium, tiered, usage-based.". Category: "business". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.

CONSTRAINTS
preserve all existing tool folders; preserve standalone behavior; do not break category routing; update router/index/registry/README only as needed; use minimal corrective edits
Add a new standalone tool called okr-planner in tools/okr-planner/. Title: "OKR Planner". Description: "Define objectives and key results with progress tracking.". Category: "business". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.

CONSTRAINTS
preserve all existing tool folders; preserve standalone behavior; do not break category routing; update router/index/registry/README only as needed; use minimal corrective edits
Add a new standalone tool called swot-analyzer in tools/swot-analyzer/. Title: "SWOT Analyzer". Description: "Structured SWOT analysis with export.". Category: "business". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.

CONSTRAINTS
preserve all existing tool folders; preserve standalone behavior; do not break category routing; update router/index/registry/README only as needed; use minimal corrective edits
Create candidate-comparison-view tool in tools/engine/candidate-comparison-view/ with config.json, index.html, tool.js. Enables recruiters to select multiple players and visually compare their root fundamentals, branch depth, trust scores, and fruit yields side-by-side. Vanilla JS, standalone UI.
Integrate GSAP (GreenSock) via CDN into _assets/js/magnetic-buttons.js. Rewrite the "Magnetic Button" logic to use GSAP's gsap.to() for buttery-smooth spring physics instead of native CSS transitions. Also, create a GSAP timeline function to trigger the "Shimmering Text" and "Glowing Border" evolution alerts in the growth-milestone-engine.

CONSTRAINTS
preserve existing tools; use CDN for GSAP; pure Vanilla JS implementation
Integrate vanilla-tilt.js via CDN into the root index.html. Apply the data-tilt attribute and initialize the tilt physics on all .orchard-panel game cards in the Bento Grid. Configure it for a subtle 3D glare effect (data-tilt-glare="true") to enhance the glassmorphism look when the user hovers over the games.

CONSTRAINTS
preserve existing tools; use CDN for vanilla-tilt; pure Vanilla JS implementation
Create _assets/js/engine-bus.js. This is the central wiring hub. Create a global window.OrchardBus object with .on(event, callback) and .emit(event, payload) methods (wrapping standard CustomEvents). Update the new router to automatically clear specific tool listeners when navigating away to prevent memory leaks, while keeping core state listeners alive.

CONSTRAINTS
pure Vanilla JS; must interface perfectly with the existing localStorage state manager
Update orchard-router.js and global-theme.css to add view transitions. Before injecting new HTML into #game-stage, apply a CSS class .fade-out-scale to the old content. Wait for the transition duration, swap the innerHTML, and apply .fade-in-scale to the new content. If the browser supports the native document.startViewTransition() API, use that as the primary method for buttery smooth, morphing transitions between tools.

CONSTRAINTS
pure Vanilla JS and CSS; fallback smoothly if View Transitions API is not supported
Create a new core script _assets/js/orchard-router.js. Implement a Vanilla JS SPA router that intercepts all <a href> clicks to internal tools. Prevent default navigation. Instead, use fetch() to get the target HTML, parse it, extract the contents of the .orchard-panel or main container, and inject it into a central <main id="game-stage"> in the root index.html. Execute any accompanying <script> tags safely.

CONSTRAINTS
pure Vanilla JS; preserve browser history using history.pushState; handle 404s gracefully

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

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.