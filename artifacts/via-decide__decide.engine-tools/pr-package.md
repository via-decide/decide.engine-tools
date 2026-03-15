Branch: simba/create-a-new-branch-featureux-achievement-toasts
Title: > Create a new branch feature/ux-achievement-toasts. Create a file sh...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: > A non-intrusive, highly rewarding way to notify the user of successes, background agent completions, and system states. /end_task

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.