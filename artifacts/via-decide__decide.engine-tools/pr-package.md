Branch: simba/implement-a-new-engine-tool-called-integrity-san
Title: Implement a new engine tool called integrity-sandbox-analyzer. 1. Cre...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a visual testing ground for the platform's backend integrity systems. This allows developers to simulate and debug how autonomous moderation agents evaluate, score, and filter incoming social data before it is allowed to be written to the main database.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.