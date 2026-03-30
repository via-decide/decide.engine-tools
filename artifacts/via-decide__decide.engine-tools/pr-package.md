Branch: simba/create-branch-featurelogichub-dual-export-update
Title: Create branch feature/logichub-dual-export. Update tools/engine/logic...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide users with tangible, highly useful artifacts resulting from their architectural planning.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.