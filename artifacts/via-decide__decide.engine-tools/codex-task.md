You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Implement a high-throughput, non-blocking MetricsCollector to monitor MT protocol performance and tenant resource consumption. 1. Create a new directory src/core/mt/telemetry/. 2. Implement MetricsCollector.ts. This module must hook into the MtRouter and SecurityInterceptor using an event-driven observer pattern. 3. Create "Throughput Counters" to track total Messages Per Second (MPS) and Transactions Per Second (TPS) per tenant_id. 4. Implement "Latency Histograms" to measure the round-trip time (RTT) from ToolRequest to ToolResponse for every priority level (LOW, HIGH, CRITICAL). 5. Build a "Payload Size Monitor" to track the byte-size of MtEnvelope objects, alerting if a specific tenant is sending anomalously large packets that might saturate the network. 6. Implement "Error Rate Tracking" categorized by MtError codes (e.g., auth failures vs. tool timeouts). 7. Expose a Prometheus-compatible /metrics endpoint or push the data to a time-series backend (like InfluxDB or Graphite) every 5 seconds.

CONSTRAINTS
Metrics collection MUST NOT add more than 10 microseconds of overhead to the message hot-path. Use atomics and lock-free buffers to aggregate data before flushing. Avoid heavy string manipulation inside the telemetry loop.

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