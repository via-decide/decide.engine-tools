"""Asset loading and caching pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict


@dataclass
class AssetLoader:
    root: Path
    cache: Dict[str, bytes] = field(default_factory=dict)

    def _load(self, relative_path: str) -> bytes:
        if relative_path in self.cache:
            return self.cache[relative_path]
        data = (self.root / relative_path).read_bytes()
        self.cache[relative_path] = data
        return data

    def load_model(self, relative_path: str) -> bytes:
        return self._load(relative_path)

    def load_texture(self, relative_path: str) -> bytes:
        return self._load(relative_path)

    def load_audio(self, relative_path: str) -> bytes:
        return self._load(relative_path)
