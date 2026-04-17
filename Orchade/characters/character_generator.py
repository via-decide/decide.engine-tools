"""Character and NPC generation pipeline from ViaLogic entities."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from characters.faction_system import FactionSystem
from characters.skill_tree import SkillTree


@dataclass
class CharacterGenerator:
    seed: int = 42
    faction_system: FactionSystem = field(default_factory=FactionSystem)
    skill_tree: SkillTree = field(init=False)

    def __post_init__(self) -> None:
        self.skill_tree = SkillTree(seed=self.seed)

    def generate(self, people_nodes: List[Dict[str, Any]], character_nodes: List[Dict[str, Any]]) -> Dict[str, Any]:
        factions = self.faction_system.generate_factions(character_nodes)
        faction_ids = [f["faction_id"] for f in factions]

        npcs: List[Dict[str, Any]] = []
        for idx, person in enumerate(people_nodes):
            fields = person.get("payload", {}).get("fields", {})
            npc_id = str(person.get("entity_id", f"npc_{idx}"))
            npcs.append(
                {
                    "npc_id": npc_id,
                    "name": fields.get("name", f"NPC {idx}"),
                    "faction": faction_ids[idx % len(faction_ids)] if faction_ids else "independent",
                    "skills": self.skill_tree.generate(npc_id),
                    "role": fields.get("role", "citizen"),
                }
            )

        return {"factions": factions, "npcs": npcs}
