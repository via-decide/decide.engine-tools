"""Economy simulation updates faction wealth and trade pressure."""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Dict, List


@dataclass
class EconomySystem:
    seed: int = 42

    def tick(self, factions: Dict[str, Dict[str, float]], npc_actions: List[Dict[str, str]], tick: int) -> Dict[str, Dict[str, float]]:
        rng = random.Random(f"{self.seed}:economy:{tick}")
        crafting_bonus = sum(1 for action in npc_actions if action.get("action") == "craft") * 0.01
        for state in factions.values():
            drift = rng.uniform(-0.02, 0.05) + crafting_bonus
            state["economy"] = self._clamp(state["economy"] + drift)
        return factions

    @staticmethod
    def _clamp(value: float) -> float:
        return round(max(0.0, min(1.0, value)), 3)
