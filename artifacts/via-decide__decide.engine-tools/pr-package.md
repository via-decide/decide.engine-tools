Branch: simba/implement-the-wasm-web-player-packager-via-wasm-
Title: Implement the WASM Web Player Packager (via-wasm-wrap). 1. Create a p...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create the literal bridge that allows the engine to run on the website, structured to generate dozens of commits during the wrapper's construction.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.