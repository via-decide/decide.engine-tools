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

    def snapshot(self) -> Dict[str, Any]:
        return {
            "npc_count": len(self._npcs),
            "npcs": [
                {
                    "npc_id": npc.npc_id,
                    "name": npc.name,
                    "faction": npc.faction,
                    "last_action": npc.last_action,
                }
                for npc in self._npcs.values()
            ],
        }
