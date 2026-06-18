"""Zayvora Toolkit bridge for StudyOS corpus + research access."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List

try:
    from studyos_core import StudyOSBridge, StudyOSBridgeError
    from research_tools import synthesize_research
except Exception as exc:  # pragma: no cover - import diagnostics for bootstrap environments
    raise RuntimeError(
        "Shared StudyOS package is unavailable. Install with `pip install -e workspace/shared`."
    ) from exc


@dataclass
class StudyOSResearchBridge:
    """Expose StudyOS-backed utilities inside Zayvora runtime."""

    base_url: str = "http://localhost:8000"

    def __post_init__(self) -> None:
        self._bridge = StudyOSBridge(base_url=self.base_url)

    def search(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        return self._bridge.search_corpus(query=query, limit=limit)

    def corpus_document(self, doc_id: str, offset: int = 0, limit: int = 5) -> Dict[str, Any]:
        return self._bridge.load_document(doc_id=doc_id, offset=offset, limit=limit)

    def synthesize(self, query: str) -> Dict[str, Any]:
        return synthesize_research(query=query, bridge=self._bridge)

    def safe_synthesize(self, query: str) -> Dict[str, Any]:
        try:
            return self.synthesize(query)
        except StudyOSBridgeError:
            return {
                "query": query,
                "results": [],
                "summary": {
                    "summary": "StudyOS service unavailable; using empty fallback.",
                    "bullet_points": [],
                    "sources": [],
                },
            }
