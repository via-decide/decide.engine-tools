# Repository Analysis (Batch 1)

_Date: 2026-03-30_

## Scope
This batch performs Phase 1 baseline analysis and establishes a reliable test workflow for environments where Playwright browser binaries are unavailable.

## Structure Overview
- Stack: vanilla HTML/CSS/JS with direct browser execution (no build step for tool runtime).
- Shared libraries exist in both `shared/` and `tools/shared/` paths, with router + test coverage expecting root-level `shared/` paths.
- `router.js` contains a static tool path map used by navigation and route resolution.
- Tests are Node-driven (`tests/unit/*`, `tests/smoke/*`, `tests/run-all.js`).

## Tool Inventory Snapshot
- Router-registered tools: **78** (validated by parsing `toolPathStaticMap` in `router.js`).
- Missing router targets on disk: **0**.
- Top-level directories under `tools/`: **36**.

## Dependency Snapshot
- Node.js >= 18.
- Dev dependencies:
  - `jsdom` for unit/integration style DOM tests.
  - `playwright` for smoke browser loading tests.

## Current Status (Batch 1)
- Unit tests: passing.
- Smoke tests: functionally valid but originally hard-failed when Playwright browser executable was not installed.
- Full `npm test`: originally failed in constrained environments due to missing Playwright browser runtime download availability.

## Risks Identified
1. CI/air-gapped test environments can fail the entire pipeline despite healthy code because smoke browser binaries are absent.
2. Lack of explicit skip-path for smoke tests produced false-negative release gates.
3. Documentation for this failure mode was not centralized.

## Batch 1 Outcome Target
- Keep smoke tests strict when browser runtime exists.
- Skip smoke tests gracefully (with warnings) only when Playwright reports missing browser executable.
- Preserve hard failure behavior for actual smoke regressions.


## Additional Finding (Option A follow-up)
- Service worker (`sw.js`) was syntactically invalid due to duplicated malformed blocks and required repair before broader tool-level runtime validation.
