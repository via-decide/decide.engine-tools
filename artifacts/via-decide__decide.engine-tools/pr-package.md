Branch: simba/create-the-headless-cutscene-validator-ci-bot-vi
Title: Create the Headless Cutscene Validator CI Bot (via-cutscene-check). 1...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Ensure the game's story moments never break during production, while permanently sustaining daily automated commits via the reporting bot.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.