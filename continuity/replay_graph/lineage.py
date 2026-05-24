import hashlib
import json
from typing import List

from .graph import ReplayGraph, ReplayNode


class LineageValidator:
    def verify_lineage(self, graph: ReplayGraph, node_id: str) -> bool:
        node = graph.nodes.get(node_id)
        if not node:
            return False
        for parent_id in node.parent_ids:
            if parent_id not in graph.nodes:
                return False
        expected_hash = self._compute_hash(node)
        return expected_hash == node.deterministic_hash

    def detect_orphaned_branches(self, graph: ReplayGraph) -> List[str]:
        if not graph.canonical_head:
            return []
        reachable = set()
        self._mark_reachable(graph, graph.canonical_head, reachable)
        return [nid for nid in graph.nodes.keys() if nid not in reachable]

    def _mark_reachable(self, graph: ReplayGraph, node_id: str, visited: set):
        if node_id in visited:
            return
        visited.add(node_id)
        for child_id in graph.children.get(node_id, []):
            self._mark_reachable(graph, child_id, visited)

    def _compute_hash(self, node: ReplayNode) -> str:
        content = json.dumps({"parents": sorted(node.parent_ids), "intent": node.intent, "output": node.output}, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()
