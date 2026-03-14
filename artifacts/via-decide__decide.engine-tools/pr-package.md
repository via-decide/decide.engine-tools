Branch: simba/add-flashcard-engine-tool-in-toolsflashcard-engi
Title: add flashcard-engine tool in tools/flashcard-engine/ with config.json...
Branch: simba/add-json-formatter-tool-in-toolsjson-formatter-w
Title: add json-formatter tool in tools/json-formatter/ with config.json ind...
Branch: simba/add-memory-match-tool-in-toolsmemory-match-with-
Title: add memory-match tool in tools/memory-match/ with config.json index.h...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working memory-match tool with PR
Branch: simba/add-swot-analyzer-tool-in-toolsswot-analyzer-wit
Title: add swot-analyzer tool in tools/swot-analyzer/ with config.json index...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working flashcard-engine tool with PR
- Goal: working swot-analyzer tool with PR

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.