"""Constraint solver for decision alternatives."""
from __future__ import annotations

from typing import Dict, Iterable, List


class ConstraintSolver:
    def feasible_options(self, options: Iterable[Dict[str, float]], constraints: Dict[str, float]) -> List[Dict[str, float]]:
        result: List[Dict[str, float]] = []
        for option in options:
            if option.get('cost', 0) > constraints.get('budget', float('inf')):
                continue
            if option.get('time', 0) > constraints.get('deadline_days', float('inf')):
                continue
            if option.get('risk', 0) > constraints.get('max_risk', 1.0):
                continue
            result.append(option)
        return result


# Example usage:
# feasible = ConstraintSolver().feasible_options(options, {'budget': 100, 'deadline_days': 30, 'max_risk': 0.4})
