"""Long-term strategy tree representation."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List


@dataclass
class StrategyNode:
    name: str
    objective: str
    children: List['StrategyNode'] = field(default_factory=list)


class StrategyTree:
    def build(self, root_name: str, objective: str, branches: List[str]) -> StrategyNode:
        root = StrategyNode(root_name, objective)
        root.children = [StrategyNode(name=branch, objective=f'Support {objective}') for branch in branches]
        return root


# Example usage:
# tree = StrategyTree().build('Scale', 'Grow market share', ['Acquire users', 'Improve retention'])
