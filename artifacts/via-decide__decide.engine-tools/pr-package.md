Branch: simba/implement-a-new-engine-tool-called-system-teleme
Title: Implement a new engine tool called system-telemetry-dashboard to moni...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Give platform administrators a bird's-eye view of the entire ViaDecide ecosystem's performance. This dashboard is critical for observing how autonomous agents are behaving in production and identifying scaling bottlenecks before they impact end-users.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.