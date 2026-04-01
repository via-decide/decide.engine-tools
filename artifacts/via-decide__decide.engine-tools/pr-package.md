Branch: simba/build-a-new-micro-frontend-named-validatorcore-t
Title: Build a new micro-frontend named 'ValidatorCore' (The Autonomous PR A...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a final verification layer that uses high-reasoning AI to cross-reference the generated code against the original multimodal input, ensuring the 'Synapse' and 'Vision' pipelines are working perfectly.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.