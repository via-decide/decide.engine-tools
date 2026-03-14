Branch: simba/add-employer-job-posting-tool-in-toolsengineempl
Title: Add employer-job-posting tool in tools/engine/employer-job-posting/ w...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working employer-job-posting tool that allows creation and management of market listings

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.