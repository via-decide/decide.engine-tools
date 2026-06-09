#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "partition_simulations"; OUT.mkdir(exist_ok=True)
sim = {
  "failure_types": ["split_brain_execution", "delayed_synchronization", "duplicate_mutations", "authority_divergence", "replay_corruption", "effect_duplication", "transport_collapse"],
  "flow": ["partition", "local_mutations", "replay_divergence", "reconciliation_attempt", "canonical_restoration"],
  "deterministic": True
}
(OUT / "partition-simulation.json").write_text(json.dumps(sim, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT / "partition-simulation.json"), "status": "ok"}, indent=2))
