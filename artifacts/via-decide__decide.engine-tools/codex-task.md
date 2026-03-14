You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Create tools/engine/upsc-current-affairs/. Build a Vanilla JS RSS feed reader that fetches daily updates from public Indian news feeds (using a free CORS proxy like api.allorigins.win if necessary). Render a clean, ad-free list of daily headlines and summaries. Add a "Track" button next to each article that dispatches window.dispatchEvent(new CustomEvent('engine:mission_added', { detail: { text: "Read: " + article.title, type: "Study" } })).

CONSTRAINTS
pure Vanilla JS; handle fetch errors gracefully; strictly informative and text-heavy UI matching the OS theme.
Create tools/engine/upsc-mains-simulator/. Build a strict, timed text-editor UI. Users select a question type (10-marker or 15-marker) which starts an un-pausable countdown (7 or 11 minutes). Disable paste events (onpaste="return false"). Include a live Word Count and WPM tracker. Upon timeout or manual submit, dispatch window.dispatchEvent(new CustomEvent('engine:upsc_mains_written', { detail: { answerText } })) to send the payload to the OS AI Evaluator.

CONSTRAINTS
pure Vanilla JS; strictly block external copy-pasting to simulate exam conditions; clean, distraction-free writing interface.
Create tools/engine/upsc-swipe-deck/. Build a Vanilla JS swipe-based flashcard application. The UI must feature a central stack of cards holding UPSC facts (e.g., "Article 14", "Simlipal National Park location"). Implement mouse/touch drag physics. Swipe Right marks it "Known", Swipe Left marks it "Forgot". When a card is swiped left, dispatch window.dispatchEvent(new CustomEvent('engine:upsc_error_logged', { detail: { topic: card.topic, desc: card.fact, revDate: nextDay } })) to feed the main OS error tracker.

CONSTRAINTS
pure Vanilla JS and CSS for swipe physics (no external swipe libraries); standalone execution; integrate seamlessly with standard Orchard CSS variables.

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