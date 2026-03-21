Branch: simba/build-the-cross-platform-input-action-mapper-via
Title: Build the Cross-Platform Input Action Mapper (via-input-mapper). 1. C...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Ensure players have exactly the same control scheme whether playing native or on the web, farming complex code-generation commits in the process.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.