Branch: simba/create-the-web-based-ui-layout-pre-viewer-via-hu
Title: Create the Web-Based UI Layout Pre-viewer (via-hud-preview). 1. Build...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Give your UI designers instant visual feedback in the browser without launching the full heavy C++ engine, driving granular UI logic commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.