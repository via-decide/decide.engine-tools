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
from simulation.diplomacy_system import DiplomacySystem
from simulation.economy_system import EconomySystem
from simulation.war_simulator import WarSimulator


@dataclass
class WorldSimulation:
    """Runs civilization-level simulation ticks."""

    seed: int = 42
    economy_system: EconomySystem = field(init=False)
    diplomacy_system: DiplomacySystem = field(default_factory=DiplomacySystem)
    war_simulator: WarSimulator = field(default_factory=WarSimulator)
    _factions: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    _tick_count: int = 0

    def __post_init__(self) -> None:
        self.economy_system = EconomySystem(seed=self.seed)

    def initialize(self, factions: List[Dict[str, Any]]) -> None:
        if not factions:
            factions = [{"faction_id": "independent", "name": "Independent Coalition"}]

        rng = random.Random(self.seed)
        self._factions = {}
        for entry in factions:
            faction_id = str(entry.get("faction_id") or entry.get("entity_id") or "unknown_faction")
            self._factions[faction_id] = {
                "faction_id": faction_id,
                "name": entry.get("name", faction_id),
                "influence": round(rng.uniform(0.35, 0.85), 3),
                "economy": round(rng.uniform(0.35, 0.85), 3),
                "military": round(rng.uniform(0.25, 0.8), 3),
                "technology": round(rng.uniform(0.2, 0.8), 3),
                "diplomacy": 0.5,
                "alliances": [],
            }

    def tick(self, npc_actions: List[Dict[str, Any]]) -> Dict[str, Any]:
        self._tick_count += 1

        self._factions = self.economy_system.tick(self._factions, npc_actions, tick=self._tick_count)
        self._factions = self.diplomacy_system.tick(self._factions)
        war_state = self.war_simulator.tick(self._factions, npc_actions)

        for state in self._factions.values():
            pressure = war_state["global_tension"] * 0.04
            state["military"] = self._clamp(state["military"] + pressure)
            state["technology"] = self._clamp(state["technology"] + 0.01)
            state["influence"] = self._clamp((state["economy"] + state["military"] + state["technology"]) / 3)

        snapshot = self.snapshot()
        snapshot["war"] = war_state
        return snapshot

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
            "factions": {faction_id: dict(state) for faction_id, state in self._factions.items()},
        }

    @staticmethod
    def _clamp(value: float, min_v: float = 0.0, max_v: float = 1.0) -> float:
        return round(max(min_v, min(max_v, value)), 3)
