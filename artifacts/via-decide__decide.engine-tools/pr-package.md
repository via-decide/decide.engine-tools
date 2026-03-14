Branch: simba/create-toolsengineskin-selector-ui-build-a-playe
Title: Create tools/engine/skin-selector-ui/. Build a player-facing gallery ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: An interactive gallery where players can preview, purchase, and equip different thematic skins.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.