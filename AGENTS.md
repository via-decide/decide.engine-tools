# AGENTS.md — ViaDecide Studio
## Rules for all AI coding agents working in this repository

---

## IDENTITY

This is a **production codebase** for a $199/month subscription product on the Play Store.
Every change you make affects paying subscribers.
Treat it accordingly.

---

## HARD GATE 1 — DESIGN BEFORE CODE

<HARD-GATE>
You MUST NOT write, modify, or scaffold any tool code until you have:
1. Read the existing relevant files in full
2. Presented a written design (even 3 sentences for simple tasks)
3. Received explicit approval from Via

This applies to EVERY task. No exceptions for "simple" changes.
</HARD-GATE>

---

## HARD GATE 2 — USE EXISTING TOOLS FIRST

<HARD-GATE>
Before creating any new file, you MUST check if an existing tool or shared utility already solves the problem.

Check in this order:
1. `shared/` — ToolStorage, ToolBridge, EngineUtils, EngineBalance, EngineModels
2. `shared/tool-registry.js` — tool discovery, category mapping
3. `shared/agent-layer.js`, `agent-runtime.js` — agent execution
4. `tools/` — existing tools that can be extended vs duplicated
5. `router.js` — routing logic already handles 44 tools

If an existing file covers 70%+ of your need: extend it, do not duplicate it.
</HARD-GATE>

---

## HARD GATE 3 — TESTS BEFORE SHIPPING

<HARD-GATE>
Any new tool or modification to an existing tool MUST have a corresponding test before you commit.

- New shared utility → unit test in `tests/unit/`
- New tool → smoke test entry in `tests/smoke/tools.smoke.js`
- Bug fix → regression test that proves the bug is gone

Run `npm test` before every commit. If tests fail, fix them — do not skip.
</HARD-GATE>

---

## HARD GATE 4 — CHANGELOG ENTRY REQUIRED

<HARD-GATE>
Every commit that changes tool behavior, adds a feature, or fixes a bug MUST include
a corresponding entry in `CHANGELOG.md` under an `[Unreleased]` section.

Format:
```
## [Unreleased]
### Added
- Brief description of what was added

### Fixed
- Brief description of what was fixed
```
</HARD-GATE>

---

## PRESERVATION RULES (unchanged from before)

1. Never delete tool folders
2. Never remove working code from tools
3. Never replace a tool with a placeholder
4. Prefer additive changes
5. Tools must remain standalone HTML apps
6. Routing must never break existing tools
7. If reorganizing tools, move them safely and update all references in `router.js` and `tools-manifest.json`

---

## SHARED UTILITIES — USE THESE, DON'T REWRITE THEM

| File | Exposes | Use For |
|------|---------|---------|
| `shared/tool-registry.js` | `ToolRegistry` | Tool discovery, category lookup |
| `shared/tool-storage.js` | `ToolStorage` | localStorage read/write (namespaced) |
| `shared/tool-bridge.js` | `ToolBridge` | Cross-tool postMessage + localStorage |
| `shared/tool-bus.js` | `ToolBus` | Event pub/sub between tools |
| `shared/engine-utils.js` | `EngineUtils` | `clamp()`, `weightedScore()`, `tryParse()` |
| `shared/engine-models.js` | `EngineModels` | Engine calculation models |
| `shared/engine-balance.js` | `EngineBalance` | Wave 1 balance analysis |
| `shared/vd-auth.js` | `window._VD_AUTH` | Firebase Auth (Google Sign-In) |
| `shared/vd-wallet.js` | `VDWallet` | User wallet / credits |
| `shared/progression-engine.js` | `ProgressionEngine` | Player level/XP logic |
| `shared/workflow-engine.js` | `WorkflowEngine` | Step-based workflow runner |
| `shared/agent-runtime.js` | `AgentRuntime` | Agent execution |

---

## COMMIT MESSAGE FORMAT

```
type(scope): short description

feat(tools): add new productivity tool
fix(router): correct path for json-formatter
test(smoke): add snake-game load test
docs(changelog): add v1.0.1 entries
chore(version): bump to 1.0.1
```

Types: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`
Scope: `tools`, `router`, `shared`, `games`, `engine`, `auth`, `smoke`, `unit`
