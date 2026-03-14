Branch: simba/add-toolsgamestyping-speed-with-configjson-index
Title: add tools/games/typing-speed/ with config.json index.html tool.js - v...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working typing test, standalone

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.