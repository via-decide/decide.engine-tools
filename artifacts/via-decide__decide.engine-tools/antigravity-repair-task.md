Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement a stateful, tenant-aware Load Balancer called MtLoadBalancer to distribute gRPC streams across a cluster of engine nodes. 1. Create a new directory src/core/mt/balance/. 2. Implement MtLoadBalancer.ts. Use a "Consistent Hashing" algorithm to map tenant_id strings to specific backend worker nodes, ensuring that a tenant's long-lived streams prefer the same node for cache locality. 3. Create a NodeRegistry that tracks the health and current connection count of all active worker instances using a heartbeat mechanism (Redis or etcd). 4. Implement "Least-Connection" routing as a fallback. If the hashed node is over capacity, redirect the new Tunnel request to the least-burdened node in the cluster. 5. Build a "Graceful Drain" feature. When a node is marked for maintenance, the load balancer must stop sending new streams to it and slowly migrate existing tenants as their connections close. 6. Implement "Session Affinity" checks. If a trace_id is already active on Node X, ensure all subsequent packets for that specific execution chain are routed to the same instance.

RULES
1. Audit touched files first and identify regressions.
2. Preserve architecture and naming conventions.
3. Make minimal repairs only; do not expand scope.
4. Re-run checks and provide concise root-cause notes.
5. Return complete contents for changed files only.

SOP: REPAIR PROTOCOL (MANDATORY)
1. Strict Fix Only: Do not use repair mode to expand scope or add features.
2. Regression Check: Audit why previous attempt failed before proposing a fix.
3. Minimal Footprint: Only return contents for the actual repaired files.

REPO CONTEXT
- README snippet:
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g
- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
- package.json snippet:
not found