# Sovereign Device Mesh Coordination Spec

## Supported Local Mesh Domains
- NFC proximity exchanges.
- Bluetooth mesh neighborhood propagation.
- LoRa long-range local relay channels.
- Sovereign household/offline campus subnets.

## Deterministic Coordination Requirements
- Offline device continuity buffering.
- Replay-safe synchronization with deterministic ordering fields (`event_tick`, `authority_epoch`, `device_id`).
- Authority-aware coordination policies for merge and override.
- Mesh recovery lineage with reconciliation checkpoints.

## Example Recovery Chain
`device_disconnect` → local buffer → continuity manifest generated → mesh reconnect → replay synchronization → canonical restoration.
