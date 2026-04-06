"""YAML configuration loader for Orchade."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict


def _parse_scalar(raw: str) -> Any:
    value = raw.strip()
    if value.lower() in {"true", "false"}:
        return value.lower() == "true"
    try:
        if "." in value:
            return float(value)
        return int(value)
    except ValueError:
        return value


def _parse_simple_yaml(text: str) -> Dict[str, Any]:
    """Parse a minimal subset of YAML (dict nesting by indentation)."""
    root: Dict[str, Any] = {}
    stack = [(0, root)]

    for line in text.splitlines():
        if not line.strip() or line.strip().startswith('#'):
            continue

        indent = len(line) - len(line.lstrip(' '))
        key, _, value = line.strip().partition(':')

        while stack and indent < stack[-1][0]:
            stack.pop()

        current = stack[-1][1]
        if value.strip() == "":
            new_map: Dict[str, Any] = {}
            current[key] = new_map
            stack.append((indent + 2, new_map))
        else:
            current[key] = _parse_scalar(value)

    return root


def load_config(path: str | Path) -> Dict[str, Any]:
    content = Path(path).read_text(encoding="utf-8")
    try:
        import yaml  # type: ignore

        loaded = yaml.safe_load(content)
        return loaded if isinstance(loaded, dict) else {}
    except Exception:
        return _parse_simple_yaml(content)
