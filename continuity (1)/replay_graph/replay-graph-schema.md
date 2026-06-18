# Replay Graph Infrastructure

Append-only continuity replay graph model.

## Graph Capabilities
- Task lineage tracking
- Artifact ancestry mapping
- Branch divergence tracking
- Replay checkpoint anchoring
- Canonical progression transitions

## Deterministic Graph Schema
```json
{
  "graph_id": "",
  "nodes": [],
  "edges": [],
  "checkpoints": [],
  "canonical_heads": [],
  "append_only": true,
  "ordering": "lexical_lineage_precedence",
  "immutable_references": true
}
```
