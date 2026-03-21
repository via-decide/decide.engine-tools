Branch: simba/create-the-master-mixing-bus-automated-clipping-
Title: Create the Master Mixing Bus & Automated Clipping CI Bot (via-audio-m...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Guarantee a flawless, distortion-free audio mix while using the nightly CI/CD rendering bot to permanently sustain automated, high-value daily commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.