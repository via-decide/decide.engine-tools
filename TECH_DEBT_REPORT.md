# Technical Debt Report

Generated at: 2026-06-09T00:02:05.662Z

## Summary Dashboard

- **Debt Health Score:** 15 (Lower is better)
- **TODO / FIXME Flags:** 0
- **Unsafe `eval()` Statements:** 0
- **Silent/Empty Catch Blocks:** 5
- **Duplicate Code Patterns:** 0

## Unsafe Evals (`eval()`) Detail

✅ No eval() statements found.

## Silent Catch Blocks Detail

| File | Line | Block Context |
|---|---|---|
| `StudyOS/sw.js` | 64 | `catch (_) { // Optional dependency; ignore fetch errors for non-existent files. }` |
| `shared/workflow-ui.js` | 204 | `catch (_error) { // no-op }` |
| `tools/engine/ai-game-strategy-advisor/tool.js` | 20 | `catch (e) { /* fall through */ }` |
| `tools/engine/seed-quality-scorer/tool.js` | 305 | `catch (error) { // Storage may be blocked by browser settings; keep runtime state alive. }` |
| `tools/shared/workflow-ui.js` | 204 | `catch (_error) { // no-op }` |

## Duplicate Code Block Sequences

✅ No matching duplicate blocks found.

## TODO / FIXME Backlog

✅ Clean backlog. No TODOs found.

