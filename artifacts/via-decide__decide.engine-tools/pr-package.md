Branch: simba/rewrite-toolsengineseed-exchangetooljs-to-add-hy
Title: rewrite tools/engine/seed-exchange/tool.js to add hydrateState() pull...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: seed-exchange syncs with orchard master state, emits exchange events, blocks zero-credit actions

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.