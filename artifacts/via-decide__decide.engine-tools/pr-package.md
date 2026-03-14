Branch: simba/in-toolsenginegrowth-milestone-enginetooljs-only
Title: in tools/engine/growth-milestone-engine/tool.js only - add a paused f...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: animate loop pauses when tab is hidden; event listeners never duplicate; zero shared file changes
Branch: simba/rewrite-toolsenginestarter-farm-generatortooljs-
Title: rewrite tools/engine/starter-farm-generator/tool.js to add hydrateSta...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: starter-farm-generator reads and writes orchard_engine_player_state, emits engine events, and blocks invalid actions
Branch: simba/rewrite-toolsenginedaily-quest-generatortooljs-t
Title: rewrite tools/engine/daily-quest-generator/tool.js to add hydrateStat...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: daily-quest-generator syncs with orchard master state and emits quest events
Branch: simba/rewrite-toolsengineseed-exchangetooljs-to-add-hy
Title: rewrite tools/engine/seed-exchange/tool.js to add hydrateState() pull...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: seed-exchange syncs with orchard master state, emits exchange events, blocks zero-credit actions
Branch: simba/rewrite-toolsengineseed-exchangetooljs-only---re
Title: rewrite tools/engine/seed-exchange/tool.js only - replace generic stu...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: seed-exchange syncs orchard state and blocks zero-credit actions; no shared file changes
Branch: simba/in-toolsenginegrowth-milestone-enginetooljs-fix-
Title: in tools/engine/growth-milestone-engine/tool.js fix the animate3D fun...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: animate loop pauses on tab switch; event listeners never stack

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.