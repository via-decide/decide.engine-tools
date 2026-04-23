Branch: simba/add-unified-input-system-to-capture-user-interac
Title: Add unified input system to capture user interactions and map them to...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add unified input system to capture user interactions and map them to ECS-driven actions for gameplay control.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.