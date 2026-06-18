"""Orchade-side StudyOS bridge.

Flow target:
NPC query -> Zayvora reasoning -> StudyOS corpus -> decision payload
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict

try:
    from studyos_core import StudyOSBridge, StudyOSBridgeError
except Exception as exc:  # pragma: no cover - bootstrap diagnostic
    raise RuntimeError(
        "Shared StudyOS package missing. Install via `pip install -e workspace/shared`."
    ) from exc


@dataclass
class OrchadeStudyOSBridge:
    """Facade used by Orchade AI systems for corpus-assisted decisions."""

    base_url: str = "http://localhost:8000"

    def __post_init__(self) -> None:
        self._client = StudyOSBridge(base_url=self.base_url)

    def enrich_context(self, npc_context: Dict[str, Any]) -> Dict[str, Any]:
        query = str(npc_context.get("query") or npc_context.get("goal") or "world state")
        try:
            corpus_hits = self._client.search_corpus(query=query, limit=5)
            summary = self._client.summarize(query=query)
        except StudyOSBridgeError:
            corpus_hits = []
            summary = {"summary": "StudyOS unavailable", "bullet_points": [], "sources": []}

        enriched = dict(npc_context)
        enriched["studyos"] = {
            "query": query,
            "hits": corpus_hits,
            "summary": summary,
        }
        return enriched
