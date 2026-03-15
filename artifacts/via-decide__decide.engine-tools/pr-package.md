Branch: simba/refactor-sharedtool-registryjs-define-a-standard
Title: Refactor shared/tool-registry.js. Define a standard schema for tools ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Establish a standardized registry of functions/tools that the AI agents can call during their workflow execution.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.