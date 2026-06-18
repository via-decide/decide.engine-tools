# Sovereign Physics Continuity Layer

## Deterministic Physics Rules
- Fixed-step collision ordering by stable entity keys.
- Fixed-point arithmetic strategy for replay parity.
- Tick-synchronous integration only.

## Explicit Risks
- Floating-point drift causes multiplayer divergence.
- Rollback instability appears under non-deterministic collision resolution.
- Tick desynchronization corrupts replay lineage.
