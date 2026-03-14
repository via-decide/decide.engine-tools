You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
add tools/creators/social-content-generator/ with config.json index.html tool.js - a standalone social media content generator; user enters one topic/idea and clicks Generate; the tool outputs ready-to-copy scripts for 7 sections: (1) LinkedIn Post, (2) WhatsApp Channel Post, (3) YouTube Title + Description + First Comment + Ping Comment, (4) Community Post, (5) Spotify Episode Title + Description + Post Time suggestion; plus an AI Image Prompt for each platform; each section has its own labelled card with a Copy button; all output is pure text generated from templates using the input topic; use the Orchard palette colors soil #1A1614 leaf #52B756 water #29B6F6 gold #FFCA28; layout is two columns on desktop, single column on mobile; save last input to localStorage key social_content_generator_draft

CONSTRAINTS
edit tools/creators/social-content-generator/ only; do not touch router.js tool-registry.js index.html README or any shared file; no external APIs; all generation is template-based vanilla JS; load ../../shared/shared.css and tool.js only

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