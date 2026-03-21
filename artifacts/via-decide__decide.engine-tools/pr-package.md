Branch: simba/develop-the-global-undoredo-state-manager-via-st
Title: Develop the Global Undo/Redo State Manager (via-state-manager). 1. Im...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a bulletproof safety net for your designers, breaking the complex memory-management and state logic down into dozens of micro-commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.