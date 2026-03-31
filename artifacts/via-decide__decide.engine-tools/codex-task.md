You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'ToolForge' (The AI Agent Function Builder). Create a new folder /ToolForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Main Form: Inputs for Function Name and Function Description. 2. Parameters List: A dynamic section where users can click [+ Add Parameter]. - Each parameter needs: Name (e.g., location), Type (String, Integer, Boolean, Object, Array), Description, and a checkbox [x] Required. 3. The Compiler: A button that takes the visual inputs and generates the exact JSON Schema required for LLM Function Calling (OpenAI/Gemini/Anthropic standard). 4. The output must be perfectly formatted JSON, wrapped in <tool_schema> tags or standard JSON block, displayed in a <textarea>. 5. Add a [ COPY SCHEMA ] button. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS DOM manipulation for adding/removing parameter rows. Output must be valid, strict JSON Schema Draft-07 format (which LLMs use for tool calling).
Build a new micro-frontend named 'TraceTrimmer' (The Error Log Optimizer). Create a new folder /TraceTrimmer and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI: Left pane <textarea> for pasting raw, bloated terminal/browser error logs. Right pane <textarea> for the pruned output. 2. The Trimming Engine (Regex based): - Strip timestamps (e.g., [2026-03-31 10:45:00], YYYY-MM-DDTHH:mm:ss.sssZ). - Strip memory addresses (e.g., 0x0000000...). - Optional Toggle [x]: "Hide Library Traces" (Removes lines containing node_modules, chrome-extension://, anonymous function).

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Heavy use of efficient Regex .replace() and string manipulation. Must run instantly in the browser without freezing on large text blocks.
Build a new micro-frontend named 'PayloadPruner' (The JSON Token Optimizer). Create a new folder /PayloadPruner and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI: Left pane <textarea> for pasting raw, bloated JSON. Right pane <textarea> for the pruned output. 2. The Pruning Engine: Write a recursive JavaScript function that parses the input JSON and applies these rules: - IF it encounters an Array: Keep ONLY the first item (index 0) and discard the rest. Add a dummy string "_NOTE": "Array truncated for LLM context" as the second item if it was truncated. - IF it encounters a String longer than 40 characters: Truncate it and append .... 3. Feature Toggle: Add a checkbox [ ] "Generate TypeScript Interfaces Instead". If checked, instead of pruned JSON, use basic JS logic to map the JSON keys to a TS Interface (e.g., id: string;). 4. Real-Time Stats: Display a token/character comparison at the top: Original: 45KB ➔ Pruned: 2KB (95% Saved). 5. Add a [ COPY PRUNED PAYLOAD ] button. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Use JSON.parse and recursive object traversal for the pruning logic. Handle invalid JSON gracefully without crashing.
Build a new micro-frontend named 'ContextWeaver' (The Multi-File Prompt Assembler). Create a new folder /ContextWeaver and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Drag & Drop Zone: Use the HTML5 File API and webkitGetAsEntry to allow users to drag and drop multiple files OR an entire folder into the browser. 2. The File Tree (Left Pane): Parse the dropped files and render a visual file tree (e.g., 📁 src -> 📄 app.js). - Add a checkbox next to every file. All files are checked by default. 3. The Compiler (Right Pane): A live-updating <textarea> that concatenates the contents of ALL checked files. 4. Formatting: Wrap each file's content in LLM-optimized XML tags: <file path="src/app.js"> [FILE CONTENT HERE] </file> 5. Add a massive [ COPY MASTER PROMPT ] button that copies the entire payload to the clipboard. 6. Add a "Token Estimate" counter that roughly estimates the token count (Words * 1.3) so the user knows if they are blowing their context window. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Use native Browser File APIs to read directories. All processing must happen 100% locally in the browser for speed and privacy.
Build a new micro-frontend named 'JSONCore' (The Strict-Schema Prompt Builder). Create a new folder /JSONCore and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Schema Builder UI: A dynamic list where users can click [+ Add Key] to define JSON properties.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS DOM manipulation for adding/removing schema rows. No external schema validation libraries.
Build a new micro-frontend named 'MacroForge' (The VBA / Excel Prompt Compiler). Create a new folder /MacroForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. UI Grid: Render a lightweight, interactive spreadsheet grid (Columns A-G, Rows 1-10) using CSS Grid. 2. Range Selector: Allow the user to click and drag to highlight an "Input Range" (colors it Cyan) and an "Output Range" (colors it Saffron). 3. Action Panel: A dropdown menu of common Excel operations: [Filter, Sort, Loop & Math, VLOOKUP/Index-Match, Data Cleaning]. 4. The Compiler: A button that generates a hyper-dense, machine-readable prompt string based on the selections.

CONSTRAINTS
Zero NPM dependencies. No heavy spreadsheet libraries (no Handsontable or DataTables). Build the basic grid using raw Vanilla JS DOM manipulation and CSS Grid.
Build a new micro-frontend named 'TokenSqueeze' (The Context Compressor). Create a new folder /TokenSqueeze and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Input: A drag-and-drop zone for files (JS, HTML, CSS, PY, TXT) AND a standard <textarea> for direct pasting. 2. The Squeeze Engine: Write regex/string manipulation to locally: - Strip single-line comments (//, #). - Strip multi-line comments (/* */, ``, """ """). - Remove all blank lines and unnecessary indentation. 3. Output Formatting: Wrap the minified code in LLM-optimized XML tags: <file name="[filename]">[minified_code]</file>. If pasted text without a filename, use <snippet>. 4. Display the output in a read-only <textarea> with a prominent [ COPY TO CLIPBOARD ] button. 5. Calculate and display the "Space Saved" (e.g., "Original: 50KB | Squeezed: 32KB | Saved: 36%"). UI/UX AESTHETIC: - Conform to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. No external minification libraries; use custom Regex for the stripping logic to keep it lightweight. Must run 100% locally in the browser.

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