Branch: simba/create-branch-featurelogichub-core-ui-create-a-n
Title: Create branch feature/logichub-core-ui. Create a new directory tools/...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A seamless visual editor embedded directly into the OS where users can map out app architectures.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.