Branch: simba/add-seed-quality-scorer-tool-in-toolsengineseed-
Title: Add seed-quality-scorer tool in tools/engine/seed-quality-scorer/ wit...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working seed-quality-scorer tool that evaluates and scores knowledge contributions

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.