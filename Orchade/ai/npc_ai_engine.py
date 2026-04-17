"""NPC cognition and behavior planning engine for Orchade runtime."""

from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class NPC:
    npc_id: str
    name: str
    faction: str
    personality: Dict[str, float]
    skills: Dict[str, int]
    goals: List[str] = field(default_factory=list)
    memory: List[Dict[str, Any]] = field(default_factory=list)
    last_action: str = "idle"


class NPCAIEngine:
    """Creates and updates NPC cognition state from ViaLogic entities."""

    def __init__(self, seed: int = 42) -> None:
        self._rng = random.Random(seed)
        self._npcs: Dict[str, NPC] = {}

    def generate_npcs(self, people: List[Dict[str, Any]], factions: List[str]) -> List[NPC]:
        generated: List[NPC] = []
        faction_pool = factions or ["independent"]

        for idx, person in enumerate(people):
            fields = person.get("payload", {}).get("fields", {})
            npc = NPC(
                npc_id=str(person.get("entity_id", f"npc_{idx}")),
                name=fields.get("name", f"NPC {idx}"),
                faction=self._rng.choice(faction_pool),
                personality={
                    "aggression": round(self._rng.uniform(0.0, 1.0), 2),
                    "curiosity": round(self._rng.uniform(0.0, 1.0), 2),
                    "discipline": round(self._rng.uniform(0.0, 1.0), 2),
                },
                skills={
                    "combat": self._rng.randint(1, 10),
                    "crafting": self._rng.randint(1, 10),
                    "diplomacy": self._rng.randint(1, 10),
                },
                goals=["survive", "support_faction"],
            )
            npc.memory.append({"event": "spawned", "importance": 0.3})
            self._npcs[npc.npc_id] = npc
            generated.append(npc)

        return generated

    def tick(self, world_state: Dict[str, Any]) -> List[Dict[str, Any]]:
        actions: List[Dict[str, Any]] = []
        threat_level = float(world_state.get("global_threat", 0.2))

        for npc in self._npcs.values():
            action = self._plan_action(npc, threat_level)
            npc.last_action = action
            npc.memory.append({"event": f"action:{action}", "importance": 0.5})
            actions.append({"npc_id": npc.npc_id, "action": action, "faction": npc.faction})

        return actions

    def _plan_action(self, npc: NPC, threat_level: float) -> str:
        if threat_level > 0.75:
            return "seek_cover"
        if npc.personality["curiosity"] > 0.7:
            return "explore"
        if npc.skills["diplomacy"] >= npc.skills["combat"]:
            return "negotiate"
        return "patrol"

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
