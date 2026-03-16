You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
> Create branch feature/ascension-cinematic-ux. Create file shared/ascension-ux.js. Build a utility AscensionCinematic that listens for window.addEventListener('progression:layer2_unlocked', ...). When fired, dynamically inject a massive, full-screen <div> overlay with a dark, glowing purple/gold CSS background. Animate text that says "Crucible Survived. Layer 2 Unlocked: The Commons." After 4 seconds, fade out the overlay and trigger the SeedForge.forgeSeed() function automatically to grant their first seed. Commit with message "feat: add full-screen ascension cinematic UX". Push branch and open PR to main titled "Feat: Ascension Cinematic UX"

CONSTRAINTS
> Pure Vanilla JS. Generate the HTML overlay purely via JS DOM manipulation so no extra HTML files are needed. Ensure z-index is high enough to cover the OS.
> Create branch feature/seed-forge-system. Create file shared/seed-forge.js with the code payload below. Commit with message "feat: add seed forge prestige mechanic". Push branch and open PR to main titled "Feat: Seed Forge System"

CONSTRAINTS
> Pure Vanilla JS. Generates JSON objects containing the synthesized stats. Triggers an event to wipe local plant data so the loop can begin again.
> Create branch feature/global-progression-gate. Create file shared/progression-engine.js with the code payload below. Commit with message "feat: add global progression engine to gate Layer 2". Push branch and open PR to main titled "Feat: Global Progression Engine"

CONSTRAINTS
> Pure Vanilla JS. Do not modify other files. Ensure it correctly hooks into 'growth:stage_evolved' if the GrowthStageEngine fires it.

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