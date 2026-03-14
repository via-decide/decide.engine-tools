Branch: simba/add-a-new-standalone-tool-called-typing-speed-in
Title: Add a new standalone tool called typing-speed in tools/games/typing-s...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Produce working typing-speed tool with config.json, index.html, tool.js, registered and routed.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.