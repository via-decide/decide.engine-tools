# Decide Engine Tools + Orchard Engine Foundation

This repository is a preservation-first browser-native tool mesh.

It now includes the first real foundation of **Orchard Engine**, a merit-based farming-career game system.

## Preservation-first policy

- Existing standalone tools are preserved.
- New systems are additive.
- No unrelated folder is deleted or replaced.

## Orchard Engine (first wave)

New engine tools are under:

`tools/engine/*`

They cover:

- player signup and orchard profile setup,
- farm initialization and growth calculators,
- daily/weekly/monthly progression loops,
- fair ranking and trust logic,
- commons collaboration tools,
- recruiter discovery and readiness scoring,
- four-direction planning and AI coaching,
- simulation and meta-health monitoring.

## Shared foundation

Shared files include:

- `shared/tool-registry.js`
- `shared/tool-bridge.js`
- `shared/tool-storage.js`
- `shared/shared.css`
- `shared/engine-utils.js`
- `shared/engine-models.js`

## Future routing

Category routing is still deferred, but metadata and discovery are prepared for future category-aware flows.

## Docs

- `ORCHARD_ENGINE_DESIGN.md`
- `ARCHITECTURE.md`
- `CONTRIBUTING.md`
- `AGENTS.md`
# Decide Engine Tools

Preservation-first, browser-native tool mesh for ViaDecide.

## What this repository is

This repo hosts standalone decision and productivity tools that run directly in the browser with no build step.

The ecosystem is being prepared as an **import-friendly staging repo** so many solo tool repos can be absorbed over time without losing existing code.

## Preservation-first principles

- Never delete or simplify unrelated tools.
- Keep existing tool behavior intact.
- Prefer additive adapters, metadata, and shared helpers.
- Keep tools standalone HTML/CSS/JS whenever possible.

## Current structure

- `/shared` → lightweight interoperability layer (`tool-registry.js`, `tool-bridge.js`, `tool-storage.js`, `shared.css`)
- `/tools` → modular tools that already follow shared metadata conventions
- legacy standalone tool folders at root (for example: `prompt-alchemy`, `agent`, `founder`, `student-research`, etc.)

## Metadata model

Each tool can expose `config.json` with:

- `id`
- `name`
- `description`
- `category`
- `audience`
- `inputs`
- `outputs`
- `relatedTools`
- `entry`
- `tags`

This allows tool discovery without forcing destructive rewrites.

## Future category routing (not implemented yet)

Routing will later support folders and metadata for categories such as:

- creators
- gamers
- coders
- students
- researchers
- founders
- operators

This phase only prepares compatibility hooks and metadata for that routing.

## Open-source direction

The long-term goal is a browser-native tool network where tools can:

- open related tools,
- send context to other tools,
- receive context from other tools,
- return result context back into source workflows.

See also:

- `ARCHITECTURE.md`
- `CONTRIBUTING.md`
- `AGENTS.md`
generating lightweight apps

converting complex analysis into decision briefs


Each tool focuses on one problem and solves it simply.


---

Tools Included

Prompt Alchemy
Generate structured prompts for AI systems.

Agent Builder
Design simple AI agents and workflows.

App Generator
Create lightweight tools and micro-apps.

Interview Prep
Prepare structured answers for interviews.

Student Research
Combine multiple sources into structured insights.

Decision Brief Guide
Turn complex thinking into concise decision summaries.

Multi Source Research Explained
Understand and structure research across multiple sources.

Sales Dashboard
Track and analyze sales performance.

Founder
Founder positioning and narrative builder.


---

Design Philosophy

The tools follow a few principles.

1. Small tools win

Each tool solves a specific problem.

Not a large platform.

2. Thinking > features

The goal is structured thinking, not feature complexity.

3. Fast to use

Most tools should work in seconds.

4. Clear outcomes

Every tool produces a useful output:

a prompt

a brief

a plan

a workflow



---

Why This Exists

AI tools make content generation easier.

But most problems people face are decision problems:

What should I build?

Is this idea worth pursuing?

How should I structure this research?

What should my next step be?


These tools are designed to support decision workflows, not just content generation.


---

Project Structure

Each tool is implemented as a standalone web page.

This keeps the system:

simple

modular

easy to extend


New tools can be added without modifying the entire system.


---

Repository

Source code:

https://github.com/via-decide/decide.engine-tools

Live tools:

https://via-decide.github.io/decide.engine-tools/


---

Contributing

New tools, improvements, and experiments are welcome.

Ideas that fit the philosophy of simple decision tools are encouraged.


---

ViaDecide

This project is part of the ViaDecide ecosystem, focused on building tools and systems that improve how people think, decide, and execute.

---

Tool Ecosystem Expansion

A new modular generation ecosystem now exists under:

- `/tools` for standalone tool apps
- `/shared` for lightweight shared utilities
- `/docs` for architecture and usage guidance

See `docs/README.md` and `docs/ARCHITECTURE.md` for details.

---

## Wave 1 Simulation Tools

Three new tools validate that the Layer 1 (Farm) game loop is fair before any expansion:

### 1. Synthetic Player Generator

`tools/engine/synthetic-player-generator/index.html`

Generates realistic test players across 6 archetypes (slow learner, fast learner, spammer, consistent player, lazy player, high-potential irregular). Configurable count, archetype mix, and RNG seed.

### 2. Wave 1 Simulation Runner

`tools/engine/wave1-simulation-runner/index.html`

Runs 30/60/90-day simulations modeling daily quest completion, root growth, trunk growth, fruit generation, weekly harvest scoring, monthly promotion evaluation, and fair ranking. Outputs leaderboard, archetype summaries, fairness notes, and exploit indicators.

### 3. Balance Dashboard

`tools/engine/balance-dashboard/index.html`

Analyzes simulation output for fairness: spam advantage ratio, quality-vs-volume balance, archetype domination risk, promotion rate distribution, and weekly/fruit score distributions. Renders a BALANCED / MINOR ISSUES / REBALANCE NEEDED verdict.

### How to use

1. Open each tool's `index.html` directly in a browser (no build step, no server).
2. Start with the Synthetic Player Generator to create a player set.
3. Run the Wave 1 Simulation Runner (it auto-loads generated players from localStorage).
4. Open the Balance Dashboard for a full fairness analysis.
5. Tune parameters and re-run until the verdict is BALANCED.

### Why Layer 2 and Layer 3 should wait

Layer 2 (Commons: seed exchange, fruit sharing, circles, peer validation, trust scoring) and Layer 3 (Market: recruiter dashboard, discovery search, hire readiness) depend on a proven fair Layer 1 loop. If spammers can dominate ranking or lazy players can accidentally promote, the trust and recruiter layers will inherit and amplify those imbalances. Validate Wave 1 first.
