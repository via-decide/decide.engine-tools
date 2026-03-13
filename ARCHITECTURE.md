# Architecture

## Preservation-first architecture

This repository follows additive evolution:

- keep existing tools runnable,
- add new tools under dedicated folders,
- avoid destructive rewrites,
- use shared adapters for gradual interoperability.

## Orchard Engine Wave 1 (Layer 1 — Farm)

Wave 1 is intentionally limited to farm progression mechanics:

- player onboarding (`player-signup`),
- orchard profile structure (`orchard-profile-builder`),
- starter state generation (`starter-farm-generator`),
- root/trunk growth scoring,
- fruit output conversion,
- daily quest generation,
- weekly cycle scoring,
- 30-day promotion eligibility,
- fair ranking with anti-spam controls.

## Shared modules

- `engine-utils.js`: parsing, scoring helpers, copy/download utility.
- `engine-models.js`: deterministic Wave 1 formulas and defaults.
- `tool-storage.js`: lightweight local persistence.
- `tool-registry.js`: metadata-driven discovery.
- `tool-bridge.js`: context handoff hooks (not required for Wave 1 loop).

## Scalability direction

Wave 1 stays local and standalone but aligns with future scale via:

- deterministic scoring formulas,
- summary-friendly output objects,
- anti-spam/anti-volume guards,
- clean separation between engine computations and UI.

Future scale path (deferred):

- read/write separation,
- periodic jobs for weekly and 30-day cycles,
- precomputed summaries,
- decoupled advisory AI.

## Deferred scope

Not implemented in this wave:

- commons collaboration loops,
- recruiter market surfaces,
- category-aware routing.
