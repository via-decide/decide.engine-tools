"""Corpus reader adapter for Python environments."""

from __future__ import annotations

from typing import Any, Dict, List

from studyos_core import StudyOSBridge


def fetch_document_chunks(doc_id: str, *, offset: int = 0, limit: int = 5, bridge: StudyOSBridge | None = None) -> List[Dict[str, Any]]:
    """Fetch chunk payloads for a StudyOS corpus document."""
    client = bridge or StudyOSBridge()
    response = client.load_document(doc_id=doc_id, offset=offset, limit=limit)
    chunks = response.get("chunks") or []
    return list(chunks)
