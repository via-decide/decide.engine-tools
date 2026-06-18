# Agents Control Specification

## 1) Definition
An **agent** is a lifecycle-bound engine module that executes only under runtime authority.
An agent is not a free-running process and is never an execution owner.
Required lifecycle phases are: **init → update → shutdown**.

## 2) Agent Model (Required Contract)
Every agent definition must include the following fields before registration:

- **name**: stable unique identifier within the active runtime context.
- **role**: explicit functional responsibility (single primary responsibility).
- **inputs**: declared inbound data channels and their expected shape.
- **outputs**: declared outbound data channels and their expected shape.
- **state**: private local state schema owned by the agent.
- **hooks**: lifecycle hooks `init`, `update`, and `shutdown`.

Registration is invalid if any required field is missing.

## 3) Agent Types

### A. System Agents (Core Runtime)
Own runtime support concerns such as scheduling, coordination, and execution envelope handling.

### B. Logic Agents (Processing)
Transform inputs into deterministic outputs using defined engine rules.

### C. Integration Agents (External I/O)
Handle boundary interactions (storage/network/provider interfaces) through engine-controlled interfaces.

### D. Observer Agents (Logs/Metrics)
Produce telemetry artifacts and execution observations without mutating business state.

## 4) Execution Rules
1. Agents execute only inside the runtime loop.
2. Agent execution entry is runtime-dispatched; out-of-band invocation is prohibited.
3. Direct agent-to-agent calls are prohibited.
4. Inter-agent interaction must route through engine-owned coordination channels.
5. Update order must be deterministic and repeatable for identical inputs/state.
6. Runtime must reject registrations that would create non-deterministic ordering.

## 5) State Rules
1. Agent state is local to the owning agent.
2. Hidden globals and ambient mutable state are prohibited.
3. Inputs and outputs must be explicit and declared.
4. State transitions must be attributable to lifecycle hook execution.
5. Shared mutable objects across agents are prohibited unless mediated by engine-managed state interfaces.

## 6) Failure Behavior
1. Agents must fail explicitly with structured error signaling.
2. Silent errors, swallowed exceptions, and implicit fallback behavior are prohibited.
3. Failure must propagate upward to runtime authority.
4. Runtime must preserve failure context (agent name, hook phase, input reference, timestamp).
5. Failed agent cycles must be observable to operators and orchestration layers.

## 7) Observability Hooks (Trace-Ready)
1. Agents must emit lifecycle and outcome events at `init`, `update`, and `shutdown`.
2. Emitted events must include correlation metadata for future trace stitching.
3. Event schema must remain compatible with Flow/Span-style trace models.
4. Observability emission is mandatory even when agent execution fails.
5. Runtime/orchestration layers may consume events, but agents must remain execution-logic scoped.

## Enforcement Posture
These rules are normative. Non-conforming agents are invalid for production runtime participation.
