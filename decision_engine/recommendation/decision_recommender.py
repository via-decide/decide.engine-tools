"""Decision recommendation orchestrator."""
from __future__ import annotations

from typing import Dict, Tuple

from decision_engine.analysis.confidence_estimator import ConfidenceEstimator
from decision_engine.analysis.risk_engine import RiskEngine
from decision_engine.evidence.evidence_collector import Evidence
from decision_engine.simulation.scenario_tree import ScenarioTree


class DecisionRecommender:
    def __init__(self) -> None:
        self.risk_engine = RiskEngine()
        self.confidence_estimator = ConfidenceEstimator()
        self.scenario_tree = ScenarioTree()

    def recommend(self, options: Dict[str, Dict[str, float]], evidence: list[Evidence]) -> Tuple[str, Dict[str, float]]:
        risks = self.risk_engine.score_options(options)
        outcomes = {name: metrics.get('impact', 0.0) * (1 - risks[name]) for name, metrics in options.items()}
        tree = self.scenario_tree.build(outcomes)
        _ = self.scenario_tree.expected_value(tree)

        scored: Dict[str, float] = {}
        for name in options:
            scored[name] = outcomes[name] * (1 - risks[name])

        best = max(scored, key=scored.get)
        confidence = self.confidence_estimator.estimate(evidence, risks[best])
        return best, {'confidence': confidence, 'risk': risks[best], 'score': scored[best]}


# Example usage:
# decision, stats = DecisionRecommender().recommend(options, evidence)
