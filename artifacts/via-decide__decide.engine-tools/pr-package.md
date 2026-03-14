Branch: simba/add-a-new-standalone-tool-called-tetris-game-in-
Title: Add a new standalone tool called tetris-game in tools/games/tetris-ga...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Produce working tetris-game tool with config.json, index.html, tool.js, registered and routed.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.