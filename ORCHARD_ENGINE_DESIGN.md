# Orchard Engine Design

## Vision

Orchard Engine is a merit-based farming-career game where players grow through consistency, quality, learning depth, and completed outputs. It is explicitly non-pay-to-win.

## 3 Layers

1. **Farm** (active in Wave 1)
2. **Commons** (deferred)
3. **Market** (deferred)

## Layer 1 Focus

Wave 1 implements the first playable farm loop:

- create player identity,
- build orchard profile structure,
- initialize starter farm,
- grow roots and trunk,
- convert work into fruits,
- run daily/weekly/monthly progression checks,
- produce fair ranking scores without pure volume bias.

## Metaphor Dictionary

- roots = fundamentals
- trunk = depth
- branches = specialization
- leaves = activity
- fruits = completed outputs
- seeds = reusable knowledge
- water = consistency / energy
- minerals = rare insight resources
- soil = environment quality
- sunlight = opportunity exposure

## Player Loop

1. Sign up and choose starter archetype.
2. Generate starter farm state.
3. Build orchard profile (roots/trunk/branches/leaves/fruits/seeds).
4. Complete daily quests and produce fruit outputs.
5. Review weekly harvest score.
6. Evaluate 30-day promotion readiness.
7. Track fair rank with anti-spam controls.

## Resource Model

Wave 1 resources:

- roots score,
- trunk score,
- fruits produced,
- water consistency,
- minerals,
- soil quality,
- sunlight exposure.

## Ranking Logic

Fair ranking weights:

- consistency,
- quality,
- effort depth,
- improvement trend,
- bounded volume contribution.

Includes anti-spam penalties and avoids pure volume advantage.

## Promotion Logic

30-day promotion evaluates:

- root strength,
- trunk growth,
- fruit completion,
- consistency,
- integrity checks (spam flags).

Outputs one of:

- eligible,
- nearly eligible,
- not eligible.

## Entity Model

Wave 1 entities:

- Player
- OrchardProfile
- FarmState
- Quest
- FruitOutput
- WeeklyHarvest
- PromotionReview
- FairRankSnapshot

## Anti-Abuse Rules

- no pay-to-win fields,
- no direct spend-based boosts,
- anti-volume caps in ranking,
- spam flags reduce promotion readiness,
- shallow completion patterns are down-weighted.

## Open Questions

- How should branch specialization weighting evolve after Wave 1?
- What signals should carry from Farm into Commons trust later?
- Should promotion thresholds adapt by archetype?
- How to expose fairness rationale clearly to players?
