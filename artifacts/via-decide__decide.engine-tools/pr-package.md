Branch: simba/create-assetsjsstudyos-corejs-extract-appstore-s
Title: Create _assets/js/studyos-core.js. Extract AppStore, SystemData, and ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A centralized, event-driven state manager that handles all data persistence and broadcasts state changes to the rest of the OS.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.