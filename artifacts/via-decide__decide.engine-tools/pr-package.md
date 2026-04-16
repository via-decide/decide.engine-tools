Branch: simba/create-automated-engineering-review-engine
Title: Create automated engineering review engine.

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create automated engineering review engine.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.