Branch: simba/add-biasprism-as-a-single-file-tool-at-toolsengi
Title: Add BiasPrism as a single-file tool at tools/engine/bias-prism/index....

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add BiasPrism as a single-file tool at tools/engine/bias-prism/index.html. BiasPrism is a "Cognitive Linter" for text. When an AI agent generates a report or reads a webpage, this tool scans the text for emotional manipulation, logical fallacies, and extreme polarity, stripping away the noise to leave only objective facts. IMPLEMENTATION REQUIREMENTS: 1. SINGLE FILE - tools/engine/bias-prism/index.html - Build a two-pane UI: "Raw Input" (Left) and "Objective Output" (Right). 2. TEXT HIGHLIGHTING LOGIC - Write a Vanilla JS text-parsing function that uses regex dictionaries to find: * Emotionally Charged Words (e.g., "destroyed", "shocking", "outrageous") -> Highlight Red. * Sweeping Generalizations (e.g., "always", "never", "everyone") -> Highlight Yellow. * Hedge Words (e.g., "might", "possibly", "experts say" without naming them) -> Highlight Purple. - The Right Pane ("Objective Output") automatically generates a version of the text with these flagged words redacted or replaced by neutral brackets [subjective claim removed]. 3. THE OBJECTIVITY SCORE (Persistence) Use localStorage key "bias_prism_stats" to persist: { totalDocumentsScanned, averageObjectivityScore, fallaciesCaught } Update and save after every scan. 4. MANIFEST ENTRY { "id": "bias-prism", "name": "BiasPrism", "title": "Cognitive Linter", "path": "tools/engine/bias-prism/index.html", "tags": ["research", "bias", "linter", "text-analysis"], "tier": "engine", "icon": "👁️🗨️", "sparks": false } 5. COMMANDROUTER ALIASES In shared/commandRouter.js add: "biasprism", "linter", "objective", "scan" Route to tools/engine/bias-prism/index.html. 6. HUD ADDITIONS

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.