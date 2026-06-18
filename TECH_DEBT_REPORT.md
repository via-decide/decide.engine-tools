# Technical Debt Report

Generated at: 2026-06-09T00:41:42.552Z

## Summary Dashboard

- **Debt Health Score:** 202 (Lower is better)
- **TODO / FIXME Flags:** 0
- **Unsafe `eval()` Statements:** 16
- **Silent/Empty Catch Blocks:** 14
- **Duplicate Code Patterns:** 0

## Unsafe Evals (`eval()`) Detail

| File | Line | Snippet |
|---|---|---|
| `apps/cockpit/missions/planner.js` | 88 | `content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;` |
| `apps/cockpit/missions/scanner.js` | 270 | `report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;` |
| `apps/cockpit/missions/scanner.js` | 274 | `report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;` |
| `apps/cockpit/missions/scanner.js` | 276 | `report += `✅ No eval() statements found.\n\n`;` |
| `bundle-forge/bundle-validator.js` | 6 | `'eval(',` |
| `packages/agents/antigravity-code/agent-loop.js` | 121 | `issue: `Replace unsafe eval() in ${item.file}:${item.line}`,` |
| `packages/agents/antigravity-code/improvement-planner.js` | 88 | `content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;` |
| `packages/agents/antigravity-code/repo-scanner.js` | 270 | `report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;` |
| `packages/agents/antigravity-code/repo-scanner.js` | 274 | `report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;` |
| `packages/agents/antigravity-code/repo-scanner.js` | 276 | `report += `✅ No eval() statements found.\n\n`;` |
| `tests/unit/ai-simulation-pipeline.test.js` | 19 | `eval(sandboxed);` |
| `tests/unit/ai-world-pipeline.test.js` | 30 | `eval(sandboxed);` |
| `tests/unit/dax-bundle-forge.test.js` | 13 | `eval(sandboxed);` |
| `tests/unit/dax-bundle-forge.test.js` | 58 | `unsafeBundle.pages = [{ template: '<script>eval(1)</script>' }];` |
| `tests/unit/security-scan-executor.test.js` | 21 | `fs.writeFileSync(path.join(repo, 'src/eval.js'), "eval('2+2'); new Function('a','return a');\n");` |
| `tests/unit/simulation-marketplace.test.js` | 20 | `eval(sandboxed);` |

## Silent Catch Blocks Detail

| File | Line | Block Context |
|---|---|---|
| `apps/cockpit/missions/scanner.js` | 109 | `catch (e) { // Silent catch on read failure }` |
| `apps/cockpit/missions/scanner.js` | 178 | `catch (e) { // Silent catch on read failure }` |
| `apps/studyos/services/summary_engine.ts` | 15 | `catch (_) { // graceful fallback below }` |
| `apps/studyos/services/zayvora_reasoning.ts` | 42 | `catch (_) { // fallback below }` |
| `apps/studyos/sw.js` | 64 | `catch (_) { // Optional dependency; ignore fetch errors for non-existent files. }` |
| `audit/tests/plugin.lifecycle.test.js` | 37 | `catch (_err) { // expected }` |
| `core/sandbox.js` | 265 | `catch(err) { /* Ignore if already non-configurable */ }` |
| `highway-v2i-lab/simulation/event-engine.js` | 25 | `catch (error) { /* no-op */ }` |
| `packages/agents/antigravity-code/repo-scanner.js` | 109 | `catch (e) { // Silent catch on read failure }` |
| `packages/agents/antigravity-code/repo-scanner.js` | 178 | `catch (e) { // Silent catch on read failure }` |
| `shared/workflow-ui.js` | 204 | `catch (_error) { // no-op }` |
| `tools/engine/ai-game-strategy-advisor/tool.js` | 20 | `catch (e) { /* fall through */ }` |
| `tools/engine/seed-quality-scorer/tool.js` | 305 | `catch (error) { // Storage may be blocked by browser settings; keep runtime state alive. }` |
| `tools/shared/workflow-ui.js` | 204 | `catch (_error) { // no-op }` |

## Duplicate Code Block Sequences

✅ No matching duplicate blocks found.

## TODO / FIXME Backlog

✅ Clean backlog. No TODOs found.

