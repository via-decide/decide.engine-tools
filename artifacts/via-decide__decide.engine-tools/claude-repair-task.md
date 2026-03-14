Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Create tools/engine/upsc-mains-simulator/. Build a strict, timed text-editor UI. Users select a question type (10-marker or 15-marker) which starts an un-pausable countdown (7 or 11 minutes). Disable paste events (onpaste="return false"). Include a live Word Count and WPM tracker. Upon timeout or manual submit, dispatch window.dispatchEvent(new CustomEvent('engine:upsc_mains_written', { detail: { answerText } })) to send the payload to the OS AI Evaluator.
Create tools/engine/upsc-swipe-deck/. Build a Vanilla JS swipe-based flashcard application. The UI must feature a central stack of cards holding UPSC facts (e.g., "Article 14", "Simlipal National Park location"). Implement mouse/touch drag physics. Swipe Right marks it "Known", Swipe Left marks it "Forgot". When a card is swiped left, dispatch window.dispatchEvent(new CustomEvent('engine:upsc_error_logged', { detail: { topic: card.topic, desc: card.fact, revDate: nextDay } })) to feed the main OS error tracker.

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