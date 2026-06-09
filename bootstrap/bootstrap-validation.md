# Bootstrap Validation Specification

## Required Files
- `AGENTS.md`
- `.codex/instructions.md`
- `.codex/session.md`

## Validation States
- `BOOTSTRAP_READY`: all required files exist and session anchor parses.
- `BOOTSTRAP_PARTIAL`: at least one required file exists, but not all.
- `BOOTSTRAP_MISSING`: none of the required files exist.
- `SESSION_CORRUPTED`: required files exist, but `.codex/session.md` is malformed.
- `CONTINUITY_RECOVERED`: missing/corrupt session restored deterministically and revalidated.

## Deterministic Recovery Rules
1. Never disable validation checks.
2. If `.codex/session.md` is missing, generate a minimal stub with continuity metadata.
3. Do not overwrite an existing valid session anchor.
4. Persist recovery lineage artifacts under `bootstrap_recovery/`.
5. Re-run validation after recovery and emit final state.
