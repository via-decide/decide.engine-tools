Branch: simba/add-knowledge-quiz-challenge-tool-in-toolsengine
Title: Add knowledge-quiz-challenge tool in tools/engine/knowledge-quiz-chal...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working knowledge-quiz-challenge tool that provides an interactive trivia mini-game

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.