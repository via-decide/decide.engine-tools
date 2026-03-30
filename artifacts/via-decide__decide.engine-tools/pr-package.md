Branch: simba/create-branch-featurelogichub-gemini-integration
Title: Create branch feature/logichub-gemini-integration. Update tools/engin...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Make the architectural map actually "think" and generate usable code based on the node structure.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.