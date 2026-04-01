You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'TwinTerminal' (The Cognitive RAG Chat). Create a new folder /TwinTerminal and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Setup & Auth: - A side panel to input Gemini API Key (BYOK) and a drag-and-drop zone to load the .vdb (Vector Database) file into memory. - Display a "Brain Status" indicator (e.g., Status: Synced | Memories: 5,821). 2. The Chat Interface: - A main chat window (like ChatGPT) with a message input area at the bottom. - Support for Markdown rendering in the chat bubbles. 3. The Local RAG Pipeline (The Magic): - When the user sends a message, FIRST ping the Gemini Embedding API to vectorize their text. - SECOND, run local cosine similarity against the .vdb file to find the Top 3 most relevant historical commits/PRDs. - THIRD, compile a master prompt: "You are the user's Cognitive Twin. Answer their query using ONLY the following historical architectural memories: [Insert Top 3 Memories]. Query: [User Message]". - FOURTH, send this master prompt to the Gemini text generation API. 4. Streaming Response & Citations: - Use the Gemini Streaming API to type out the response in real-time. - At the bottom of the AI's response bubble, append a small "Citations" block showing exactly which past commits it used to generate the answer (e.g., Recalled: "Swipe UI Logic" (Week 4), "Viaco Dashboard" (Week 12)). UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Must implement fetch with streaming (response.body.getReader()) to ensure the chat feels instantaneous and modern. The RAG pipeline must execute silently in the background before the chat response begins.

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