"""Risk scoring for decision options."""
from __future__ import annotations

from typing import Dict


class RiskEngine:
    def score_option(self, option: Dict[str, float]) -> float:
        cost = option.get('cost', 0.0)
        uncertainty = option.get('uncertainty', 0.0)
        impact = option.get('impact', 0.0)
        return min(1.0, max(0.0, 0.4 * uncertainty + 0.3 * (cost / 100.0) + 0.3 * (1 - impact)))

    def score_options(self, options: Dict[str, Dict[str, float]]) -> Dict[str, float]:
        return {name: self.score_option(metrics) for name, metrics in options.items()}


# Example usage:
# risks = RiskEngine().score_options({'OptionA': {'cost': 50, 'uncertainty': 0.6, 'impact': 0.8}})
