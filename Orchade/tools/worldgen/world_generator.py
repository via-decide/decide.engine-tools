"""Seed-based procedural world generation."""

from __future__ import annotations

import math
import random
from dataclasses import dataclass
from typing import Dict, List


@dataclass
class WorldGenerator:
    seed: int = 42
    width: int = 32
    height: int = 32

    def _noise(self, x: int, y: int) -> float:
        rng = random.Random((x * 73856093) ^ (y * 19349663) ^ self.seed)
        return rng.random()

    def _fbm(self, x: int, y: int, octaves: int = 4) -> float:
        value = 0.0
        amplitude = 1.0
        frequency = 1.0
        total_amplitude = 0.0
        for _ in range(octaves):
            nx = int(x * frequency)
            ny = int(y * frequency)
            value += self._noise(nx, ny) * amplitude
            total_amplitude += amplitude
            amplitude *= 0.5
            frequency *= 2.0
        return value / max(total_amplitude, 1e-9)

    def _biome(self, elevation: float, moisture: float) -> str:
        if elevation < 0.30:
            return "ocean"
        if elevation < 0.38:
            return "coast"
        if elevation > 0.80 and moisture < 0.4:
            return "mountain"
        if moisture < 0.25:
            return "desert"
        if moisture > 0.75:
            return "forest"
        return "plains"

    def generate(self) -> Dict[str, List[List[Dict[str, float]]]]:
        terrain: List[List[Dict[str, float]]] = []
        for y in range(self.height):
            row = []
            for x in range(self.width):
                elevation = self._fbm(x, y)
                moisture = self._fbm(x + 97, y + 53)
                row.append(
                    {
                        "elevation": round(elevation, 3),
                        "moisture": round(moisture, 3),
                        "biome": self._biome(elevation, moisture),
                    }
                )
            terrain.append(row)
        return {"seed": self.seed, "terrain": terrain}
