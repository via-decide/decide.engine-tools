"""HTTP bridge for StudyOS-compatible backend services."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import json


class StudyOSBridgeError(RuntimeError):
    """Raised when StudyOS bridge requests fail."""


@dataclass
class StudyOSBridge:
    """Simple API client mirroring StudyOS corpus/reasoning endpoints."""

    base_url: str = "http://localhost:8000"
    timeout_seconds: float = 3.0

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.base_url.rstrip('/')}{path}"
        body = json.dumps(payload).encode("utf-8")
        request = Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
        try:
            with urlopen(request, timeout=self.timeout_seconds) as response:  # nosec B310 - controlled internal URL
                return json.loads(response.read().decode("utf-8") or "{}")
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise StudyOSBridgeError(f"StudyOS request failed for {path}: {exc}") from exc

    def search_corpus(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        payload = self._post("/search", {"query": query, "limit": limit})
        return list(payload.get("results") or payload.get("passages") or [])

    def load_document(self, doc_id: str, offset: int = 0, limit: int = 5) -> Dict[str, Any]:
        return self._post("/document", {"doc_id": doc_id, "offset": offset, "limit": limit})

    def summarize(self, query: str) -> Dict[str, Any]:
        return self._post("/summary", {"query": query})
