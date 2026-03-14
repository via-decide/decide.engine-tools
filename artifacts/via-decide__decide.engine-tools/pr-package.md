Branch: simba/add-toolscreatorssocial-content-generator-with-c
Title: add tools/creators/social-content-generator/ with config.json index.h...
Branch: simba/add-toolsgamesresource-puzzle-with-configjson-in
Title: add tools/games/resource-puzzle/ with config.json index.html tool.js ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working puzzle game, standalone
Branch: simba/add-toolsgamesquiz-engine-with-configjson-indexh
Title: add tools/games/quiz-engine/ with config.json index.html tool.js - JS...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working quiz, standalone
Branch: simba/add-toolsgamestyping-speed-with-configjson-index
Title: add tools/games/typing-speed/ with config.json index.html tool.js - v...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: one input field, one Generate button, 7 labelled output cards each with copy button, all content platform-specific and ready to post

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.