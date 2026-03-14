Branch: simba/add-flashcard-engine-tool-in-toolsflashcard-engi
Title: add flashcard-engine tool in tools/flashcard-engine/ with config.json...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working flashcard-engine tool with PR

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.