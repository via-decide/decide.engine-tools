"""Damage model used by combat system."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class DamageCalculator:
    def calculate(self, attack_skill: int, defense_skill: int, weapon_power: float) -> int:
        raw = max(1.0, (attack_skill * weapon_power) - (defense_skill * 0.45))
        return int(round(raw))
