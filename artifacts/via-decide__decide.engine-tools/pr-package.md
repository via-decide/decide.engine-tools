Branch: simba/build-the-web-asset-cdn-packager-via-cdn-deploy-
Title: Build the Web Asset CDN Packager (via-cdn-deploy). 1. Create a CLI to...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Enable lightning-fast game loading on viadecide.com via streaming, while farming granular unit-test commits for the file-hashing logic.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.