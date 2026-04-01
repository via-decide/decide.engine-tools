Branch: simba/build-a-new-micro-frontend-named-twinterminal-th
Title: Build a new micro-frontend named 'TwinTerminal' (The Cognitive RAG Ch...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a fully functional, edge-hosted AI chat interface that uses local vector math to augment the LLM's knowledge with the user's proprietary Git history, creating a true Cognitive Twin experience.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.