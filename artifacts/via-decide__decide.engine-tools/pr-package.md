Branch: simba/create-assetsjsstudyos-onboardingjs-extract-dict
Title: Create _assets/js/studyos-onboarding.js. Extract Dictionary, UIUXMatr...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A decoupled onboarding controller that generates the workspace matrix and alerts the core system when setup is complete.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.