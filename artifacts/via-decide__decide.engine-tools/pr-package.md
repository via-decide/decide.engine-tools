Branch: simba/rewrite-toolsenginedaily-quest-generatortooljs-t
Title: rewrite tools/engine/daily-quest-generator/tool.js to add hydrateStat...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: daily-quest-generator syncs with orchard master state and emits quest events

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.