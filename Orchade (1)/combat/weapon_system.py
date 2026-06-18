"""Weapon profile utilities for combat resolution."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass
class WeaponSystem:
    _profiles: Dict[str, Dict[str, float]] = None  # type: ignore[assignment]

    def __post_init__(self) -> None:
        self._profiles = {
            "sword": {"power": 1.0, "speed": 1.0},
            "bow": {"power": 0.9, "speed": 1.2},
            "staff": {"power": 0.8, "speed": 1.1},
            "unarmed": {"power": 0.5, "speed": 1.0},
        }

    def profile(self, weapon_name: str | None) -> Dict[str, float]:
        return dict(self._profiles.get((weapon_name or "unarmed").lower(), self._profiles["unarmed"]))
