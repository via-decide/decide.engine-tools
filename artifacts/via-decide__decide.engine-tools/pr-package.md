Branch: simba/create-decision-replay-engine
Title: Create decision replay engine.

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create decision replay engine.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.