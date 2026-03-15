You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Create _assets/js/studyos-modules.js. Extract StudyEngine, Missions, Tracker, Vault, and PYQ logic from index.html. Refactor these objects to listen for the studyos:state_updated event to trigger their respective render() functions, rather than being manually called. Update all module interaction methods (like Missions.addTask or Tracker.addError) to update the state via AppStore and rely on the event bus to trigger the UI re-render.

CONSTRAINTS
pure Vanilla JS; ensure DOM updates are efficient and only re-render when necessary.
Create _assets/js/studyos-onboarding.js. Extract Dictionary, UIUXMatrix, and OnboardingEngine from the main index.html. Refactor OnboardingEngine.complete() so that instead of calling Bootloader.switchLayer, it dispatches window.dispatchEvent(new CustomEvent('studyos:workspace_created', { detail: this.userChoices })).

CONSTRAINTS
pure Vanilla JS; preserve the exact auto-scroll physics and animation classes from the original prototype.
Create _assets/js/studyos-core.js. Extract AppStore, SystemData, and DataGenerator from the main index.html. Refactor AppStore.saveData() to automatically dispatch window.dispatchEvent(new CustomEvent('studyos:state_updated', { detail: AppStore.data })) instead of directly calling UI functions. Ensure localStorage keys (os_config_final, os_data_final) are maintained.

CONSTRAINTS
pure Vanilla JS; do not modify DOM elements here; establish strict separation of data and UI.

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