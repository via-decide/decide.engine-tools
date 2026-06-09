import hashlib
import json
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass(frozen=True)
class ReplayNode:
    id: str
    parent_ids: List[str]
    intent: Dict
    output: Dict
    timestamp: float
    deterministic_hash: str
    lineage_proof: bytes = b""


class ReplayGraph:
    def __init__(self):
        self.nodes: Dict[str, ReplayNode] = {}
        self.children: Dict[str, List[str]] = {}
        self.canonical_head: Optional[str] = None

    def append_node(self, node: ReplayNode) -> None:
        if node.id in self.nodes:
            raise ValueError(f"Node {node.id} already exists (immutable)")
        for parent_id in node.parent_ids:
            if parent_id not in self.nodes:
                raise ValueError(f"Parent {parent_id} not found (append-only)")
        self.nodes[node.id] = node
        self.children.setdefault(node.id, [])
        for parent_id in node.parent_ids:
            self.children.setdefault(parent_id, []).append(node.id)
        self.canonical_head = node.id

    def reconstruct_lineage(self, node_id: str) -> List[ReplayNode]:
        lineage = []
        current = node_id
        while current:
            node = self.nodes[current]
            lineage.append(node)
            current = node.parent_ids[0] if node.parent_ids else None
        return list(reversed(lineage))

    def detect_branching(self, node_id: str) -> Dict[str, List[str]]:
        branches = {}
        for child_id in self.children.get(node_id, []):
            branches[child_id] = self._trace_descendants(child_id)
        return branches

    def _trace_descendants(self, node_id: str) -> List[str]:
        path = [node_id]
        for child_id in self.children.get(node_id, []):
            path.extend(self._trace_descendants(child_id))
        return path

    def export_lineage_json(self) -> str:
        nodes_data = []
        for node_id in sorted(self.nodes.keys()):
            node = self.nodes[node_id]
            nodes_data.append({
                "id": node.id,
                "parents": sorted(node.parent_ids),
                "intent": node.intent,
                "hash": node.deterministic_hash,
                "timestamp": node.timestamp,
            })
        return json.dumps(nodes_data, sort_keys=True)


def compute_node_hash(parent_ids: List[str], intent: Dict, output: Dict) -> str:
    content = json.dumps({"parents": sorted(parent_ids), "intent": intent, "output": output}, sort_keys=True)
    return hashlib.sha256(content.encode()).hexdigest()
