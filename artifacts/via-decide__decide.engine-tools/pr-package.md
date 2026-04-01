Branch: simba/build-a-new-micro-frontend-named-vectorforge-the
Title: Build a new micro-frontend named 'VectorForge' (The Semantic Embeddin...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, browser-based utility to convert human-readable datasets into mathematical embeddings, creating the foundational Vector Database required for the user's Cognitive Twin RAG system.
Branch: simba/build-a-new-micro-frontend-named-neuroscriber-th
Title: Build a new micro-frontend named 'NeuroScriber' (The AI Auto-Annotati...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, automated pipeline to transform raw, unlabeled Git histories into a high-quality, reasoning-enriched "Golden Dataset" suitable for fine-tuning a Cognitive Twin LLM.
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