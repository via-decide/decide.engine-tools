from __future__ import annotations

import argparse
from pathlib import Path

from agents.engineering_agent import AgentConfig, EngineeringAgent
from execution.debug_loop import IterativeDebugLoop
from verification.test_runner import TestRunner


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="zayvora")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("analyze", help="Analyze repository structure and architecture")
    sub.add_parser("architect", help="Run architecture anti-pattern checks")

    test_parser = sub.add_parser("test", help="Run project tests")
    test_parser.add_argument("--cmd", default="pytest -q")

    fix_parser = sub.add_parser("fix", help="Run iterative debug loop")
    fix_parser.add_argument("--cmd", default="pytest -q")

    sub.add_parser("refactor", help="Scaffold for refactor workflows")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    agent = EngineeringAgent(AgentConfig(repo_root=str(Path.cwd())))

    if args.command == "analyze":
        print(agent.analyze())
        return 0
    if args.command == "architect":
        print([item.__dict__ for item in agent.architecture_reasoner.evaluate()])
        return 0
    if args.command == "test":
        result = TestRunner().run_tests(args.cmd)
        print(result.failure_summary)
        return 0 if result.success else 1
    if args.command == "fix":
        loop = IterativeDebugLoop(max_iterations=3)
        result = loop.run(lambda _summary: None, args.cmd)
        print(result)
        return 0 if result.success else 1
    if args.command == "refactor":
        print("Refactor workflow entrypoint ready")
        return 0
    parser.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
