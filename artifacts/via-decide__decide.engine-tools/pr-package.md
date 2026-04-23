Branch: simba/add-node-level-retry-isolation-and-partial-execu
Title: Add node-level retry isolation and partial execution recovery to prev...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add node-level retry isolation and partial execution recovery to prevent full graph failure from individual node errors.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.