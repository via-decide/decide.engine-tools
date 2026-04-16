"""Macro world simulation (politics, trade, warfare, alliances, technology)."""

from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class FactionState:
    faction_id: str
    influence: float
    economy: float
    military: float
    technology: float
    alliances: List[str] = field(default_factory=list)


class WorldSimulation:
    """Runs civilization-level simulation ticks."""

    def __init__(self, seed: int = 42) -> None:
        self._rng = random.Random(seed)
        self._factions: Dict[str, FactionState] = {}
        self._tick_count = 0

    def initialize(self, character_entities: List[Dict[str, Any]]) -> None:
        if not character_entities:
            character_entities = [{"entity_id": "independent"}]

        for entry in character_entities:
            faction_id = str(entry.get("entity_id", "unknown_faction"))
            self._factions[faction_id] = FactionState(
                faction_id=faction_id,
                influence=round(self._rng.uniform(0.3, 0.9), 2),
                economy=round(self._rng.uniform(0.3, 0.9), 2),
                military=round(self._rng.uniform(0.3, 0.9), 2),
                technology=round(self._rng.uniform(0.2, 0.8), 2),
            )

        self._seed_alliances()

    def _seed_alliances(self) -> None:
        faction_ids = list(self._factions.keys())
        if len(faction_ids) < 2:
            return

        for faction_id in faction_ids:
            partner = self._rng.choice(faction_ids)
            if partner != faction_id and partner not in self._factions[faction_id].alliances:
                self._factions[faction_id].alliances.append(partner)

    def tick(self, npc_actions: List[Dict[str, Any]]) -> Dict[str, Any]:
        self._tick_count += 1
        conflict_pressure = 0.03 + (0.02 if any(a.get("action") == "seek_cover" for a in npc_actions) else 0.0)

        for faction in self._factions.values():
            faction.economy = self._clamp(faction.economy + self._rng.uniform(-0.03, 0.05))
            faction.military = self._clamp(faction.military + self._rng.uniform(-0.02, conflict_pressure))
            faction.technology = self._clamp(faction.technology + self._rng.uniform(0.0, 0.03))
            faction.influence = self._clamp((faction.economy + faction.military + faction.technology) / 3)

        return self.snapshot()

    def snapshot(self) -> Dict[str, Any]:
        return {
            "tick": self._tick_count,
            "factions": {
                faction_id: {
                    "influence": state.influence,
                    "economy": state.economy,
                    "military": state.military,
                    "technology": state.technology,
                    "alliances": list(state.alliances),
                }
                for faction_id, state in self._factions.items()
            },
        }

    @staticmethod
    def _clamp(value: float, min_v: float = 0.0, max_v: float = 1.0) -> float:
        return round(max(min_v, min(max_v, value)), 3)
