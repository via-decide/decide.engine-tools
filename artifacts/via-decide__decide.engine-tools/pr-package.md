Branch: simba/add-abuse-detection-dashboard-tool-in-toolsengin
Title: Add abuse-detection-dashboard tool in tools/engine/abuse-detection-da...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working abuse-detection-dashboard tool that highlights potential rule-breaking behavior

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.