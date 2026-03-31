Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'DataMasker' (The PII & Secrets Scrubber). Create a new folder /DataMasker and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI: Left pane <textarea> for pasting raw code/logs/JSON. Right pane <textarea> for the masked, safe output. 2. The Scrubbing Engine (Heavy Regex): - Identify and replace Emails with [EMAIL]. - Identify and replace IPv4/IPv6 addresses with [IP]. - Identify and replace UUIDs with [UUID]. - Identify and replace JSON Web Tokens (JWTs) with [JWT]. - Identify and replace standard API Keys (e.g., sk-[a-zA-Z0-9]+, AIza[a-zA-Z0-9_-]+) with [API_KEY]. - Identify and replace phone numbers with [PHONE]. 3. Context Preservation: If multiple distinct emails are found, number them sequentially (e.g., [EMAIL_1], [EMAIL_2]) so the LLM can still track relationships in the data. 4. Real-Time Stats: Display a counter at the top: Detected: 3 Emails, 1 API Key, 4 UUIDs (Secured & Optimized). 5. Add a massive [ COPY SECURE PAYLOAD ] button. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

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