#!/usr/bin/env python3
import hashlib
import sys
import json
from dataclasses import dataclass
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from typing import Dict, List


@dataclass
class DriftReport:
    node_id: str
    drift_type: str
    severity: float
    evidence: List[str]
    remediation: str


class ExecutionDriftDetector:
    def __init__(self):
        self.execution_log = []
        self.drift_reports = []

    def record_execution(self, node_id: str, intent: Dict, output: Dict):
        self.execution_log.append({"node_id": node_id, "intent": intent, "output": output, "hash": hashlib.sha256(json.dumps(output, sort_keys=True).encode()).hexdigest()})

    def detect_semantic_drift(self):
        reports = []
        intent_map = {}
        for e in self.execution_log:
            k = json.dumps(e["intent"], sort_keys=True)
            intent_map.setdefault(k, []).append(e)
        for k, ex in intent_map.items():
            unique = set([e["hash"] for e in ex])
            if len(unique) > 1:
                sev = len(unique) / len(ex)
                reports.append(DriftReport("*", "semantic_drift", min(1.0, sev), [f"Intent: {json.loads(k)}", f"Produced {len(unique)} different outputs across {len(ex)} executions"], "Audit external dependencies"))
        return reports

    def compute_continuity_confidence(self):
        reports = self.detect_semantic_drift() + self.drift_reports
        if not reports:
            return 1.0
        avg = sum(r.severity for r in reports) / len(reports)
        return 1.0 - avg

    def generate_drift_report(self):
        c = self.compute_continuity_confidence()
        return {
            "semantic_drift_detections": len(self.detect_semantic_drift()),
            "continuity_confidence_score": c,
            "reports": [r.__dict__ for r in self.drift_reports],
            "verdict": "REPLAY_SAFE" if c > 0.95 else "DRIFT_DETECTED",
        }


if __name__ == "__main__":
    det = ExecutionDriftDetector()
    det.record_execution("n1", {"task": "x"}, {"out": 1})
    det.record_execution("n2", {"task": "x"}, {"out": 2})
    report = det.generate_drift_report()
    out = Path("continuity/replay_graph/execution-drift-report.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({"output": str(out), "status": "ok"}, indent=2))
