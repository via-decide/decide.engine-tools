Branch: simba/implement-the-asset-webhook-cache-invalidator-da
Title: Implement the Asset Webhook & Cache Invalidator Daemon (via-asset-web...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Ensure the website always serves the absolute latest game assets without manual intervention, driving granular commits through network layer testing.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.