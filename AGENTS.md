# AGENTS.md — repository rules

Scope: entire repository.

## Mission

Treat this repo as a preservation-first staging mesh and Orchard Engine build system.

## Non-destructive requirements

- Never delete unrelated files or folders.
- Never reduce existing tool capability to fit architecture preferences.
- Never replace real tools with placeholders.
- If migration is incomplete, wrap with metadata and adapters while preserving original behavior.

## Workflow requirements

1. Audit before editing.
2. Identify user-facing tools and preserve behavior.
3. Prefer additive changes in shared utilities and metadata.
4. Keep standalone HTML tools working locally where possible.
5. Build new engine tools additively under `tools/engine`.
6. Return complete contents of edited files when requested.

## Interop strategy

- Use lightweight registry, storage, and bridge utilities.
- Keep compatibility with legacy and imported tools.
- Preserve backward-compatible shared APIs.

## Orchard-specific rules

- Preserve three-layer model: Farm, Commons, Market.
- Preserve metaphor mapping in UI where practical (roots, trunk, fruits, seeds, water, minerals, soil, sunlight).
- Keep ranking and promotions merit-based (no pay-to-win logic).
- Keep AI advisory decoupled from critical game-state loops.

## Output discipline

- Do not omit touched files.
- Do not use destructive rewrites for unrelated tools.
- Prefer modular, readable vanilla HTML/CSS/JS.
