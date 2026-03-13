# Architecture

## Preservation-first mesh

The repository uses an additive mesh architecture:

- legacy standalone tools remain runnable,
- modular tools remain standalone,
- new engine tools are added under `tools/engine`.

## Orchard engine layering

### Layer 1: Farm
Write-heavy player progression workflows:

- signup,
- farm generation,
- growth calculators,
- daily quest generation,
- weekly harvest,
- monthly promotion.

### Layer 2: Commons
Trust and collaboration:

- seed exchange,
- fruit sharing,
- circles,
- peer validation,
- trust scoring.

### Layer 3: Market
Read-heavy recruiter workflows:

- recruiter dashboard,
- discovery search,
- hire readiness scoring.

## Scalability orientation (100k players)

- separate read-heavy recruiter views from write-heavy gameplay loops,
- precompute leaderboard/profile summaries during timed jobs,
- run periodic jobs for weekly harvests, 15-day reviews, and 30-day promotions,
- keep AI coaching advisory and decoupled from ranking writes,
- keep simulations isolated from live player state.

## Shared components

- `tool-registry.js`: metadata-driven discovery across legacy/modular/engine tools.
- `tool-storage.js`: local persistence.
- `tool-bridge.js`: lightweight inter-tool context exchange.
- `engine-utils.js`: parsing/scoring utilities.
- `engine-models.js`: baseline engine calculations per mini-tool.

## Metadata contract

Each tool config supports:

- id
- name
- description
- category
- audience
- inputs
- outputs
- relatedTools
- entry
- tags

## Deferred scope

Final category router implementation remains deferred.
## 1) Preservation-first mesh architecture

The repo uses a mixed model:

- **Legacy standalone tools** remain in place and runnable as-is.
- **Modular tools** under `/tools` follow a normalized scaffold.
- **Shared adapters** under `/shared` provide discovery and interop hooks.

No forced rewrite is required for imported solo repos.

## 2) Shared layer

### `shared/tool-registry.js`
- Provides builtin metadata for legacy tools.
- Loads modular tool metadata from `/tools/*/config.json`.
- Exposes discovery helpers (`loadAll`, `findById`, compatibility getters).

### `shared/tool-bridge.js`
- Lightweight context handoff over localStorage.
- Supports send/receive/peek patterns for gradual interoperability.

### `shared/tool-storage.js`
- Minimal localStorage wrapper for per-tool persistence.

### `shared/shared.css`
- Optional shared dark style primitives for new/imported tools.

## 3) Tool metadata contract

Each tool `config.json` should be shaped like:

```json
{
  "id": "tool-id",
  "name": "Human Tool Name",
  "description": "What this tool does",
  "category": "creators",
  "audience": ["creators", "founders"],
  "inputs": ["idea", "context"],
  "outputs": ["structured_output"],
  "relatedTools": ["next-tool-id"],
  "entry": "tools/tool-id/index.html",
  "tags": ["mesh-ready", "standalone"]
}
```

## 4) Import model for solo repos

When importing a solo tool repo:

1. Copy tool folder without stripping functionality.
2. Add `config.json` metadata (or map it in registry as fallback).
3. Optionally wire bridge buttons for send/receive context.
4. Keep existing UI and logic intact.

## 5) Category-ready conventions

Future category routing will target metadata/folders like:

- `/tools/creators/`
- `/tools/gamers/`
- `/tools/coders/`
- `/tools/students/`
- `/tools/researchers/`

This phase does not implement final routing logic. It only ensures metadata and shared interfaces are ready.
