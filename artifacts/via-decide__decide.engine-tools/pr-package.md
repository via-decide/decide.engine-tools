Branch: simba/build-a-new-micro-frontend-named-chronominer-the
Title: Build a new micro-frontend named 'ChronoMiner' (The Git-to-LLM Memory...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a secure, local, browser-based utility to scrape thousands of Git commits and format them into structured JSONL datasets for fine-tuning or RAG ingestion, acting as the primary data-pipeline for the Daxini Cognitive Twin.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.