You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
add tools/games/quiz-engine/ with config.json index.html tool.js - JSON-driven quiz tool, 5 hardcoded orchard/career questions, multiple choice, score at end, emits engine:quiz_completed with {score, total} on finish

CONSTRAINTS
edit tools/games/quiz-engine/ only; no frameworks; no shared file changes
add tools/games/typing-speed/ with config.json index.html tool.js - vanilla JS WPM typing test, random orchard-themed sentences, 60s timer, accuracy and WPM display, saves best WPM to localStorage key orchard_engine_typing_best, emits engine:skill_measured on completion

CONSTRAINTS
edit tools/games/typing-speed/ only; no frameworks; no shared file changes
add tools/games/memory-match/ with config.json index.html tool.js - vanilla JS card flip memory game with 16 cards, move counter, timer, win detection, saves best time to localStorage key orchard_engine_memory_best

CONSTRAINTS
edit tools/games/memory-match/ only; no frameworks; no shared file changes
add tools/games/snake-game/ with config.json index.html tool.js - vanilla JS canvas snake game, arrow key controls, score tracking, saves high score to localStorage key orchard_engine_snake_score, emits engine:score_achieved on new high score

CONSTRAINTS
edit tools/games/snake-game/ only; no frameworks; no shared file changes

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