"""Confidence estimation module."""
from __future__ import annotations

from typing import Iterable

from decision_engine.evidence.evidence_collector import Evidence


class ConfidenceEstimator:
    def estimate(self, evidence: Iterable[Evidence], risk_score: float) -> float:
        valid = [e for e in evidence if e.valid]
        evidence_strength = sum(e.weight for e in valid) / len(valid) if valid else 0.0
        confidence = 0.65 * evidence_strength + 0.35 * (1 - risk_score)
        return max(0.0, min(1.0, confidence))


# Example usage:
# confidence = ConfidenceEstimator().estimate(evidence, 0.3)
