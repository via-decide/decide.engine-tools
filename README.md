⭐ If this saved you $X in API costs, star this repo
Help other devs discover metadata-driven development

# VIA Platform: 58-Tool Ecosystem with 80% Token Savings

> **Before you fork another monorepo: This one saved me $33,756 in API costs and 2.25M tokens. Here's how.**

[Detailed breakdown...]

## The Results

### One Feature Without This
- Time: 3-4 weeks
- Tokens: 450k-550k
- Cost: $8-10

### One Feature With This  
- Time: 1-2 days
- Tokens: 90k
- Cost: $1.62

**Savings: 81% tokens. 80% cost. 10x faster.**

### Full 58-Tool Ecosystem
- Without: 2,494,000 tokens ($37,410)
- With: 243,600 tokens ($3,654)
- **Saved: 2,250,400 tokens ($33,756)**

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
| **Business** | Sales Dashboard, Founder, Decision Brief, Spec Builder, Export Studio, Template Vault |
| **Education** | Interview Prep, Wings of Fire Quiz |
| **Games** | Wings of Fire Quiz |
| **Simulations** | All 26 Orchard Engine tools |
| **System** | Tool Router |
| **Misc** | Uncategorized |

## How routing works

Open `index.html` to browse all tools by category.

Deep-link to any tool via query parameter:

```
index.html?tool=code-generator
index.html?tool=balance-dashboard
index.html?tool=prompt-alchemy
```

The router resolves tool IDs from a static path map covering all 44 tools, with async fallback to the registry.

## Orchard Engine

Engine tools live under `tools/engine/*` and cover:

- player signup and orchard profile setup,
- farm initialization and growth calculators,
- daily/weekly/monthly progression loops,
- fair ranking and trust logic,
- commons collaboration tools,
- recruiter discovery and readiness scoring,
- four-direction planning and AI coaching,
- simulation and meta-health monitoring.

## Wave 1 simulation tools

Three tools validate that the Layer 1 (Farm) game loop is fair before expansion:

1. **Synthetic Player Generator** — `tools/engine/synthetic-player-generator/index.html`
   Generates test players across 6 archetypes with configurable mix and RNG seed.

2. **Wave 1 Simulation Runner** — `tools/engine/wave1-simulation-runner/index.html`
   Runs 30/60/90-day simulations with leaderboard, fairness notes, and exploit detection.

3. **Balance Dashboard** — `tools/engine/balance-dashboard/index.html`
   Analyzes simulation output and renders a BALANCED / MINOR ISSUES / REBALANCE NEEDED verdict.

**How to use:** Open each tool's `index.html` directly in a browser. Generate players first, then run simulations, then analyze balance. Tune and re-run until the verdict is BALANCED.

**Why Layer 2 and Layer 3 should wait:** Commons and Market layers depend on a proven fair Layer 1 loop. Validate Wave 1 first.


## Simba workflow expansion (new standalone tools)

Added eight additive standalone tools to improve Simba-driven repository improvement workflows:

- `idea-remixer` — generate idea variants (angle, audience, naming, positioning)
- `task-splitter` — convert high-level goals into executable subtasks
- `prompt-compare` — compare prompts for structure, clarity, and utility
- `repo-improvement-brief` — turn improvement ideas into implementation briefs
- `workflow-template-gallery` — reusable sequence templates for common execution flows
- `tool-search-discovery` — keyword/category discovery across the tool ecosystem
- `context-packager` — package mission context for downstream handoffs
- `output-evaluator` — score outputs for clarity, completeness, novelty, actionability

These tools are standalone HTML/CSS/JS apps with export/copy support and are registered for index discovery and deep-link routing. Category placement was chosen for least disruption: ideation in creators, planning/briefing in coders, evaluation/comparison in researchers, and orchestration/discovery/handoff in system.
These tools are standalone HTML/CSS/JS apps with export/copy support and are registered for index discovery and deep-link routing.

## Shared foundation

- `shared/tool-registry.js` — tool discovery and category mapping
- `shared/tool-bridge.js` — inter-tool context handoff
- `shared/tool-storage.js` — localStorage wrapper
- `shared/shared.css` — dark UI primitives
- `shared/engine-utils.js` — engine parsing/scoring
- `shared/engine-models.js` — engine calculation models
- `shared/simulation-utils.js` — Wave 1 simulation helpers
- `shared/engine-balance.js` — Wave 1 balance analysis

## Design philosophy

1. **Small tools win** — each tool solves one specific problem.
2. **Thinking over features** — the goal is structured thinking, not feature complexity.
3. **Fast to use** — most tools work in seconds.
4. **Clear outcomes** — every tool produces a useful output.

## Repository

- Source: https://github.com/via-decide/decide.engine-tools
- Live: https://via-decide.github.io/decide.engine-tools/

## Docs

- `ARCHITECTURE.md` — system architecture and file layout
- `ORCHARD_ENGINE_DESIGN.md` — Orchard Engine design and simulation goals
- `CONTRIBUTING.md` — contribution guidelines
- `AGENTS.md` — rules for coding agents

## ViaDecide

Layer 2 (Commons: seed exchange, fruit sharing, circles, peer validation, trust scoring) and Layer 3 (Market: recruiter dashboard, discovery search, hire readiness) depend on a proven fair Layer 1 loop. If spammers can dominate ranking or lazy players can accidentally promote, the trust and recruiter layers will inherit and amplify those imbalances. Validate Wave 1 first.

## Interactive ecosystem pages

The hub now includes two additive, standalone pages:

- `tool-graph.html` — visual graph explorer using `ToolRegistry` metadata and `relatedTools` edges.
- `workflow-builder.html` — drag/drop workflow composer that saves to localStorage and starts sequential tool runs.

These pages do not modify existing tools and keep preservation-first constraints intact.
This project is part of the ViaDecide ecosystem, focused on building tools and systems that improve how people think, decide, and execute — supporting **Bharat Vishwaguru 2030**.
