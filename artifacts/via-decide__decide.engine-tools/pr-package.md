Branch: simba/create-toolsengineskin-street-food-config-build-
Title: Create tools/engine/skin-street-food-config/. Build a standalone JSON...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A backend definition file that formally registers the Indian Street Food Cart terminology into the engine's skin registry.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.