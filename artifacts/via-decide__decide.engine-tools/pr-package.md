Branch: simba/build-a-new-micro-frontend-named-synapsesearch-t
Title: Build a new micro-frontend named 'SynapseSearch' (The Local RAG Query...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local semantic search engine that bridges the gap between the user's saved Vector Database and their active prompting workflow, allowing them to instantly recall and inject their own historical code patterns into new LLM queries.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.