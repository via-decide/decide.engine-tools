"""ViaLogic repository loader and canonical entity normalization."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List


SUPPORTED_EXTENSIONS = {".json", ".md", ".txt", ".yaml", ".yml"}


@dataclass
class ViaLogicSnapshot:
    root_path: str
    people: List[Dict[str, Any]] = field(default_factory=list)
    characters: List[Dict[str, Any]] = field(default_factory=list)
    maps: List[Dict[str, Any]] = field(default_factory=list)
    narrative: List[Dict[str, Any]] = field(default_factory=list)
    assets: List[Dict[str, Any]] = field(default_factory=list)

    def as_dict(self) -> Dict[str, Any]:
        return {
            "root_path": self.root_path,
            "people": self.people,
            "characters": self.characters,
            "maps": self.maps,
            "narrative": self.narrative,
            "assets": self.assets,
        }


class ViaLogicLoader:
    """Parses ViaLogic data folders into canonical entity collections."""

    DATA_FOLDERS = ["people", "characters", "maps", "narrative", "assets"]

    def load(self, repo_path: str | Path) -> ViaLogicSnapshot:
        root = Path(repo_path).expanduser().resolve()
        snapshot = ViaLogicSnapshot(root_path=str(root))
        for folder in self.DATA_FOLDERS:
            bucket = self._load_folder(root / folder, folder)
            setattr(snapshot, folder, bucket)
        return snapshot

    def _load_folder(self, folder_path: Path, entity_type: str) -> List[Dict[str, Any]]:
        if not folder_path.exists() or not folder_path.is_dir():
            return []

        items: List[Dict[str, Any]] = []
        for file_path in sorted(folder_path.rglob("*")):
            if not file_path.is_file() or file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
                continue
            parsed = self._parse_file(file_path)
            items.append(
                {
                    "entity_type": entity_type,
                    "entity_id": file_path.stem,
                    "source_path": str(file_path),
                    "payload": parsed,
                }
            )
        return items

    def _parse_file(self, file_path: Path) -> Dict[str, Any]:
        raw = file_path.read_text(encoding="utf-8").strip()
        if not raw:
            return {"content": "", "fields": {}}

        suffix = file_path.suffix.lower()
        if suffix == ".json":
            try:
                content = json.loads(raw)
            except json.JSONDecodeError:
                content = raw
            return {"content": content, "fields": self._extract_fields(content)}

        if suffix in {".yaml", ".yml"}:
            try:
                import yaml  # type: ignore

                content = yaml.safe_load(raw)
                if content is None:
                    content = {}
            except Exception:
                content = raw
            return {"content": content, "fields": self._extract_fields(content)}

        key_values: Dict[str, Any] = {}
        for line in raw.splitlines():
            line = line.strip()
            if not line or ":" not in line:
                continue
            key, value = line.split(":", 1)
            key_values[key.strip()] = value.strip()

        return {"content": raw, "fields": key_values}

    def _extract_fields(self, content: Any) -> Dict[str, Any]:
        if isinstance(content, dict):
            return {str(k): v for k, v in content.items() if isinstance(k, str)}
        return {}
