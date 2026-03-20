Branch: simba/implement-a-high-throughput-non-blocking-metrics
Title: Implement a high-throughput, non-blocking MetricsCollector to monitor...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Achieve total observability. By collecting granular data at the protocol level, you can generate per-tenant billing reports, identify performance bottlenecks in specific tools, and detect DDoS attacks or rogue agents in real-time.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.