Decide Engine Tools – Agent System

Purpose:
This repository provides orchestration tools used by AI agents to operate on external GitHub repositories.

Primary Targets:
zayvora/*

Operating Rules:

- Never modify decide.engine-tools core modules.
- Use tooling for repo analysis and task splitting.
- Push code changes only to target repositories.
- Keep prompts minimal by relying on system specs.

Standard Workflow:

1. Analyze repository
2. Generate task plan
3. Execute code changes
4. Commit and push changes
5. Report results
