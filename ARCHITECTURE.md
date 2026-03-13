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
