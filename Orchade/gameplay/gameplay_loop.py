"""Gameplay-oriented helper systems for runtime event generation."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class GameplayLoop:
    """Generates lightweight quest and event outputs from world state."""

    quest_counter: int = 0
    active_quests: List[Dict[str, Any]] = field(default_factory=list)

    def generate_quests(self, narrative_entities: List[Dict[str, Any]], npc_actions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        generated: List[Dict[str, Any]] = []
        for entry in narrative_entities[: max(1, min(3, len(narrative_entities)))]:
            self.quest_counter += 1
            quest = {
                "quest_id": f"quest_{self.quest_counter}",
                "source": entry.get("entity_id", "narrative_seed"),
                "objective": "resolve_conflict",
                "difficulty": "medium" if any(a.get("action") == "seek_cover" for a in npc_actions) else "low",
            }
            generated.append(quest)

        self.active_quests = generated
        return generated
