"""Scenario tree simulation."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class ScenarioNode:
    name: str
    probability: float
    outcome_score: float
    children: List['ScenarioNode'] = field(default_factory=list)


class ScenarioTree:
    def build(self, options: Dict[str, float]) -> ScenarioNode:
        root = ScenarioNode(name='root', probability=1.0, outcome_score=0.0)
        for name, expected_outcome in options.items():
            node = ScenarioNode(name=name, probability=1.0 / max(1, len(options)), outcome_score=expected_outcome)
            root.children.append(node)
        return root

    def expected_value(self, root: ScenarioNode) -> float:
        return sum(child.probability * child.outcome_score for child in root.children)


# Example usage:
# tree = ScenarioTree(); root = tree.build({'Expand': 0.7, 'Wait': 0.5})
