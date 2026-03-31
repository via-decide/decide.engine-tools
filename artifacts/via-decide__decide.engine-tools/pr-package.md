Branch: simba/build-a-new-micro-frontend-named-jsoncore-the-st
Title: Build a new micro-frontend named 'JSONCore' (The Strict-Schema Prompt...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a visual tool to generate iron-clad system prompts that force LLMs to return perfectly structured, application-ready JSON without markdown wrappers or hallucinations.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.