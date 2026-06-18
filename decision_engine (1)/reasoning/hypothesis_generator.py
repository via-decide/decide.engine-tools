"""Generate hypotheses from evidence and context."""
from __future__ import annotations

from typing import List

from decision_engine.context.context_manager import DecisionContext
from decision_engine.evidence.evidence_collector import Evidence


class HypothesisGenerator:
    def generate(self, context: DecisionContext, evidence: List[Evidence]) -> List[str]:
        valid_claims = [e.claim for e in evidence if e.valid]
        if not valid_claims:
            return [f"Insufficient evidence to act on objective: {context.objective}"]
        return [
            f"If we pursue '{context.objective}', then {claim.lower()}" for claim in valid_claims
        ]


# Example usage:
# hypotheses = HypothesisGenerator().generate(ctx, evidence)
