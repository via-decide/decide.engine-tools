Branch: simba/implement-a-new-engine-tool-called-global-yield-
Title: Implement a new engine tool called global-yield-analytics. 1. Create ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a centralized visualization of the engine's "World State" that matches the bot's /market command data.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.