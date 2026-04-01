Branch: simba/build-a-new-micro-frontend-named-promptmatrix-th
Title: Build a new micro-frontend named 'PromptMatrix' (The XML Metaprompt C...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, visual prompt-assembly workstation that generates strict, XML-structured system prompts, completely eliminating manual tagging errors and drastically reducing LLM hallucinations in production agents.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.