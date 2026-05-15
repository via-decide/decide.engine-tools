#!/usr/bin/env python3
from pathlib import Path
import json

OUT = Path(__file__).resolve().parent.parent / "world_lineage"
OUT.mkdir(exist_ok=True)
lineage = {
    "world_id": "demo_world",
    "lineage": [
        {"event": "player_trade", "tick": 1},
        {"event": "economy_shift", "tick": 2},
        {"event": "npc_migration", "tick": 3},
        {"event": "faction_instability", "tick": 4},
        {"event": "world_divergence", "tick": 5},
        {"event": "replay_lineage_update", "tick": 6}
    ],
    "tracks": ["player_actions", "simulation_events", "plugin_mutations", "authority_changes", "world_forks", "reconciliation_paths"]
}
(OUT / "world-lineage.json").write_text(json.dumps(lineage, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT / "world-lineage.json"), "status": "ok"}, indent=2))
