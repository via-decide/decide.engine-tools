"""Combat system scaffold."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass
class CombatSystem:
    def resolve_attack(self, attacker: Dict, defender: Dict) -> Dict:
        damage = max(1, int(attacker.get("power", 1) - defender.get("defense", 0)))
        defender["hp"] = max(0, int(defender.get("hp", 0)) - damage)
        return {"damage": damage, "defender_hp": defender["hp"]}
