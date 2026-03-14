Branch: simba/add-toolsgamesquiz-engine-with-configjson-indexh
Title: add tools/games/quiz-engine/ with config.json index.html tool.js - JS...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working quiz, standalone

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.