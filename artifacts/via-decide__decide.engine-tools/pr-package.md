Branch: simba/implement-a-lightweight-headless-dom-testing-san
Title: Implement a lightweight, headless DOM testing sandbox for autonomous ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Allow antigravity to write a tool, write a test file, run the test in the terminal, read the error logs, and fix its own bugs before completing the task.
Branch: simba/build-the-via-diagnostic-cli-tool-to-automatical
Title: Build the via-diagnostic CLI tool to automatically verify the integri...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Give the agent a 1-second sanity check. After applying a unified diff patch to 10 files, the agent runs the diagnostic to guarantee it didn't accidentally break routing or delete a config file.
Branch: simba/create-the-event-schema-registryjson-as-the-ulti
Title: Create the event-schema-registry.json as the ultimate reference contr...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a strict "compiler-like" error interface. If the AI hallucinates a payload structure, the validator instantly catches it and tells the AI exactly which field was wrong.
Branch: simba/build-the-mocksynthesizer-to-provide-determinist
Title: Build the MockSynthesizer to provide deterministic reference data for...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a static, 0-token-cost reference file so antigravity can inject perfect mock data into any new tool it builds, ensuring UI tests don't fail due to missing variables.
Branch: simba/enforce-a-unified-diff-output-protocol-for-the-g
Title: Enforce a Unified Diff output protocol for the Genesis Compiler / AI ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Reduce output token costs by 95% on iterative updates. If a file is 500 lines, modifying a button should only cost 20 output tokens, not 520 tokens.
Branch: simba/build-the-meta-compressor-to-extract-only-functi
Title: Build the meta-compressor to extract only function signatures from th...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Instead of passing 10,000 tokens of shared files to Claude to give it context, I will pass this 500-token .via-metadata map. Claude will instantly know exactly how to call every backend function without reading how it works.
Branch: simba/build-the-via-scaffold-cli-utility-to-eliminate-
Title: Build the via-scaffold CLI utility to eliminate boilerplate token gen...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: When I ask Claude to build a tool, I will run the scaffolder first. Claude will only need to write the 50 lines of unique logic inside tool.js, saving thousands of output tokens per feature.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.