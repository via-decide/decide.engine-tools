"""Research synthesis helpers used by Zayvora/Orchade bridges."""

from __future__ import annotations

from typing import Any, Dict

from studyos_core import StudyOSBridge


def synthesize_research(query: str, *, bridge: StudyOSBridge | None = None) -> Dict[str, Any]:
    """Return corpus results and summary payload for a query."""
    client = bridge or StudyOSBridge()
    results = client.search_corpus(query=query, limit=10)
    summary = client.summarize(query=query)
    return {
        "query": query,
        "results": results,
        "summary": summary,
    }
