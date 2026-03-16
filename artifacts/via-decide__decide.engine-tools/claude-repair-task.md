Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
> Create branch feature/ascension-cinematic-ux. Create file shared/ascension-ux.js. Build a utility AscensionCinematic that listens for window.addEventListener('progression:layer2_unlocked', ...). When fired, dynamically inject a massive, full-screen <div> overlay with a dark, glowing purple/gold CSS background. Animate text that says "Crucible Survived. Layer 2 Unlocked: The Commons." After 4 seconds, fade out the overlay and trigger the SeedForge.forgeSeed() function automatically to grant their first seed. Commit with message "feat: add full-screen ascension cinematic UX". Push branch and open PR to main titled "Feat: Ascension Cinematic UX"
> Create branch feature/seed-forge-system. Create file shared/seed-forge.js with the code payload below. Commit with message "feat: add seed forge prestige mechanic". Push branch and open PR to main titled "Feat: Seed Forge System"
> Create branch feature/global-progression-gate. Create file shared/progression-engine.js with the code payload below. Commit with message "feat: add global progression engine to gate Layer 2". Push branch and open PR to main titled "Feat: Global Progression Engine"

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