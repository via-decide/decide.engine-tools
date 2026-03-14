Branch: simba/add-toolsgamesresource-puzzle-with-configjson-in
Title: add tools/games/resource-puzzle/ with config.json index.html tool.js ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working puzzle game, standalone

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.