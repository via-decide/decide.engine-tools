Branch: simba/allow-users-to-create-notes-from-research-inside
Title: Allow users to create notes from research inside StudyOS.

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Allow users to create notes from research inside StudyOS.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.