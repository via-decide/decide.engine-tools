Branch: simba/create-assetsjsstudyos-integrationsjs-extract-da
Title: Create _assets/js/studyos-integrations.js. Extract Dashboard (Chart.j...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: An isolated integrations file handling heavy visual computing and external APIs without bloating the main engine logic.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.