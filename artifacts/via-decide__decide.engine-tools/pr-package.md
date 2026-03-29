Branch: simba/enforce-a-unified-diff-output-protocol-for-the-g
Title: Enforce a Unified Diff output protocol for the Genesis Compiler / AI ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Reduce output token costs by 95% on iterative updates. If a file is 500 lines, modifying a button should only cost 20 output tokens, not 520 tokens.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.