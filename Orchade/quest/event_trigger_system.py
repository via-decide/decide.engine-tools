"""Extracts quest triggers from world and NPC actions."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class EventTriggerSystem:
    def collect(self, npc_actions: List[Dict[str, Any]], simulation_state: Dict[str, Any]) -> List[Dict[str, Any]]:
        triggers: List[Dict[str, Any]] = []
        for action in npc_actions:
            if action.get("action") in {"seek_cover", "retaliate", "mediate", "explore"}:
                triggers.append(
                    {
                        "trigger_type": action["action"],
                        "npc_id": action.get("npc_id"),
                        "faction": action.get("faction"),
                    }
                )

        war = simulation_state.get("war", {})
        if float(war.get("global_tension", 0.0)) > 0.65:
            triggers.append({"trigger_type": "war_escalation", "severity": war.get("global_tension", 0.0)})
        return triggers
