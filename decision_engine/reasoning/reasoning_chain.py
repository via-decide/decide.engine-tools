"""Build reasoning chains from evidence to conclusions."""
from __future__ import annotations

from dataclasses import dataclass
from typing import List

from decision_engine.evidence.evidence_collector import Evidence


@dataclass
class ReasoningLink:
    evidence_claim: str
    inference: str
    conclusion: str


class ReasoningChain:
    def build_chain(self, evidence: List[Evidence], hypotheses: List[str]) -> List[ReasoningLink]:
        links: List[ReasoningLink] = []
        for idx, h in enumerate(hypotheses):
            source = evidence[idx % len(evidence)] if evidence else None
            claim = source.claim if source else 'No evidence provided'
            links.append(
                ReasoningLink(
                    evidence_claim=claim,
                    inference=f"Inference from evidence strength {getattr(source, 'weight', 0):.2f}",
                    conclusion=h,
                )
            )
        return links


# Example usage:
# chain = ReasoningChain().build_chain(evidence, hypotheses)
