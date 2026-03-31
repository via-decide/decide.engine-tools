Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'PayloadPruner' (The JSON Token Optimizer). Create a new folder /PayloadPruner and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI: Left pane <textarea> for pasting raw, bloated JSON. Right pane <textarea> for the pruned output. 2. The Pruning Engine: Write a recursive JavaScript function that parses the input JSON and applies these rules: - IF it encounters an Array: Keep ONLY the first item (index 0) and discard the rest. Add a dummy string "_NOTE": "Array truncated for LLM context" as the second item if it was truncated. - IF it encounters a String longer than 40 characters: Truncate it and append .... 3. Feature Toggle: Add a checkbox [ ] "Generate TypeScript Interfaces Instead". If checked, instead of pruned JSON, use basic JS logic to map the JSON keys to a TS Interface (e.g., id: string;). 4. Real-Time Stats: Display a token/character comparison at the top: Original: 45KB ➔ Pruned: 2KB (95% Saved). 5. Add a [ COPY PRUNED PAYLOAD ] button. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.
Build a new micro-frontend named 'ContextWeaver' (The Multi-File Prompt Assembler). Create a new folder /ContextWeaver and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Drag & Drop Zone: Use the HTML5 File API and webkitGetAsEntry to allow users to drag and drop multiple files OR an entire folder into the browser. 2. The File Tree (Left Pane): Parse the dropped files and render a visual file tree (e.g., 📁 src -> 📄 app.js). - Add a checkbox next to every file. All files are checked by default. 3. The Compiler (Right Pane): A live-updating <textarea> that concatenates the contents of ALL checked files. 4. Formatting: Wrap each file's content in LLM-optimized XML tags: <file path="src/app.js"> [FILE CONTENT HERE] </file> 5. Add a massive [ COPY MASTER PROMPT ] button that copies the entire payload to the clipboard. 6. Add a "Token Estimate" counter that roughly estimates the token count (Words * 1.3) so the user knows if they are blowing their context window. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.
Build a new micro-frontend named 'JSONCore' (The Strict-Schema Prompt Builder). Create a new folder /JSONCore and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Schema Builder UI: A dynamic list where users can click [+ Add Key] to define JSON properties.
Build a new micro-frontend named 'MacroForge' (The VBA / Excel Prompt Compiler). Create a new folder /MacroForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. UI Grid: Render a lightweight, interactive spreadsheet grid (Columns A-G, Rows 1-10) using CSS Grid. 2. Range Selector: Allow the user to click and drag to highlight an "Input Range" (colors it Cyan) and an "Output Range" (colors it Saffron). 3. Action Panel: A dropdown menu of common Excel operations: [Filter, Sort, Loop & Math, VLOOKUP/Index-Match, Data Cleaning]. 4. The Compiler: A button that generates a hyper-dense, machine-readable prompt string based on the selections.
Build a new micro-frontend named 'TokenSqueeze' (The Context Compressor). Create a new folder /TokenSqueeze and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Input: A drag-and-drop zone for files (JS, HTML, CSS, PY, TXT) AND a standard <textarea> for direct pasting. 2. The Squeeze Engine: Write regex/string manipulation to locally: - Strip single-line comments (//, #). - Strip multi-line comments (/* */, ``, """ """). - Remove all blank lines and unnecessary indentation. 3. Output Formatting: Wrap the minified code in LLM-optimized XML tags: <file name="[filename]">[minified_code]</file>. If pasted text without a filename, use <snippet>. 4. Display the output in a read-only <textarea> with a prominent [ COPY TO CLIPBOARD ] button. 5. Calculate and display the "Space Saved" (e.g., "Original: 50KB | Squeezed: 32KB | Saved: 36%"). UI/UX AESTHETIC: - Conform to the Daxini OS standard.

RULES
1. Audit touched files first and identify regressions.
2. Preserve architecture and naming conventions.
3. Make minimal repairs only; do not expand scope.
4. Re-run checks and provide concise root-cause notes.
5. Return complete contents for changed files only.

SOP: REPAIR PROTOCOL (MANDATORY)
1. Strict Fix Only: Do not use repair mode to expand scope or add features.
2. Regression Check: Audit why previous attempt failed before proposing a fix.
3. Minimal Footprint: Only return contents for the actual repaired files.

REPO CONTEXT
- README snippet:
⭐ If this saved you $X in API costs, star this repo Help other devs discover metadata-driven development # VIA Platform: 58-Tool Ecosystem with 80% Token Savings > **Before you fork another monorepo: This one saved me $33,756 in API costs and 2.25M tokens. Here's how.** [Detailed breakdown...] #
- AGENTS snippet:
# AGENTS.md — ViaDecide Studio ## Rules for all AI coding agents working in this repository --- ## IDENTITY This is a **production codebase** for a $199/month subscription product on the Play Store. Every change you make affects paying subscribers. Treat it accordingly. --- ## HARD GATE 1 — DES
- package.json snippet:
{ "name": "decide-engine-tools", "version": "1.0.0", "description": "ViaDecide Studio — 37 decision-making, productivity and game tools", "private": true, "scripts": { "test": "node tests/run-all.js", "test:unit": "node tests/unit/run.js", "test:smoke": "node tests/smoke/run.js