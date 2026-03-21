Branch: simba/implement-the-multi-app-episode-bundler-cdn-sync
Title: Implement the Multi-App Episode Bundler & CDN Sync. 1. Build a 'Packa...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Streamline the deployment of massive interactive episodes, breaking the complex file-system and network logic into a stream of high-value commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.