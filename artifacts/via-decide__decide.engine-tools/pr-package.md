Branch: simba/build-a-new-micro-frontend-named-contextweaver-t
Title: Build a new micro-frontend named 'ContextWeaver' (The Multi-File Prom...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local developer utility to instantly convert multi-file codebases into structured, LLM-ready system prompts without manual copy-pasting, drastically speeding up the AI debugging workflow.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.