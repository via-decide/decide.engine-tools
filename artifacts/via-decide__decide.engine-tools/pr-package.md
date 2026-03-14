Branch: simba/create-toolsengineskin-pack-manager-build-a-head
Title: Create tools/engine/skin-pack-manager/. Build a headless Vanilla JS u...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A backend state manager that securely handles the unlocking and ownership verification of cosmetic skin packs.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.