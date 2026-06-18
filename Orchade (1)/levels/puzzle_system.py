"""Puzzle generation helpers for dungeon levels."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class PuzzleSystem:
    def generate(self, difficulty: str, count: int) -> List[Dict[str, str]]:
        patterns = ["rune_sequence", "pressure_plate", "mirror_beam", "lever_network"]
        return [
            {
                "puzzle_id": f"puzzle_{idx + 1}",
                "type": patterns[idx % len(patterns)],
                "difficulty": difficulty,
            }
            for idx in range(max(1, count))
        ]
