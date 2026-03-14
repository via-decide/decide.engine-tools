Branch: simba/review-repair-validate-and-push-the-new-standalo
Title: review, repair, validate, and push the new standalone tool batch safely

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: verify the 8 new tools, fix integration issues, validate router/index/registry/README, and push corrected files

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.