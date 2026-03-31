Branch: simba/build-a-new-micro-frontend-named-datamasker-the-
Title: Build a new micro-frontend named 'DataMasker' (The PII & Secrets Scru...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local security and optimization utility to instantly sanitize logs, code, and JSON of sensitive PII and heavy cryptographic tokens before pasting them into LLMs.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.