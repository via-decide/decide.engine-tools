You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
> Create a new branch feature/ux-audio-manager. Create a file shared/audio-manager.js. Build an AudioManager that initializes the Web Audio API or uses simple HTMLAudioElement objects. It should preload 3-4 very short, subtle base64-encoded sound strings (or simple synthesized oscillators): a "pop" for clicks, a "chime" for success, and a "low thud" for errors. Implement a vibrate(pattern) method using the navigator.vibrate API for mobile devices. Add a global "Mute" toggle state stored in localStorage. Listen for global custom events (e.g., agent:step_success, growth:stage_evolved) to play the corresponding sound and haptic pattern automatically. Commit the changes with the message "feat: add global audio and haptic feedback manager". Push the branch and open a Pull Request to main with the title "Feat: Audio & Haptic Manager" and a description mentioning tactile game feedback.

CONSTRAINTS
> Pure Vanilla JS. Use synthesized oscillator sounds or incredibly tiny base64 strings to avoid loading external asset files. Respect the browser's autoplay policies (require a user interaction first).

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