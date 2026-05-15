#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
manifest_path = ROOT / "core" / "world-continuity-manifest.md"
out_dir = ROOT / "world_lineage"
out_dir.mkdir(exist_ok=True)
seed_events = ["player_trade", "economy_shift", "npc_migration", "faction_instability", "world_divergence", "replay_lineage_update"]
tracks = ["player_actions", "simulation_events", "plugin_mutations", "authority_changes", "world_forks", "reconciliation_paths"]
world_id = "demo_world"
if manifest_path.exists():
    txt = manifest_path.read_text(encoding="utf-8")
    if '"world_id": ""' in txt:
        world_id = "manifest_defined_world"
lineage = {
    "world_id": world_id,
    "lineage": [{"event": ev, "tick": i + 1} for i, ev in enumerate(seed_events)],
    "tracks": tracks,
    "source_manifest": str(manifest_path.relative_to(ROOT)),
    "deterministic": True
}
out_path = out_dir / "world-lineage.json"
out_path.write_text(json.dumps(lineage, indent=2), encoding="utf-8")
print(json.dumps({"output": str(out_path), "status": "ok", "world_id": world_id}, indent=2))
