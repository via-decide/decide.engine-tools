Branch: simba/create-candidate-comparison-view-tool-in-toolsen
Title: Create candidate-comparison-view tool in tools/engine/candidate-compa...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working candidate-comparison-view tool for market layer recruiter analysis

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.