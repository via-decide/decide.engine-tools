"""War pressure and conflict escalation simulator."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class WarSimulator:
    def tick(self, factions: Dict[str, Dict[str, float]], npc_actions: List[Dict[str, str]]) -> Dict[str, float]:
        hostile_actions = sum(1 for action in npc_actions if action.get("action") in {"retaliate", "seek_cover"})
        avg_military = 0.0
        if factions:
            avg_military = sum(state.get("military", 0.5) for state in factions.values()) / len(factions)

        tension = min(1.0, 0.1 + hostile_actions * 0.06 + avg_military * 0.4)
        return {
            "global_tension": round(tension, 3),
            "hostile_actions": hostile_actions,
            "active_fronts": max(0, hostile_actions // 2),
        }
