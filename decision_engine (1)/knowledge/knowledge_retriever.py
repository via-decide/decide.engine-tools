"""Knowledge retrieval from in-memory datasets."""
from __future__ import annotations

from typing import Dict, Iterable, List


class KnowledgeRetriever:
    def __init__(self, corpus: Iterable[Dict[str, str]] | None = None) -> None:
        self.corpus = list(corpus or [])

    def query(self, topic: str) -> List[Dict[str, str]]:
        topic_lower = topic.lower()
        return [entry for entry in self.corpus if topic_lower in entry.get('topic', '').lower() or topic_lower in entry.get('content', '').lower()]


# Example usage:
# retriever = KnowledgeRetriever([{'topic': 'market', 'content': 'Market is growing'}])
# hits = retriever.query('market')
