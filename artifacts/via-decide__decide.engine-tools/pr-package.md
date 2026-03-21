Branch: simba/create-the-visual-diff-git-integration-bridge-vi
Title: Create the Visual Diff & Git Integration Bridge (via-git-visualizer)....

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Make version control intuitive for artists and designers, while padding the commit graph with deep data-parsing and tree-comparison logic.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.