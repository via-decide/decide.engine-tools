"""Diplomacy simulation for faction relations and treaty pressure."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass
class DiplomacySystem:
    def tick(self, factions: Dict[str, Dict[str, float]]) -> Dict[str, Dict[str, float]]:
        faction_ids = list(factions.keys())
        for faction_id, state in factions.items():
            stability = state.get("economy", 0.5) * 0.5 + state.get("technology", 0.5) * 0.5
            state["diplomacy"] = round(stability, 3)
            state["alliances"] = [other for other in faction_ids if other != faction_id and hash(f"{faction_id}:{other}") % 5 == 0]
        return factions
