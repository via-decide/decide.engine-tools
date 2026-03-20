Branch: simba/implement-a-stateful-tenant-aware-load-balancer-
Title: Implement a stateful, tenant-aware Load Balancer called MtLoadBalance...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Enable infinite horizontal scaling. By implementing a tenant-aware load balancer, the engine can grow from a single server to a global cluster, distributing the compute-heavy AI tool executions evenly across your infrastructure.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.