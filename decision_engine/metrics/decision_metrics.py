"""Performance metrics for decisions."""
from __future__ import annotations

from typing import Dict


class DecisionMetrics:
    def compute(self, confidence: float, risk: float, outcome_value: float) -> Dict[str, float]:
        quality_index = max(0.0, min(1.0, 0.5 * confidence + 0.3 * (1 - risk) + 0.2 * outcome_value))
        return {
            'confidence': confidence,
            'risk': risk,
            'outcome_value': outcome_value,
            'quality_index': quality_index,
        }


# Example usage:
# metrics = DecisionMetrics().compute(0.8, 0.3, 0.7)
