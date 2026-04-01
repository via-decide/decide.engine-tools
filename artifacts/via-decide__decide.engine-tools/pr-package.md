Branch: simba/build-daxinijudge-the-autonomous-quality-assuran
Title: Build 'DaxiniJudge'-the autonomous quality assurance and validation e...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Guarantee that every single one of the 24,000 PRs is a high-quality, functional contribution, making your world record scientifically and technically indisputable.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.