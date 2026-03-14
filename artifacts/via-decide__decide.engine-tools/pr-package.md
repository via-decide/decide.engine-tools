Branch: simba/improve-repository-via-decidedecideengine-tools
Title: Improve repository via-decide/decide.engine-tools

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Improve via-decide/decide.engine-tools via Simba pipeline

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.