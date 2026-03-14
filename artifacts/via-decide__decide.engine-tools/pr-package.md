Branch: simba/create-toolsengineupsc-current-affairs-build-a-v
Title: Create tools/engine/upsc-current-affairs/. Build a Vanilla JS RSS fee...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: An automated daily news aggregator that turns Current Affairs reading directly into actionable OS missions.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.