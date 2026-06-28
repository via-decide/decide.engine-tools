# Technical Debt Report

Generated at: 2026-06-28T17:28:44.145Z

## Summary Dashboard

- **Debt Health Score:** 419 (Lower is better)
- **TODO / FIXME Flags:** 0
- **Unsafe `eval()` Statements:** 32
- **Silent/Empty Catch Blocks:** 33
- **Duplicate Code Patterns:** 0

## Unsafe Evals (`eval()`) Detail

| File | Line | Snippet |
|---|---|---|
| `apps/cockpit/missions/planner (1).js` | 88 | `content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;` |
| `apps/cockpit/missions/planner.js` | 88 | `content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;` |
| `apps/cockpit/missions/scanner (1).js` | 270 | `report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;` |
| `apps/cockpit/missions/scanner (1).js` | 274 | `report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;` |
| `apps/cockpit/missions/scanner (1).js` | 276 | `report += `✅ No eval() statements found.\n\n`;` |
| `apps/cockpit/missions/scanner.js` | 274 | `report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;` |
| `apps/cockpit/missions/scanner.js` | 278 | `report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;` |
| `apps/cockpit/missions/scanner.js` | 280 | `report += `✅ No eval() statements found.\n\n`;` |
| `bundle-forge/bundle-validator.js` | 6 | `'eval(',` |
| `bundle-forge (1)/bundle-validator.js` | 6 | `'eval(',` |
| `packages/agents/antigravity-code/agent-loop.js` | 121 | `issue: `Replace unsafe eval() in ${item.file}:${item.line}`,` |
| `packages/agents/antigravity-code/improvement-planner.js` | 88 | `content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;` |
| `packages/agents/antigravity-code/repo-scanner.js` | 270 | `report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;` |
| `packages/agents/antigravity-code/repo-scanner.js` | 274 | `report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;` |
| `packages/agents/antigravity-code/repo-scanner.js` | 276 | `report += `✅ No eval() statements found.\n\n`;` |
| `packages (1)/agents/antigravity-code/agent-loop.js` | 121 | `issue: `Replace unsafe eval() in ${item.file}:${item.line}`,` |
| `packages (1)/agents/antigravity-code/improvement-planner.js` | 88 | `content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;` |
| `packages (1)/agents/antigravity-code/repo-scanner.js` | 270 | `report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;` |
| `packages (1)/agents/antigravity-code/repo-scanner.js` | 274 | `report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;` |
| `packages (1)/agents/antigravity-code/repo-scanner.js` | 276 | `report += `✅ No eval() statements found.\n\n`;` |
| `tests/unit/ai-simulation-pipeline (1).test.js` | 19 | `eval(sandboxed);` |
| `tests/unit/ai-simulation-pipeline.test.js` | 19 | `eval(sandboxed);` |
| `tests/unit/ai-world-pipeline (1).test.js` | 30 | `eval(sandboxed);` |
| `tests/unit/ai-world-pipeline.test.js` | 30 | `eval(sandboxed);` |
| `tests/unit/dax-bundle-forge (1).test.js` | 13 | `eval(sandboxed);` |
| `tests/unit/dax-bundle-forge (1).test.js` | 58 | `unsafeBundle.pages = [{ template: '<script>eval(1)</script>' }];` |
| `tests/unit/dax-bundle-forge.test.js` | 13 | `eval(sandboxed);` |
| `tests/unit/dax-bundle-forge.test.js` | 58 | `unsafeBundle.pages = [{ template: '<script>eval(1)</script>' }];` |
| `tests/unit/security-scan-executor (1).test.js` | 21 | `fs.writeFileSync(path.join(repo, 'src/eval.js'), "eval('2+2'); new Function('a','return a');\n");` |
| `tests/unit/security-scan-executor.test.js` | 21 | `fs.writeFileSync(path.join(repo, 'src/eval.js'), "eval('2+2'); new Function('a','return a');\n");` |
| `tests/unit/simulation-marketplace (1).test.js` | 20 | `eval(sandboxed);` |
| `tests/unit/simulation-marketplace.test.js` | 20 | `eval(sandboxed);` |

