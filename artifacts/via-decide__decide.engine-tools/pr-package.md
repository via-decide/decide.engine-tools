Branch: simba/create-the-event-schema-registryjson-as-the-ulti
Title: Create the event-schema-registry.json as the ultimate reference contr...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a strict "compiler-like" error interface. If the AI hallucinates a payload structure, the validator instantly catches it and tells the AI exactly which field was wrong.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.