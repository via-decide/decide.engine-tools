Branch: simba/build-a-new-micro-frontend-named-visionpruner-th
Title: Build a new micro-frontend named 'VisionPruner' (The Vision API Token...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, browser-based image optimizer specifically tuned to reduce pixel dimensions and file size before passing visual payloads to expensive LLM Vision APIs.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.