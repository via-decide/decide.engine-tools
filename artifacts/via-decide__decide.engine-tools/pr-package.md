Branch: simba/add-json-formatter-tool-in-toolsjson-formatter-w
Title: add json-formatter tool in tools/json-formatter/ with config.json ind...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working json-formatter tool with PR
Branch: simba/add-regex-tester-tool-in-toolsregex-tester-with-
Title: add regex-tester tool in tools/regex-tester/ with config.json index.h...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working regex-tester tool with PR

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.