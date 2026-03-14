Branch: simba/add-toolscreatorssocial-content-generator-with-c
Title: add tools/creators/social-content-generator/ with config.json index.h...

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