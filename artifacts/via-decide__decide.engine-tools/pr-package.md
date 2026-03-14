Branch: simba/create-assetsjsengine-busjs-this-is-the-central-
Title: Create _assets/js/engine-bus.js. This is the central wiring hub. Crea...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working standardized event bus that makes it perfectly clear for AI how to wire backend tools to the UI

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.