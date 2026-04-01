Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'PromptMatrix' (The XML Metaprompt Compiler). Create a new folder /PromptMatrix and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Visual Form Inputs: - System Role (textarea): Who the AI is acting as. - Primary Objective (textarea): The core goal. - Constraints (Dynamic list): A section to click [+ Add Constraint] and type strict rules (e.g., "Do not use markdown"). - Output Format (Dropdown & text): Select JSON, XML, or Plain Text, and define the exact schema. - Few-Shot Examples (Dynamic list): Fields for Input Example and Expected Output Example. 2. The XML Compiler Engine: - On compilation, wrap every filled section in its corresponding XML tag (Anthropic/Google best practice standard). - E.g., wrap the role in <system_role>, constraints in <rules><rule>...</rule></rules>, and examples in <examples><example>...</example></examples>. 3. Real-Time Preview & Token Stats: - As the user types, instantly update a <textarea> on the right half of the screen with the live compiled XML prompt. - Show an estimated token count (assume ~4 chars per token) to keep the system prompt lean. 4. The Payload Delivery: - Provide a massive [ COPY METAPROMPT ] button to instantly copy the hardened XML string for deployment into LogicHub or Viaco's backend. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

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