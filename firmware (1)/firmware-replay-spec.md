# Firmware Replay Continuity Spec

## Firmware Continuity Semantics
- Firmware lineage must be explicit and hash-addressable.
- Rollback operations must preserve continuity references.
- Upgrade replay must execute deterministically.
- Updates must be authority-verified before canonical commit.
- Migrations must preserve continuity admissibility.

## Replay Classification
- `FIRMWARE_COMPATIBLE`
- `FIRMWARE_PARTIAL`
- `FIRMWARE_DIVERGENT`
- `FIRMWARE_RECOVERABLE`
- `FIRMWARE_UNKNOWN`
