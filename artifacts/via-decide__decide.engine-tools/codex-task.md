You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'PromptMatrix' (The XML Metaprompt Compiler). Create a new folder /PromptMatrix and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Visual Form Inputs: - System Role (textarea): Who the AI is acting as. - Primary Objective (textarea): The core goal. - Constraints (Dynamic list): A section to click [+ Add Constraint] and type strict rules (e.g., "Do not use markdown"). - Output Format (Dropdown & text): Select JSON, XML, or Plain Text, and define the exact schema. - Few-Shot Examples (Dynamic list): Fields for Input Example and Expected Output Example. 2. The XML Compiler Engine: - On compilation, wrap every filled section in its corresponding XML tag (Anthropic/Google best practice standard). - E.g., wrap the role in <system_role>, constraints in <rules><rule>...</rule></rules>, and examples in <examples><example>...</example></examples>. 3. Real-Time Preview & Token Stats: - As the user types, instantly update a <textarea> on the right half of the screen with the live compiled XML prompt. - Show an estimated token count (assume ~4 chars per token) to keep the system prompt lean. 4. The Payload Delivery: - Provide a massive [ COPY METAPROMPT ] button to instantly copy the hardened XML string for deployment into LogicHub or Viaco's backend. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. DOM manipulation for adding dynamic input rows must be smooth. The output must perfectly escape any reserved characters to prevent XML parsing errors in the LLM.

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