Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement a high-throughput, non-blocking MetricsCollector to monitor MT protocol performance and tenant resource consumption. 1. Create a new directory src/core/mt/telemetry/. 2. Implement MetricsCollector.ts. This module must hook into the MtRouter and SecurityInterceptor using an event-driven observer pattern. 3. Create "Throughput Counters" to track total Messages Per Second (MPS) and Transactions Per Second (TPS) per tenant_id. 4. Implement "Latency Histograms" to measure the round-trip time (RTT) from ToolRequest to ToolResponse for every priority level (LOW, HIGH, CRITICAL). 5. Build a "Payload Size Monitor" to track the byte-size of MtEnvelope objects, alerting if a specific tenant is sending anomalously large packets that might saturate the network. 6. Implement "Error Rate Tracking" categorized by MtError codes (e.g., auth failures vs. tool timeouts). 7. Expose a Prometheus-compatible /metrics endpoint or push the data to a time-series backend (like InfluxDB or Graphite) every 5 seconds.

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