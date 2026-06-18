"""Resource allocation module."""
from __future__ import annotations

from typing import Dict


class ResourcePlanner:
    def allocate(self, priorities: Dict[str, float], total_budget: float) -> Dict[str, float]:
        total_weight = sum(max(v, 0) for v in priorities.values())
        if total_weight == 0:
            return {k: 0.0 for k in priorities}
        return {k: (max(v, 0) / total_weight) * total_budget for k, v in priorities.items()}


# Example usage:
# allocations = ResourcePlanner().allocate({'research': 2, 'launch': 3}, 100000)
