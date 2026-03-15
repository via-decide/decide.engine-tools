Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
> Create a new branch feature/ux-audio-manager. Create a file shared/audio-manager.js. Build an AudioManager that initializes the Web Audio API or uses simple HTMLAudioElement objects. It should preload 3-4 very short, subtle base64-encoded sound strings (or simple synthesized oscillators): a "pop" for clicks, a "chime" for success, and a "low thud" for errors. Implement a vibrate(pattern) method using the navigator.vibrate API for mobile devices. Add a global "Mute" toggle state stored in localStorage. Listen for global custom events (e.g., agent:step_success, growth:stage_evolved) to play the corresponding sound and haptic pattern automatically. Commit the changes with the message "feat: add global audio and haptic feedback manager". Push the branch and open a Pull Request to main with the title "Feat: Audio & Haptic Manager" and a description mentioning tactile game feedback.

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