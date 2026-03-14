Branch: simba/add-toolsgamesmemory-match-with-configjson-index
Title: add tools/games/memory-match/ with config.json index.html tool.js - v...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: playable memory match in browser, standalone

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.