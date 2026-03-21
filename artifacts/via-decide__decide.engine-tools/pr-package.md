Branch: simba/build-the-inter-tool-message-bus-via-core-bus-1-
Title: Build the Inter-Tool Message Bus (via-core-bus). 1. Create a high-per...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Unify the entire engine toolchain into a single cohesive app, farming deep networking and architecture commits in the process.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.