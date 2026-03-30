# Changelog

All notable changes to ViaDecide Studio.
Format: [Semantic Versioning](https://semver.org)

---

## [Unreleased]

### Fixed
- Fixed duplicate `SUPABASE_ANON_KEY` declarations and duplicate setup-render assignment in `tools/eco-engine-test/index.html` to prevent runtime script errors.
- Added missing `shared/config_env.js`, fixed broken script paths in Agent/SkillHex/Kutch Map pages, and restored a loadable `js/viadecide-agent.js` entrypoint for the Agent demo.
- Improved smoke test resilience by skipping only when Playwright browser executables are unavailable, while keeping real smoke regressions as hard failures.
- Added regression unit coverage for smoke bootstrap error classification.
- Repaired malformed root service worker logic and restored valid install/activate/fetch handlers with GitHub Pages-safe relative shell asset paths.
- Improved smoke test resilience by skipping only when Playwright browser executables are unavailable, while keeping real smoke regressions as hard failures.
- Added regression unit coverage for smoke bootstrap error classification.

---

## [1.0.0] — 2026-03-28

### Foundation
- 37 tools across games, productivity, engine simulations, and education
- Firebase Auth (Google Sign-In) across all tools
- Shared utilities: ToolStorage, ToolBridge, EngineUtils, EngineBalance
- Router with static path map covering all tools
- PWA manifest + service worker (Play Store TWA target)

### Games
- Snake Game, HexWars, FreeCell Classic, SkillHex Mission Control
- ViaLogic, Wings of Fire Quiz

### Productivity
- JSON Formatter, Regex Tester, Color Palette, Pomodoro
- Prompt Alchemy, Idea Remixer, Template Vault, Export Studio
- Revenue Forecaster, Scenario Planner, Task Splitter

### Engine Simulations
- Wave 1: Orchard Engine (player signup → farm generation → harvest)
- Growth Milestone Engine, Seed Quality Scorer, Leaderboard Analytics
- Trust Score Engine, Market Dynamics, Peer Validation Engine

### Infrastructure
- Tool Registry (44 tools, category mapping)
- Tool Bridge (postMessage + localStorage cross-tool state)
- Subscription gate (Firebase Firestore)
