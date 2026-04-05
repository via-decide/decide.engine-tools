Branch: simba/add-token-usage-monitoring-during-load-tests
Title: Add token usage monitoring during load tests.

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: verify context-refinery efficiency above 80%

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.