Branch: simba/build-daxinikernel-the-central-operating-logic-t
Title: Build 'DaxiniKernel'-the central operating logic that unifies all Dax...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Finalize the infrastructure of the world-record attempt by creating a central brain that ensures all 24,000 PRs are generated, validated, and merged as a single, unstoppable system.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.