You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'PayloadPruner' (The JSON Token Optimizer). Create a new folder /PayloadPruner and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI: Left pane <textarea> for pasting raw, bloated JSON. Right pane <textarea> for the pruned output. 2. The Pruning Engine: Write a recursive JavaScript function that parses the input JSON and applies these rules: - IF it encounters an Array: Keep ONLY the first item (index 0) and discard the rest. Add a dummy string "_NOTE": "Array truncated for LLM context" as the second item if it was truncated. - IF it encounters a String longer than 40 characters: Truncate it and append .... 3. Feature Toggle: Add a checkbox [ ] "Generate TypeScript Interfaces Instead". If checked, instead of pruned JSON, use basic JS logic to map the JSON keys to a TS Interface (e.g., id: string;). 4. Real-Time Stats: Display a token/character comparison at the top: Original: 45KB ➔ Pruned: 2KB (95% Saved). 5. Add a [ COPY PRUNED PAYLOAD ] button. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Use JSON.parse and recursive object traversal for the pruning logic. Handle invalid JSON gracefully without crashing.

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