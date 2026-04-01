Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'TwinTerminal' (The Cognitive RAG Chat). Create a new folder /TwinTerminal and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Setup & Auth: - A side panel to input Gemini API Key (BYOK) and a drag-and-drop zone to load the .vdb (Vector Database) file into memory. - Display a "Brain Status" indicator (e.g., Status: Synced | Memories: 5,821). 2. The Chat Interface: - A main chat window (like ChatGPT) with a message input area at the bottom. - Support for Markdown rendering in the chat bubbles. 3. The Local RAG Pipeline (The Magic): - When the user sends a message, FIRST ping the Gemini Embedding API to vectorize their text. - SECOND, run local cosine similarity against the .vdb file to find the Top 3 most relevant historical commits/PRDs. - THIRD, compile a master prompt: "You are the user's Cognitive Twin. Answer their query using ONLY the following historical architectural memories: [Insert Top 3 Memories]. Query: [User Message]". - FOURTH, send this master prompt to the Gemini text generation API. 4. Streaming Response & Citations: - Use the Gemini Streaming API to type out the response in real-time. - At the bottom of the AI's response bubble, append a small "Citations" block showing exactly which past commits it used to generate the answer (e.g., Recalled: "Swipe UI Logic" (Week 4), "Viaco Dashboard" (Week 12)). UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

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