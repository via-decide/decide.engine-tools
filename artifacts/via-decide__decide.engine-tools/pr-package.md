Branch: simba/build-a-new-micro-frontend-named-neuroscriber-th
Title: Build a new micro-frontend named 'NeuroScriber' (The AI Auto-Annotati...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, automated pipeline to transform raw, unlabeled Git histories into a high-quality, reasoning-enriched "Golden Dataset" suitable for fine-tuning a Cognitive Twin LLM.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.