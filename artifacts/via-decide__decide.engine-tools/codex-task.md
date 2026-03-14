You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Create tools/engine/street-food-event-deck/. Build a logic interceptor for the Layer 1 Swipe Crucible. When the active skin is street-food-cart, this script overwrites localStorage.getItem('orchard_engine_swipe_deck') with thematic card objects: { type: 'prep', text: 'Prep ingredients' }, { type: 'serve', text: 'Take order' }, { type: 'pest', text: 'Power cut! Save the fridge' }, { type: 'growth', text: 'Handle customer complaint' }. Dispatch window.dispatchEvent(new CustomEvent('engine:swipe_deck_reloaded')) so the crucible UI refreshes with the new cards.

CONSTRAINTS
pure Vanilla JS; standalone execution; must preserve the underlying logic tags (type: 'prep' acts identically to type: 'water' in the base game).

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