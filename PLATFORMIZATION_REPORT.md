# Platformization Report: decide.engine-tools

## Executive Summary
This report analyzes whether the repository is a collection of independent tools, a reusable engineering platform, or an autonomous ecosystem.

- **Verdict:** Currently, the repository operates as a **Collection of Independent Tools** mapped via a static registry (`tools-manifest.json`). It contains early primitives of a **Reusable Platform** (in `/shared/`), but is not yet an **Autonomous Ecosystem** due to lack of standard workspaces, automated self-fixing loops, unified data buses, and structured execution sandboxes.
- **Platformization Potential:** **9/10** — The pure JS/HTML zero-build design makes it exceptionally easy for AI agents to write, refactor, and run tools dynamically without compiler overhead.

---

## Architectural Scoring Dashboard

| Metric | Score | Status | Key Constraint |
|---|---|---|---|
| **Architecture Score** | 4/10 | ⚠️ Needs Restructuring | Flat directory layout, fragile relative paths |
| **Reuse Score** | 5/10 | 🟡 Partial | 30+ raw `localStorage` calls bypass wrapper |
| **Agent Readiness** | 7/10 | Green | Zero-build is ideal for AI; needs trace hooks |
| **Automation Score** | 6/10 | 🟡 Moderate | Has scaffolding scripts; needs CI validation |
| **Platformization Potential** | 9/10 | Excellent | High modularity, rapid instantiation |
| **World Class Readiness** | 3/10 | 🔴 Poor | Lacks monorepo workspaces and clean layers |

---

## Target State Blueprint

To achieve the platform target state, the repository must transition towards the following layout:

```
decide.engine-tools/
├── apps/                        # Sub-applications
│   ├── studyos/                 # StudyOS Workspace Client
│   ├── cockpit/                 # Operator Dashboard UI
│   └── tool-router/             # Main Hub Catalog App
├── packages/                    # Extracted Shared Modules
│   ├── reasoning/               # AI Engine & Prompt templates
│   ├── storage/                 # OPFS & LocalStorage wrapper
│   ├── exports/                 # CSV, JSON, and PDF writers
│   ├── prompts/                 # Prompt Alchemy library
│   ├── analytics/               # Metrics and progression calculations
│   ├── ui/                      # Design system tokens and shared elements
│   ├── agents/                  # Autonomous loops config
│   └── verification/            # Syntax and test runners
├── cockpit/                     # Unified mission control configurations
├── vault/                       # Trace archives and audit outputs
└── automation/                  # Git actions, scaffold scripts, and crons
```

---

## Strategic GAP Analysis

### 1. Structure Gap
- **Current:** Highly flat. Standalone apps like `StudyOS` live in the root, mixed with individual files (`opportunity-radar.html`) and categories.
- **Target:** Monorepo using `npm workspaces` or similar configurations. All applications live in `apps/` and all common modules live in `packages/`.

### 2. Reuse Gap
- **Current:** Common functionalities (exports, local storage, style primitives) are copy-pasted across tools.
- **Target:** Standard packages where tools do not copy-paste code but instead import unified libraries.

### 3. Agent Gap
- **Current:** Agents can write scripts, but there is no standardized vault for tracing execution prompts, reasoning, and metrics.
- **Target:** Structured logging and trace capture embedded in the execution lifecycle.
