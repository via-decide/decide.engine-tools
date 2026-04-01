Branch: simba/build-daxiniscribe-the-dynamic-pr-documentation-
Title: Build 'DaxiniScribe'-the dynamic PR documentation and reporting engin...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Elevate the quality of every single PR in the 24,000-unit run, ensuring they are documented to professional open-source standards and are resilient against 'spam' flagging.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.