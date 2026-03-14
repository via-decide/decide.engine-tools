Branch: simba/create-seed-quality-scorer-tool-in-toolsenginese
Title: Create seed-quality-scorer tool in tools/engine/seed-quality-scorer/ ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working seed-quality-scorer tool that grades shared knowledge based on community impact

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.