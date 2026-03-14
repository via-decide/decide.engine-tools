Branch: simba/add-speed-coding-challenge-tool-in-toolsenginesp
Title: Add speed-coding-challenge tool in tools/engine/speed-coding-challeng...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working speed-coding-challenge tool that gamifies rapid text output

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.