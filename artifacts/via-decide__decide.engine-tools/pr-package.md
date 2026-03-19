Branch: simba/add-a-new-standalone-tool-tetris-game-id-tetris-
Title: Add a new standalone tool "Tetris Game" (id: tetris-game) at tools/ga...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Produce working tetris-game tool with config.json, index.html, tool.js — registered in tool-registry.js and router.js, categorized under "games".

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.