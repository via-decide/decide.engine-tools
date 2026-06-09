# Technical Debt Report

Generated at: 2026-06-09T00:21:04.304Z

## Summary Dashboard

- **Debt Health Score:** 61 (Lower is better)
- **TODO / FIXME Flags:** 0
- **Unsafe `eval()` Statements:** 4
- **Silent/Empty Catch Blocks:** 7
- **Duplicate Code Patterns:** 0

## Unsafe Evals (`eval()`) Detail

| File | Line | Snippet |
|---|---|---|
| `cockpit/missions/planner.js` | 88 | `content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;` |
| `cockpit/missions/scanner.js` | 270 | `report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;` |
| `cockpit/missions/scanner.js` | 274 | `report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;` |
| `cockpit/missions/scanner.js` | 276 | `report += `✅ No eval() statements found.\n\n`;` |

## Silent Catch Blocks Detail

| File | Line | Block Context |
|---|---|---|
| `StudyOS/sw.js` | 64 | `catch (_) { // Optional dependency; ignore fetch errors for non-existent files. }` |
| `cockpit/missions/scanner.js` | 109 | `catch (e) { // Silent catch on read failure }` |
| `cockpit/missions/scanner.js` | 178 | `catch (e) { // Silent catch on read failure }` |
| `shared/workflow-ui.js` | 204 | `catch (_error) { // no-op }` |
| `tools/engine/ai-game-strategy-advisor/tool.js` | 20 | `catch (e) { /* fall through */ }` |
| `tools/engine/seed-quality-scorer/tool.js` | 305 | `catch (error) { // Storage may be blocked by browser settings; keep runtime state alive. }` |
| `tools/shared/workflow-ui.js` | 204 | `catch (_error) { // no-op }` |

## Duplicate Code Block Sequences

✅ No matching duplicate blocks found.

## TODO / FIXME Backlog

✅ Clean backlog. No TODOs found.

