Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
> Create branch feature/layer2-commons-view. Create file views/layer2-commons.html. Build a new dashboard view specific to Layer 2. It must contain two sections: 1. "Seed Inventory": Reads from localStorage.getItem('forged_seeds_inventory') and renders beautiful UI cards for each seed, showing its rarity and stats. 2. "Circle Hub": Integrates with the existing CircleManager, showing current clan members and the active Pest Siege status. Update the main index.html OS navigation menu to include a locked button for "The Commons". Add logic in the OS router to check ProgressionEngine.getState().unlockedLayer >= 2 before allowing navigation to this view. If locked, show a padlock icon. Commit with message "feat: add Layer 2 Commons UI dashboard". Push branch and open PR to main titled "Feat: Layer 2 Commons Dashboard"

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