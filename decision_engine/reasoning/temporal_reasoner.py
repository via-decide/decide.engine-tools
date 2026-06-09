"""Temporal dependency reasoning."""
from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass
class TemporalDependency:
    predecessor: str
    successor: str
    lag_days: int


class TemporalReasoner:
    def order_actions(self, dependencies: List[TemporalDependency]) -> List[str]:
        ordered = sorted(dependencies, key=lambda d: d.lag_days)
        return [f"{d.predecessor} -> {d.successor} (+{d.lag_days}d)" for d in ordered]


# Example usage:
# timeline = TemporalReasoner().order_actions([TemporalDependency('Research', 'Launch', 14)])
