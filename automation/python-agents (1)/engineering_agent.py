from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from analysis.architecture_reasoner import ArchitectureReasoner
from analysis.repo_analyzer import RepositoryAnalyzer
from execution.debug_loop import IterativeDebugLoop
from memory.session_memory import SessionMemory


@dataclass
class AgentConfig:
    repo_root: str = "."


class EngineeringAgent:
    def __init__(self, config: AgentConfig) -> None:
        self.repo_root = Path(config.repo_root)
        self.repo_analyzer = RepositoryAnalyzer(self.repo_root)
        self.architecture_reasoner = ArchitectureReasoner(self.repo_root)
        self.debug_loop = IterativeDebugLoop()
        self.memory = SessionMemory(self.repo_root / ".zayvora_memory.json")

    def analyze(self) -> dict:
        report = self.repo_analyzer.scan().to_dict()
        findings = [f.__dict__ for f in self.architecture_reasoner.evaluate()]
        self.memory.append("analysis", {"report": report, "findings": findings})
        return {"report": report, "findings": findings}
