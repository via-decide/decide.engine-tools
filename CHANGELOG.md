# Changelog

All notable changes to ViaDecide Studio.
Format: [Semantic Versioning](https://semver.org)

---

## [Unreleased]

### Added
- Added central Orchade runtime orchestrator entrypoint at `Orchade/engine/orchade_runtime.py` to wire map engine state, world region/city generation, NPC spawn/behavior, gameplay mission triggers, simulation systems, and the unified game tick/game loop lifecycle.
- Implemented full Orchade modular runtime engine with ECS world orchestration, ViaLogic entity conversion, procedural world/character generation, NPC goal-memory-dialogue AI, quest/event/story systems, combat + level generators, simulation subsystems, and runtime game loop integration with expanded runtime tests.
- Implemented Orchade AAA runtime foundations with executable Python modules for ECS (`Orchade/ecs`), ViaLogic ingestion (`Orchade/integration/vialogic_loader.py`), procedural world generation (`Orchade/world/world_generator.py`), NPC cognition (`Orchade/ai/npc_ai_engine.py`), civilization simulation (`Orchade/simulation/world_simulation.py`), runtime orchestration (`Orchade/runtime/runtime_controller.py`), and top-level engine lifecycle (`Orchade/engine/orchade_engine.py`), plus integration coverage in `Orchade/tests/test_orchade_engine_runtime.py`.
- Added polyglot workspace interoperability scaffolding: `workspace/shared_modules` catalog, editable-install Python shared adapters under `workspace/shared/`, Orchade `ai/studyos_bridge` integration, and a Zayvora toolkit StudyOS bridge module for corpus/research access.
- Initialized `Orchade/` AI-native game engine prototype scaffold with modular engine/game/assets/tools/docs layout, ECS + core engine lifecycle, Zayvora bridge integration layer, procedural world generator, gameplay systems, YAML config, and runnable demo script.
- Upgraded StudyOS with a Nex-powered research workspace including semantic corpus search, source exploration, document viewing, AI summaries, markdown notes, and corpus analytics tabs wired into the main UI shell.
- Introduced a unified dashboard shell (`dashboard/index.html`) with reusable layout modules, global navigation, command palette, status states, and new workspace/session + tool catalog entry pages (`workspace/index.html`, `workspace/session.js`, `tools/index.html`).
- Added a cross-repository Zayvora pipeline scaffolder script (`scripts/scaffold/zayvora-pipeline.js`), unit tests, and `docs/system_pipeline.md` to generate the first Simulation → Sensor → Protocol → AI → Dashboard integration skeleton across target repositories.
- Enhanced Highway-V2I lab with microscopic per-vehicle physics (driver profiles, acceleration/braking, lane-following), real-time calibration controls + synthetic traffic stream generator, scenario experiment engine for rain/accident/sensor failure/festival/ambulance events, and research metrics artifacts (JSON/CSV targets under `/highway-v2i-lab/research/`) with new Traffic Physics, Scenario Lab timeline, and Experiment Metrics dashboard panels.
- Extended Highway-V2I with a self-evolving Protocol Evolution Lab: protocol/infrastructure genomes, 200-generation configurable GA default, reproducible seeded runs, and Protocol Lab experiment/report controls for JSON/CSV/technical summaries.
- Upgraded the Highway-V2I lab into an autonomous transport architecture discovery system with multi-network switching (DSRC/C-V2X/5G and experimental mesh modes), protocol + infrastructure genomes, swarm behavior modes, decision-graph-evaluated simulation metrics, invention mode, and large-scale architecture batch experiments integrated into the dashboard UI.
- Refactored the Highway-V2I dashboard into a DECIDE runtime wrapper with `DECIDE.simulation.run()` and Monte Carlo `DECIDE.simulation.optimize()`, plus embedded tool loading for decision-matrix, scenario-planner, output-evaluator, and analytics visualization.
- Added a research-grade Highway-V2I lab module (`highway-v2i-lab/`) with simulation engines, protocol/infrastructure genomes, protocol evolution loop (population 60, configurable generations default 200), experiment runner with JSON/CSV exports, research artifact store, and Protocol Lab UI panel integrated into the dashboard.
- Expanded the Highway-V2I simulator into a smart corridor digital twin laboratory with traffic intelligence analytics, infrastructure health monitoring, drainage/flood risk simulation, emergency mobility corridor logic, real-time digital twin layers, and a scenario experiment suite that exports structured JSON/CSV research outputs targeted for `/highway-v2i-lab/research/`.
- Added a Self-Evolving Infrastructure Engine integrated into Highway-V2I with infrastructure genome crossover/mutation/selection across heavy-traffic/rain/failure/emergency/accident scenarios, new Infrastructure Evolution Lab dashboard panel (leaderboard + genome tree + performance graph + playback), and research exports for optimized RSU placement, sensor layout recommendations, and traffic control strategies.

### Fixed
- Fixed six critical StudyOS regressions in `StudyOS/index.html`: removed browser-incompatible TS/TSX script tags in favor of a safe research stub mount, repaired PhysicsController window listener cleanup, corrected onboarding layout-to-tab routing map, added explicit Kinetic DOWN-swipe skip flow with clamped progress math, enforced Tracker mock score validation (0–100), and switched Vault download wiring from inline onclick strings to data-attribute event listeners.
- Fixed StudyOS bootloader blank-screen regression by adding an auth-readiness fallback timer so the app still initializes when Firebase auth never reaches ready state.
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
