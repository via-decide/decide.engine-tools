Branch: simba/create-retention-funnel-tracker-tool-in-toolseng
Title: Create retention-funnel-tracker tool in tools/engine/retention-funnel...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working retention-funnel-tracker tool to analyze player lifecycle bottlenecks

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.