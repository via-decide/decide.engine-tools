Branch: simba/create-tool-manifest-auto-generator
Title: Create tool manifest auto-generator.

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create tool manifest auto-generator.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.