Branch: simba/create-assetsjsstudyos-modulesjs-extract-studyen
Title: Create _assets/js/studyos-modules.js. Extract StudyEngine, Missions, ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A dedicated controller for the core study tools that strictly follows the reactive, event-driven rendering pattern.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.