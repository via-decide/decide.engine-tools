# AGENTS.md — repository rules

Scope: entire repository.

## Mission

Treat this repo as a preservation-first staging mesh and Orchard Engine build system.
Treat this repo as a preservation-first staging mesh for many standalone tool repos.

## Non-destructive requirements

- Never delete unrelated files or folders.
- Never reduce existing tool capability to fit architecture preferences.
- Never replace real tools with placeholders.
- If migration is incomplete, wrap with metadata and adapters while preserving original behavior.
- Never reduce existing tool capability to fit new architecture.
- Never replace real tools with placeholders.
- If migration is incomplete, wrap with metadata/adapters and preserve original code.

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
4. Keep standalone HTML tools runnable with no build step when possible.
5. Prepare for future category routing without implementing final routing unless requested.

## Interop strategy

- Use lightweight registry and bridge utilities.
- Allow gradual adoption across legacy and imported tools.
- Preserve backward compatibility when modifying shared APIs.

## Output discipline for agents

- Return complete contents for every modified/created file when requested.
- Do not omit touched files.
- Do not cut unrelated code.

---

## Wave 1 Simulation Rules (additive)

### Preservation rules for simulation tools

1. The original `tools/engine/simulation-runner/` is a separate tool and must not be overwritten or deleted. The Wave 1 simulation runner lives at `tools/engine/wave1-simulation-runner/`.
2. Shared simulation helpers (`shared/simulation-utils.js`, `shared/engine-balance.js`) must not modify or replace existing shared files (`engine-utils.js`, `engine-models.js`, `tool-storage.js`, `tool-bridge.js`, `tool-registry.js`).
3. New simulation tools must be self-contained and runnable from their own `index.html`.

### Strict repo rules for future agents

- **Preserve unrelated functionality**: never delete or rewrite tools outside the scope of your task.
- **Avoid destructive rewrites**: if a file exists and works, do not replace it with a shell or placeholder.
- **Prefer additive changes**: create new files/folders instead of modifying existing ones.
- **Keep standalone tools working**: every `index.html` must remain openable in a browser with no build step.
- **Do not delete old folders**: even if they seem redundant, they may be referenced elsewhere.
- **Validate before expanding**: Layer 2 and Layer 3 tools should not be implemented until Wave 1 simulation passes with a BALANCED verdict.
- **Document what you add**: update ARCHITECTURE.md and README.md when adding new tools.
