# Orchard Engine Design

## Vision

Orchard Engine is a merit-based farming-career game where growth is earned through consistency, quality, trust, and contribution. It is explicitly non-pay-to-win.

## 3 Layers

1. **Farm**: Player-level progression through daily/weekly/monthly growth loops.
2. **Commons**: Social trust layer for seed exchange, fruit sharing, circles, and peer validation.
3. **Market**: Recruiter-facing discovery and readiness scoring.

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

1. Join and get archetype + starter orchard.
2. Run daily quests and ship fruit outputs.
3. Share seeds/fruits in circles.
4. Receive peer validation and improve trust.
5. Harvest weekly and evaluate monthly promotion.
6. Improve profile visibility in market layer.

## Resource Model

Primary resources include water, minerals, soil quality, sunlight exposure, roots score, trunk score, fruits count, and seeds count.

## Ranking Logic

Ranking combines:

- consistency,
- quality,
- originality,
- peer usefulness,
- improvement trend.

Volume alone is insufficient to avoid spam-centric leaderboard behavior.

## Promotion Logic

Promotions are evaluated on 30-day windows using weighted merit signals and trust constraints.

## Four-Direction AI Pipeline

Inputs are structured as:

- player state,
- environment state,
- resource state,
- growth target.

AI output is advisory-only and decoupled from critical ranking/promotion writes.

## Entity Model

Core entities:

- Player
- OrchardProfile
- FarmState
- Quest
- Harvest
- PromotionReview
- Circle
- Validation
- TrustScore
- RecruiterView

## Anti-Abuse Rules

- no pay-to-win boosts,
- no pure volume ranking,
- suspicious reciprocity lowers trust confidence,
- repeated low-signal sharing is down-weighted,
- promotion requires minimum trust + consistency thresholds.

## Recruiter Layer

Recruiters browse read-optimized orchard summaries containing growth history, validated contribution, and hire readiness signals.

## Open Questions

- How to tune fairness weights across different archetypes?
- How to detect collusion rings without over-penalizing legitimate circles?
- What public/private boundary should trust traces expose to recruiters?
- Should promotion ladders differ by branch specialization?