## Silent Catch Blocks Detail

| File | Line | Block Context |
|---|---|---|
| `StudyOS/services/summary_engine.ts` | 15 | `catch (_) { // graceful fallback below }` |
| `StudyOS/services/zayvora_reasoning.ts` | 42 | `catch (_) { // fallback below }` |
| `StudyOS/sw.js` | 64 | `catch (_) { // Optional dependency; ignore fetch errors for non-existent files. }` |
| `StudyOS (1)/storage.js` | 142 | `catch(__e) {}` |
| `StudyOS (1)/sw.js` | 64 | `catch (_) { // Optional dependency; ignore fetch errors for non-existent files. }` |
| `StudyOS (1)/trail-module.html` | 1109 | `catch(__e) {}` |
| `StudyOS (1)/trail-module.html` | 1116 | `catch(__e) {}` |
| `apps/cockpit/missions/scanner (1).js` | 109 | `catch (e) { // Silent catch on read failure }` |
| `apps/cockpit/missions/scanner (1).js` | 178 | `catch (e) { // Silent catch on read failure }` |
| `apps/cockpit/missions/scanner.js` | 113 | `catch (e) { // Silent catch on read failure }` |
| `apps/cockpit/missions/scanner.js` | 182 | `catch (e) { // Silent catch on read failure }` |
| `apps/studyos/services/summary_engine.ts` | 15 | `catch (_) { // graceful fallback below }` |
| `apps/studyos/services/zayvora_reasoning.ts` | 42 | `catch (_) { // fallback below }` |
| `apps/studyos/sw.js` | 64 | `catch (_) { // Optional dependency; ignore fetch errors for non-existent files. }` |
| `apps/studyos (1)/services/summary_engine.ts` | 15 | `catch (_) { // graceful fallback below }` |
| `apps/studyos (1)/services/zayvora_reasoning.ts` | 42 | `catch (_) { // fallback below }` |
| `apps/studyos (1)/sw.js` | 64 | `catch (_) { // Optional dependency; ignore fetch errors for non-existent files. }` |
| `audit/tests/plugin.lifecycle.test.js` | 37 | `catch (_err) { // expected }` |
| `audit (1)/tests/plugin.lifecycle.test.js` | 37 | `catch (_err) { // expected }` |
| `cockpit/index.html` | 154 | `catch(e) {}` |
| `cockpit/index.html` | 254 | `catch(e) {}` |
| `core/sandbox.js` | 265 | `catch(err) { /* Ignore if already non-configurable */ }` |
| `core (1)/sandbox.js` | 265 | `catch(err) { /* Ignore if already non-configurable */ }` |
| `highway-v2i-lab/simulation/event-engine.js` | 25 | `catch (error) { /* no-op */ }` |
| `highway-v2i-lab (1)/simulation/event-engine.js` | 25 | `catch (error) { /* no-op */ }` |
| `packages/agents/antigravity-code/repo-scanner.js` | 109 | `catch (e) { // Silent catch on read failure }` |
| `packages/agents/antigravity-code/repo-scanner.js` | 178 | `catch (e) { // Silent catch on read failure }` |
| `packages (1)/agents/antigravity-code/repo-scanner.js` | 109 | `catch (e) { // Silent catch on read failure }` |
| `packages (1)/agents/antigravity-code/repo-scanner.js` | 178 | `catch (e) { // Silent catch on read failure }` |
| `shared/workflow-ui.js` | 204 | `catch (_error) { // no-op }` |
| `tools/engine/ai-game-strategy-advisor/tool.js` | 20 | `catch (e) { /* fall through */ }` |
| `tools/engine/seed-quality-scorer/tool.js` | 305 | `catch (error) { // Storage may be blocked by browser settings; keep runtime state alive. }` |
| `tools/shared/workflow-ui.js` | 204 | `catch (_error) { // no-op }` |

## Duplicate Code Block Sequences

✅ No matching duplicate blocks found.

## TODO / FIXME Backlog

✅ Clean backlog. No TODOs found.

