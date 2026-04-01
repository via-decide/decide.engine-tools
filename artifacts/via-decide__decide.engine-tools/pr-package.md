Branch: simba/build-a-new-micro-frontend-named-dataforge-the-s
Title: Build a new micro-frontend named 'DataForge' (The Synthetic Payload E...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local utility to instantly generate massive, highly realistic JSON/CSV test datasets for UI prototyping and database seeding, eliminating the manual labor of writing mock data.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.