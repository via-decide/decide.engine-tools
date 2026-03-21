Branch: simba/build-the-frame-accurate-cinema-metadata-tagger-
Title: Build the Frame-Accurate Cinema Metadata Tagger. 1. Create a video sc...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Enable pixel-perfect synchronization between cinematic video and interactive engine logic, farming dozens of precise timing-related commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.