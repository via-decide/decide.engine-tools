Branch: simba/add-candidate-comparison-view-tool-in-toolsengin
Title: Add candidate-comparison-view tool in tools/engine/candidate-comparis...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working candidate-comparison-view tool that helps market participants evaluate multiple players

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.