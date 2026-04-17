"""Skill tree generation for Orchade characters and NPCs."""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Dict


@dataclass
class SkillTree:
    seed: int = 42

    def generate(self, identity: str) -> Dict[str, int]:
        rng = random.Random(f"{self.seed}:{identity}")
        return {
            "combat": rng.randint(1, 10),
            "crafting": rng.randint(1, 10),
            "diplomacy": rng.randint(1, 10),
            "survival": rng.randint(1, 10),
            "leadership": rng.randint(1, 10),
        }
