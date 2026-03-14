Branch: simba/add-resource-optimization-puzzle-tool-in-toolsen
Title: Add resource-optimization-puzzle tool in tools/engine/resource-optimi...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working resource-optimization-puzzle tool that tests spatial and resource management skills

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.