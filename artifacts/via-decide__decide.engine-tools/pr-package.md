Branch: simba/create-employer-job-board-tool-in-toolsengineemp
Title: Create employer-job-board tool in tools/engine/employer-job-board/ wi...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working employer-job-board tool linking market demand to player capabilities

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.