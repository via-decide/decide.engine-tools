"""NPC cognition and behavior planning engine for Orchade runtime."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from ai.dialogue_generator import DialogueGenerator
from ai.memory_system import MemorySystem
from ai.npc_goal_planner import NPCGoalPlanner


@dataclass
class NPCAIEngine:
    """Runs NPC cognition: memory -> goals -> behavior -> dialogue."""

    planner: NPCGoalPlanner = field(default_factory=NPCGoalPlanner)
    memory_system: MemorySystem = field(default_factory=MemorySystem)
    dialogue_generator: DialogueGenerator = field(default_factory=DialogueGenerator)
    _npcs: Dict[str, Dict[str, Any]] = field(default_factory=dict)

    def load_npcs(self, npc_records: List[Dict[str, Any]]) -> None:
        self._npcs = {entry["npc_id"]: dict(entry) for entry in npc_records}
        for npc_id in self._npcs:
            self.memory_system.remember(npc_id, "spawned", importance=0.3)

    def tick(self, world_state: Dict[str, Any]) -> List[Dict[str, Any]]:
        actions: List[Dict[str, Any]] = []
        for npc_id, npc in self._npcs.items():
            memories = self.memory_system.recall(npc_id)
            action = self.planner.choose_action(npc, world_state, memories)
            dialogue = self.dialogue_generator.generate(npc, action, memories)
            self.memory_system.remember(npc_id, f"action:{action}", importance=0.4)
            npc["last_action"] = action
            actions.append(
                {
                    "npc_id": npc_id,
                    "action": action,
                    "faction": npc.get("faction", "independent"),
                    "dialogue": dialogue,
                }
            )
        return actions

    def snapshot(self) -> Dict[str, Any]:
        return {
            "npc_count": len(self._npcs),
            "npcs": [
                {
                    "npc_id": npc_id,
                    "name": npc.get("name", npc_id),
                    "faction": npc.get("faction", "independent"),
                    "last_action": npc.get("last_action", "idle"),
                }
                for npc_id, npc in self._npcs.items()
            ],
        }
