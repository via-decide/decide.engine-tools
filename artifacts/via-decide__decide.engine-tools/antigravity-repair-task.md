Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Build a new micro-frontend named 'DOMScrubber' (The HTML & SVG Token Slayer). Create a new folder /DOMScrubber and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI: Left pane <textarea> for pasting raw, bloated HTML/DOM code. Right pane <textarea> for the stripped semantic output. 2. The Scrubbing Engine (DOMParser based): - Use new DOMParser().parseFromString() to load the input locally. - Find and fully remove all <svg>, <script>, <style>, <noscript>, <iframe>, and <link> elements. - Traverse all remaining nodes and STRIP all attributes EXCEPT: id, name, type, href, src, value, placeholder. (Crucially, it must remove class, style, and data-* attributes). - Collapse empty <div> or <span> elements if they contain no text or children. 3. Formatting: Output the cleaned, indented HTML wrapped in LLM-optimized <ui_structure> tags. 4. Real-Time Stats: Display token/character reduction: Raw DOM: 150KB ➔ Scrubbed Skeleton: 4KB (97% Saved). 5. Add a massive [ COPY SKELETON ] button. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

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