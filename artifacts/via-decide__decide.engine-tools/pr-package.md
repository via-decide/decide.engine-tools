Branch: simba/build-a-new-micro-frontend-named-airforge-the-ag
Title: Build a new micro-frontend named 'AIRForge' (The Agent Function Regis...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, visual builder that allows users to rapidly wrap raw Vanilla JS functions into LLM-compatible tool schemas, upgrading their agents from passive text-generators to active, executing programs.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.