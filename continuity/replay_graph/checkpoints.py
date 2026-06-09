from dataclasses import dataclass
from typing import Dict


@dataclass(frozen=True)
class ReplayCheckpoint:
    tick: int
    head_id: str
    state_hash: str
    metadata: Dict
