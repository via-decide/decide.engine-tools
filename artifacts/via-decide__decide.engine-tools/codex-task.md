You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'ContextWeaver' (The Multi-File Prompt Assembler). Create a new folder /ContextWeaver and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Drag & Drop Zone: Use the HTML5 File API and webkitGetAsEntry to allow users to drag and drop multiple files OR an entire folder into the browser. 2. The File Tree (Left Pane): Parse the dropped files and render a visual file tree (e.g., 📁 src -> 📄 app.js). - Add a checkbox next to every file. All files are checked by default. 3. The Compiler (Right Pane): A live-updating <textarea> that concatenates the contents of ALL checked files. 4. Formatting: Wrap each file's content in LLM-optimized XML tags: <file path="src/app.js"> [FILE CONTENT HERE] </file> 5. Add a massive [ COPY MASTER PROMPT ] button that copies the entire payload to the clipboard. 6. Add a "Token Estimate" counter that roughly estimates the token count (Words * 1.3) so the user knows if they are blowing their context window. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Use native Browser File APIs to read directories. All processing must happen 100% locally in the browser for speed and privacy.

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