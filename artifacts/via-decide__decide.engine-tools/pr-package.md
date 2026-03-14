Branch: simba/add-tetris-game-tool-in-toolstetris-game-with-co
Title: add tetris-game tool in tools/tetris-game/ with config.json index.htm...
Branch: simba/add-memory-match-tool-in-toolsmemory-match-with-
Title: add memory-match tool in tools/memory-match/ with config.json index.h...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working memory-match tool with PR
Branch: simba/add-swot-analyzer-tool-in-toolsswot-analyzer-wit
Title: add swot-analyzer tool in tools/swot-analyzer/ with config.json index...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working tetris-game tool with PR

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.