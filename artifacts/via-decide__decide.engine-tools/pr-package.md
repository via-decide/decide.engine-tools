Branch: simba/add-deterministic-scheduler-to-enforce-consisten
Title: Add deterministic scheduler to enforce consistent execution order acr...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add deterministic scheduler to enforce consistent execution order across runs, even with parallel execution enabled.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.