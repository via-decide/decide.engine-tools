Branch: simba/add-snake-game-tool-in-toolssnake-game-with-conf
Title: add snake-game tool in tools/snake-game/ with config.json index.html ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working snake-game tool with PR

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.