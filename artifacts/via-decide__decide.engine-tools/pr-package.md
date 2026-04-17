Branch: simba/document-the-development-workflow-used-in-this-r
Title: Document the development workflow used in this repository.

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Document the development workflow used in this repository.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.