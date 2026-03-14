Branch: simba/add-toolsgamessnake-game-with-configjson-indexht
Title: add tools/games/snake-game/ with config.json index.html tool.js - van...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: playable snake game in browser, standalone

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.