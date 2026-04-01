Branch: simba/build-a-new-micro-frontend-named-chunkforge-the-
Title: Build a new micro-frontend named 'ChunkForge' (The Semantic Text Spli...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, browser-based text processing utility that prepares massive unstructured documents for Vector Database ingestion by slicing them into overlapping, semantically intact chunks.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.