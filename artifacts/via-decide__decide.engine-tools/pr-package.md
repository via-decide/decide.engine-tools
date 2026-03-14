Branch: simba/rewrite-toolsengineseed-exchangetooljs-only---re
Title: rewrite tools/engine/seed-exchange/tool.js only - replace generic stu...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: seed-exchange syncs orchard state and blocks zero-credit actions; no shared file changes

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.