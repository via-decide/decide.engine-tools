You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
> Create a new branch feature/ux-particle-system. Create a file shared/particle-engine.js. Build a Vanilla JS ParticleEngine object. It should dynamically generate absolute-positioned <div> elements (confetti, sparks, stars) that animate outwards from a given (x,y) coordinate using CSS transitions, and then automatically remove themselves from the DOM after the animation completes (e.g., 800ms). Include pre-configured burst profiles: burstXP(x, y) (green/gold sparks), burstError(x, y) (red shake), and burstClick(x, y) (subtle white rings). Attach global listeners to trigger these bursts on existing engine events (like wallet:earned or swipe:card_swiped). Commit the changes with the message "feat: implement DOM-based particle effects engine". Push the branch and open a Pull Request to main with the title "Feat: Particle Effects Engine" and a description mentioning it adds visual 'juice' to interactions.

CONSTRAINTS
> Pure Vanilla JS. Do not use Canvas if DOM elements suffice (for better accessibility and crispness). Ensure it does not cause memory leaks by properly garbage-collecting the DOM elements.

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