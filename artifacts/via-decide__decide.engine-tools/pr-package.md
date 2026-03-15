Branch: simba/create-assetsjsstudyos-integrationsjs-extract-da
Title: Create _assets/js/studyos-integrations.js. Extract Dashboard (Chart.j...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: An isolated integrations file handling heavy visual computing and external APIs without bloating the main engine logic.
Branch: simba/create-assetsjsstudyos-modulesjs-extract-studyen
Title: Create _assets/js/studyos-modules.js. Extract StudyEngine, Missions, ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A dedicated controller for the core study tools that strictly follows the reactive, event-driven rendering pattern.
Branch: simba/create-assetsjsstudyos-onboardingjs-extract-dict
Title: Create _assets/js/studyos-onboarding.js. Extract Dictionary, UIUXMatr...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A decoupled onboarding controller that generates the workspace matrix and alerts the core system when setup is complete.
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