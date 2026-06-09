"""Multi-agent evaluation of decision options."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class AgentOpinion:
    agent_name: str
    option: str
    score: float


class DecisionAgents:
    def __init__(self, agents: List[str] | None = None) -> None:
        self.agents = agents or ['RiskAnalyst', 'GrowthStrategist', 'OperationsLead']

    def evaluate(self, options: Dict[str, Dict[str, float]]) -> List[AgentOpinion]:
        opinions: List[AgentOpinion] = []
        for agent in self.agents:
            bias = 0.05 if 'Growth' in agent else -0.02 if 'Risk' in agent else 0.0
            for option, metrics in options.items():
                base = 0.5 * metrics.get('impact', 0) + 0.3 * (1 - metrics.get('uncertainty', 0)) + 0.2 * (1 - metrics.get('cost', 0) / 100)
                opinions.append(AgentOpinion(agent, option, max(0.0, min(1.0, base + bias))))
        return opinions


# Example usage:
# opinions = DecisionAgents().evaluate(options)
