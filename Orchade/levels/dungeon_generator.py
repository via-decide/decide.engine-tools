"""Dungeon and encounter layout generation."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from levels.puzzle_system import PuzzleSystem


@dataclass
class DungeonGenerator:
    puzzle_system: PuzzleSystem = field(default_factory=PuzzleSystem)

    def generate(self, world: Dict[str, Any], quest_log: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        dungeons: List[Dict[str, Any]] = []
        locations = world.get("locations", [])
        quest_count = max(1, len(quest_log))

        for idx in range(min(quest_count, len(locations) or 1)):
            location = locations[idx] if locations else {"location_id": f"generated_{idx}", "name": f"Generated {idx}"}
            difficulty = "high" if idx < len(quest_log) and quest_log[idx].get("difficulty") == "high" else "medium"
            dungeons.append(
                {
                    "dungeon_id": f"dungeon_{idx + 1}",
                    "location_id": location["location_id"],
                    "name": f"{location['name']} Depths",
                    "rooms": 5 + idx,
                    "puzzles": self.puzzle_system.generate(difficulty=difficulty, count=2 + idx % 2),
                }
            )

        return dungeons
