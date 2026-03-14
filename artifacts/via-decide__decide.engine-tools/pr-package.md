Branch: simba/add-growth-milestone-engine-tool-in-toolsengineg
Title: Add growth-milestone-engine tool in tools/engine/growth-milestone-eng...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working growth-milestone-engine tool that provides psychological feedback and state progression

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.