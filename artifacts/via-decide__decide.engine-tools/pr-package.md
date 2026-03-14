Branch: simba/add-color-palette-generator-tool-in-toolscolor-p
Title: add color-palette-generator tool in tools/color-palette-generator/ wi...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working color-palette-generator tool with PR

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.