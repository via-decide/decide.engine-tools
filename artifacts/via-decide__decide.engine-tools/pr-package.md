Branch: simba/build-the-wasmc-crash-dump-symbolicator-via-cras
Title: Build the WASM/C++ Crash Dump Symbolicator (via-crash-decode). 1. Cre...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Turn catastrophic web player crashes into easily readable bug reports, farming highly technical compiler-level commits in the process.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.