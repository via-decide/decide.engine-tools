Branch: simba/add-llm-action-parser-tool-in-toolsenginellm-act
Title: Add llm-action-parser tool in tools/engine/llm-action-parser/ with co...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working llm-action-parser tool that maps real-world effort to strict JSON engine stats
Branch: simba/add-genesis-seed-initializer-tool-in-toolsengine
Title: Add genesis-seed-initializer tool in tools/engine/genesis-seed-initia...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working genesis-seed-initializer tool to establish initial player state and environment

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.