"""Goal planning and action selection for NPC behavior."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class NPCGoalPlanner:
    def choose_action(self, npc: Dict[str, Any], world_state: Dict[str, Any], memories: List[Dict[str, Any]]) -> str:
        threat = float(world_state.get("global_threat", 0.2))
        war_pressure = float(world_state.get("simulation", {}).get("war", {}).get("global_tension", 0.0))
        skills = npc.get("skills", {})

        if threat > 0.7 or war_pressure > 0.7:
            return "seek_cover"
        if skills.get("diplomacy", 0) >= 7 and war_pressure > 0.45:
            return "mediate"
        if any(mem.get("event") == "attacked" for mem in memories):
            return "retaliate"
        if skills.get("survival", 0) >= 6:
            return "explore"
        if skills.get("crafting", 0) >= 7:
            return "craft"
        return "patrol"
