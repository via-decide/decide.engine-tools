You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Create branch feature/logichub-dual-export. Update tools/engine/logichub/tool.js and index.html. Add two buttons to the action bar: "[EXPORT .MD (PROMPTS & CODE)]" and "[EXPORT PDF]". Implement exportArchitectureMarkdown(map). It must generate a .md file containing the ASCII tree diagram, and for each block, print the EXACT prompt used to generate it, followed by the generated code. Implement exportArchitecturePDF(map) using jspdf. For BOTH exports, implement the Native Web Share API (navigator.share) for mobile devices, gracefully falling back to a standard blob download (a.download) on desktop browsers. Ensure both buttons remain disabled ([LOCKED]) until all blocks are VERIFIED and the architecture is confirmed. Commit with message "feat: add PDF and Markdown dual-export to LogicHub". Push branch and open PR to main titled "Feat: Dual-Export Engine (PDF & MD)"

CONSTRAINTS
Pure Vanilla JS. The Markdown file must enclose Prompts in > blockquotes or `text``` blocks, and code in ```javascript``` blocks so tools like GitHub/VSCode render native 'Copy' buttons for the user.
Create branch feature/logichub-gemini-integration. Update tools/engine/logichub/tool.js. Implement the generateCodeForBlock() function to call generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent. Ensure it passes the dependsOn block code as context in the prompt. Implement the getContextIdeas() function for Orphaned blocks using Gemini. Refactor saveMap() and loadMap() to use the OS's centralized localStorage key (e.g., orchard_logichub_maps) instead of temporary sessionStorage. Add a dynamic, scrolling terminal logger (#lh-logger) that keeps the last 20 events visible. Commit with message "feat: integrate Gemini API and persistent state for LogicHub". Push branch and open PR to main titled "Feat: Gemini API & State Sync"

CONSTRAINTS
Handle Gemini API errors gracefully (e.g., "API Key Leaked" or "Quota Exceeded") by showing them in the scrolling logger and marking the block status as "ERROR".
Create branch feature/logichub-core-ui. Create a new directory tools/engine/logichub/. Inside, create index.html, tool.js, and config.json. Migrate the layout, SVG paths, and CSS of the latest LogicHub node-editor prototype into these files. Ensure the dragging logic, snap-to-port radius (50px), and mobile-responsive palettes are fully functional. Replace the prototype CSS variables (e.g., --bg) with the global OS variables (e.g., --color-soil-dark) so it matches the rest of the game engine's aesthetic. Commit with message "feat: add LogicHub node editor UI to engine tools". Push branch and open PR to main titled "Feat: LogicHub Core UI Migration"

CONSTRAINTS
Pure Vanilla JS. Do not use external libraries for the node dragging or SVG line drawing. The config.json must register the tool correctly in the OS.

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
⭐ If this saved you $X in API costs, star this repo Help other devs discover metadata-driven development # VIA Platform: 58-Tool Ecosystem with 80% Token Savings > **Before you fork another monorepo: This one saved me $33,756 in API costs and 2.25M tokens. Here's how.** [Detailed breakdown...] #

- AGENTS snippet:
# AGENTS.md — ViaDecide Studio ## Rules for all AI coding agents working in this repository --- ## IDENTITY This is a **production codebase** for a $199/month subscription product on the Play Store. Every change you make affects paying subscribers. Treat it accordingly. --- ## HARD GATE 1 — DES
ENGINE-TOOLS ARCHITECTURE (mandatory compliance)
Tool directory: tools/<tool>/
Required files: config.json, index.html, tool.js
Shared dependencies to import: shared/tool-storage.js, shared/shared.css
config.json must include: id, name, description, category, audience, inputs, outputs, tags
Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js
Do NOT modify any existing tool folder or shared utility file.
Do NOT use external frameworks, CDN packages, or bundlers.

SOP: PRE-MODIFICATION PROTOCOL (MANDATORY)
1. Adherence to Instructions: No deviations without explicit user approval.
2. Mandatory Clarification: Immediately ask if instructions are ambiguous or incomplete.
3. Proposal First: Always propose optimizations or fixes before implementing them.
4. Scope Discipline: Do not add unrequested features or modify unrelated code.
5. Vulnerability Check: Immediately flag and explain security risks.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.