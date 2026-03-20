You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Implement a stateful, tenant-aware Load Balancer called MtLoadBalancer to distribute gRPC streams across a cluster of engine nodes. 1. Create a new directory src/core/mt/balance/. 2. Implement MtLoadBalancer.ts. Use a "Consistent Hashing" algorithm to map tenant_id strings to specific backend worker nodes, ensuring that a tenant's long-lived streams prefer the same node for cache locality. 3. Create a NodeRegistry that tracks the health and current connection count of all active worker instances using a heartbeat mechanism (Redis or etcd). 4. Implement "Least-Connection" routing as a fallback. If the hashed node is over capacity, redirect the new Tunnel request to the least-burdened node in the cluster. 5. Build a "Graceful Drain" feature. When a node is marked for maintenance, the load balancer must stop sending new streams to it and slowly migrate existing tenants as their connections close. 6. Implement "Session Affinity" checks. If a trace_id is already active on Node X, ensure all subsequent packets for that specific execution chain are routed to the same instance.

CONSTRAINTS
The load balancer must handle the stateful nature of bidirectional gRPC streams. Strictly maintain the case-sensitive repository name: decide.engine-tools. Minimize re-hashing "chur" when nodes join or leave the cluster to prevent massive disconnect storms.

PROCESS (MANDATORY)
1. Read README.md and AGENTS.md before editing.
2. Audit architecture before coding. Summarize current behavior.
3. Preserve unrelated working code. Prefer additive modular changes.
4. Implement the smallest safe change set for the stated goal.
5. Run validation commands and fix discovered issues.
6. Self-review for regressions, missing env wiring, and docs drift.
7. Return complete final file contents for every modified or created file.

REPO AUDIT CONTEXT
- Description: 
- Primary language: HTML
- README snippet:
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g

- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
ENGINE-TOOLS ARCHITECTURE (mandatory compliance)
Tool directory: tools/<tool>/
Required files: config.json, index.html, tool.js
Shared dependencies to import: shared/tool-storage.js, shared/shared.css
config.json must include: id, name, description, category, audience, inputs, outputs, tags
Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js
Do NOT modify any existing tool folder or shared utility file.
Do NOT use external frameworks, CDN packages, or bundlers.

SOP: PRE-MODIFICATION PROTOCOL (MANDATORY)
1. Adherence to Instructions: No deviations without explicit user approval.
2. Mandatory Clarification: Immediately ask if instructions are ambiguous or incomplete.
3. Proposal First: Always propose optimizations or fixes before implementing them.
4. Scope Discipline: Do not add unrequested features or modify unrelated code.
5. Vulnerability Check: Immediately flag and explain security risks.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.