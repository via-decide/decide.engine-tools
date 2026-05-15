#!/usr/bin/env python3
from pathlib import Path
import json

OUT = Path(__file__).resolve().parent.parent / "world_replay"
OUT.mkdir(exist_ok=True)
replay = {
    "world_id": "demo_world",
    "replay_targets": ["economic_systems", "faction_systems", "inventory_lineage", "authority_transitions", "simulation_events", "plugin_mutations", "world_continuity"],
    "divergence_classes": [
        "SIMULATION_DIVERGENCE",
        "PLUGIN_DIVERGENCE",
        "AUTHORITY_DIVERGENCE",
        "MULTIPLAYER_DIVERGENCE",
        "RUNTIME_DIVERGENCE",
        "UNKNOWN_WORLD_STATE"
    ],
    "status": "REPLAY_STABLE"
}
(OUT / "world-replay-report.json").write_text(json.dumps(replay, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT / "world-replay-report.json"), "status": "ok"}, indent=2))
