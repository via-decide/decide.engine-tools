You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'DataMasker' (The PII & Secrets Scrubber). Create a new folder /DataMasker and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI: Left pane <textarea> for pasting raw code/logs/JSON. Right pane <textarea> for the masked, safe output. 2. The Scrubbing Engine (Heavy Regex): - Identify and replace Emails with [EMAIL]. - Identify and replace IPv4/IPv6 addresses with [IP]. - Identify and replace UUIDs with [UUID]. - Identify and replace JSON Web Tokens (JWTs) with [JWT]. - Identify and replace standard API Keys (e.g., sk-[a-zA-Z0-9]+, AIza[a-zA-Z0-9_-]+) with [API_KEY]. - Identify and replace phone numbers with [PHONE]. 3. Context Preservation: If multiple distinct emails are found, number them sequentially (e.g., [EMAIL_1], [EMAIL_2]) so the LLM can still track relationships in the data. 4. Real-Time Stats: Display a counter at the top: Detected: 3 Emails, 1 API Key, 4 UUIDs (Secured & Optimized). 5. Add a massive [ COPY SECURE PAYLOAD ] button. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Use robust standard Regex patterns for data detection. Processing must be 100% local so no sensitive data is ever transmitted.

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