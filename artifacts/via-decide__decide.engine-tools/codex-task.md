You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Add candidate-comparison-view tool in tools/engine/candidate-comparison-view/ with config.json, index.html, tool.js. Allows recruiters to view side-by-side comparisons of player orchard profiles, emphasizing consistency, trust scores, and growth trends over pure volume. Vanilla JS.
fix shared/tool-registry.js - the file has a syntax error caused by an unclosed TOOL_OVERRIDES object literal and triple-declared const variables in normalizeTool(); rewrite the file as a single clean IIFE with one TOOL_OVERRIDES object, one normalizeTool function, and no duplicate declarations; preserve all existing tool IDs in importableToolDirs and ENGINE_TOOL_IDS

CONSTRAINTS
edit shared/tool-registry.js only; do not touch any other file; preserve all importableToolDirs entries
fix shared/tool-graph.js - the file has a syntax error from a duplicate IIFE header, a broken unclosed init() function, and a misplaced comment that splits a return statement; rewrite as a single clean IIFE with use strict at top, one set of const declarations, one init() function with error handling, and no duplicate code

CONSTRAINTS
edit shared/tool-graph.js only; do not touch any other file; preserve all graph rendering and pan/zoom logic

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
# Decide Engine Tools + Orchard Engine Foundation

This repository is a preservation-first browser-native tool mesh by **ViaDecide**.

It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career game system.

## Preservation-first policy

- Existing standalone tools are preserved.
- New systems are additive.
- No unrelated folder is deleted or replaced.
- Tools remain standalone HTML/CSS/JS.

## Tool categories

Tools are organized into 9 categories. The index page at `index.html` renders them grouped automatically from registry metadata.

| Category | Tools |
|---|---|
| **Creators** | PromptAlchemy, Script Generator |
| **Coders** | Code Generator, Code Reviewer, Agent Builder, App Generator |
| **Researchers** | Multi Source Research, Student Research |
| **Business** | Sales Dashbo

- AGENTS snippet:
Rules for coding agents in this repository:

1. Never delete tool folders.
2. Never remove working code from tools.
3. Never replace a tool with a placeholder.
4. Prefer additive changes.
5. Tools must remain standalone HTML apps.
6. Routing must never break existing tools.
7. If reorganizing tools, move them safely and update references.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.