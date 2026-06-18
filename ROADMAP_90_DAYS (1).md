# Roadmap: 90 Days Platformization

## Overview
This roadmap schedules the transition of the `decide.engine-tools` repository from a flat collection of browser utilities into a modular, self-improving, world-class engineering platform.

```
Days 1-30: Package Extraction & Test Repairs
├─ Centralize packages/storage, exports, reasoning
└─ Guarantee 100% unit testing compliance

Days 31-60: Directory Migration & Cockpit Convergence
├─ Restructure apps/studyos and apps/cockpit
└─ Integrate sub-consoles under cockpit/

Days 61-90: Agent Enablement & Automation Hooks
├─ Activate vault/ telemetry and trace capturing
└─ Configure pre-commit verification filters
```

---

## Phase 1: Days 1-30 — Foundations & Modular Reuse

### Goals
- Extract redundant utilities into independent modules inside `/packages/`.
- Ensure unit and syntax verification pipelines are robust and comprehensive.

### Key Milestones
- **Day 5:** Setup `packages/storage` extracting LocalStorage and IndexedDB keys.
- **Day 12:** Setup `packages/exports` centralizing CSV/JSON download formatting.
- **Day 20:** Fix unit testing suite to prevent scope crashes (Completed).
- **Day 30:** Extract styling tokens into `packages/ui` to align layouts.

---

## Phase 2: Days 31-60 — Monorepo Restructuring & Cockpit Convergence

### Goals
- Move large-scale standalone client applications to structured directories.
- Merge disconnected admin consoles into a single cockpit interface.

### Key Milestones
- **Day 35:** Initialize monorepo config (`package.json` workspaces setup).
- **Day 45:** Move `StudyOS` to `apps/studyos/` and setup path aliasing support.
- **Day 50:** Relocate `shared/VIA-COCKPIT.html` to `cockpit/index.html`.
- **Day 60:** Merge `balance-dashboard` and `game-command-center` as sub-sections in the Cockpit shell.

---

## Phase 3: Days 61-90 — Agent Enablement & Automation Ticks

### Goals
- Enable autonomous agents to securely query, trace, and self-improve tools.
- Configure pre-commit security gates and release pipelines.

### Key Milestones
- **Day 70:** Embed AI prompts in `packages/prompts` to separate styling from logic.
- **Day 80:** Activate `vault/traces/` capturing complete performance telemetry.
- **Day 85:** Configure pre-commit verification filters to lint and compile before pushes.
- **Day 90:** Establish telemetry trackers inside cockpit to plot credit savings.
