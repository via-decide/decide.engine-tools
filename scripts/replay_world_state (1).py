#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
lineage_path = ROOT / "world_lineage" / "world-lineage.json"
out_dir = ROOT / "world_replay"
out_dir.mkdir(exist_ok=True)
required = ["player_trade", "economy_shift", "npc_migration", "faction_instability", "world_divergence", "replay_lineage_update"]
classes = ["SIMULATION_DIVERGENCE", "PLUGIN_DIVERGENCE", "AUTHORITY_DIVERGENCE", "MULTIPLAYER_DIVERGENCE", "RUNTIME_DIVERGENCE", "UNKNOWN_WORLD_STATE"]
lineage = json.loads(lineage_path.read_text(encoding="utf-8")) if lineage_path.exists() else {"lineage": []}
observed = [x.get("event") for x in lineage.get("lineage", [])]
missing = [e for e in required if e not in observed]
replay = {
    "world_id": lineage.get("world_id", "unknown_world"),
    "replay_targets": ["economic_systems", "faction_systems", "inventory_lineage", "authority_transitions", "simulation_events", "plugin_mutations", "world_continuity"],
    "divergence_classes": classes,
    "status": "REPLAY_STABLE" if not missing else "REPLAY_DIVERGED",
    "missing_required_events": missing,
    "deterministic": True
}
out_path = out_dir / "world-replay-report.json"
out_path.write_text(json.dumps(replay, indent=2), encoding="utf-8")
print(json.dumps({"output": str(out_path), "status": replay["status"]}, indent=2))
