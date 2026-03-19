Branch: simba/add-a-new-standalone-tool-snake-game-id-snake-ga
Title: Add a new standalone tool "Snake Game" (id: snake-game) at tools/game...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Produce working snake-game tool with config.json, index.html, tool.js — registered in tool-registry.js and router.js, categorized under "games".

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.