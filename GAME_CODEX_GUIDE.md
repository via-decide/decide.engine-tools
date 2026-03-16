# Orchard Engine — Codex Integration Guide

> This file tells Codex exactly how to build game tools that integrate
> with existing tools and show correctly in the main hub UI.

## EXISTING TOOLS CODEX CAN USE (do not recreate these)

### State & Data
- `orchard_engine_player_state` — master player state in localStorage
- `orchard_engine_circle_state` — circle/clan state
- `orchard_engine_wallet` — currency balances
- `orchard_engine_live_events` — fetched event data
- `orchard_engine_active_skin` — current skin config

### Shared JS (load via script tag)
- `../../shared/tool-storage.js` — read/write localStorage safely
- `../../shared/engine-utils.js` — utility functions
- `../../shared/engine-models.js` — growth models
- `../../shared/simulation-utils.js` — RNG, archetypes

### CSS Variables (already defined in shared/shared.css)
```css
--color-soil-dark: #1A1614
--color-soil-light: #282320
--color-leaf-green: #52B756
--color-leaf-dark: #388E3C
--color-water-blue: #29B6F6
--color-mineral-gold: #FFCA28
--color-burn-red: #E53935
--color-text-main: #F5E6D3
--color-text-muted: #A18D82
```

## EVENT BUS (CustomEvents all tools use)

### Emit (dispatch)
```javascript
window.dispatchEvent(new CustomEvent('engine:session_complete', {
  detail: { dailyXP: 85, rootGrowth: 0.85, accuracy: 0.9, streak: 7 }
}));
```

### Listen (subscribe)
```javascript
window.addEventListener('engine:session_complete', (e) => {
  const { dailyXP, rootGrowth } = e.detail;
});
```

### All event names:
- `engine:session_complete` — daily swipe session finished
- `engine:season_reward` — season tier unlocked
- `engine:week_complete` — weekly race ended
- `engine:circle_joined` — player joined/created circle
- `engine:circle_rain_bonus` — 5+ circle members active same day
- `engine:seed_forged` — Layer 2 seed packaged
- `engine:event_modifier_applied` — live event modifier fired
- `engine:currency_spent` — wallet spend action
- `engine:crop_burn` — stress hit 100%
- `engine:pest_outbreak` — pest count spiked
- `engine:evolution` — root level increased
- `engine:day_advanced` — new day started

## HOW GAME TOOLS SHOW IN THE HUB

The main `index.html` checks `isEngineTool` in config.json.
- `"isEngineTool": false` → shows in general tools section
- `"isEngineTool": true` → hidden unless dev mode
- Game tools should use `"category": "engine"` and `"isEngineTool": false`
  if they are player-facing

## TOOL FOLDER PATTERN

Every game tool must have exactly:
```
tools/engine/<tool-name>/
  config.json   ← metadata
  index.html    ← standalone page
  tool.js       ← all JS logic
```

### config.json template for game tools:
```json
{
  "id": "tool-name",
  "name": "Human Name",
  "description": "One sentence.",
  "category": "engine",
  "isEngineTool": false,
  "entry": "tools/engine/tool-name/index.html",
  "relatedTools": ["growth-milestone-engine"],
  "tags": ["orchard-engine", "game", "standalone"]
}
```

### index.html template:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Tool Name — Orchard Engine</title>
  <link rel="stylesheet" href="../../../shared/shared.css"/>
  <style>/* tool-specific styles using CSS vars */</style>
</head>
<body>
  <main class="app">
    <header>
      <h1>Tool Name</h1>
      <p>Subtitle</p>
    </header>
    <!-- UI here -->
  </main>
  <script src="../../../shared/tool-storage.js"></script>
  <script src="tool.js"></script>
</body>
</html>
```

### tool.js must include:
```javascript
function hydrateState() {
  const raw = localStorage.getItem('orchard_engine_player_state');
  const defaults = { day:1, credits:60, rootStrength:0, water:30, nutrients:100, stress:0, pests:0 };
  try { return raw ? { ...defaults, ...JSON.parse(raw) } : defaults; }
  catch { return defaults; }
}

function syncState(state) {
  localStorage.setItem('orchard_engine_player_state', JSON.stringify(state));
}

function emitEvent(name, data) {
  window.dispatchEvent(new CustomEvent(name, { detail: data }));
}
```

## CURRENTLY MISSING GAME TOOLS (build these)

These were designed but never built. Codex should build them in order:

1. `layer1-swipe-crucible` — daily swipe card game (HIGHEST PRIORITY)
2. `season-engine` — 30-day season + daily weather
3. `circle-manager` — clan system
4. `reward-wallet` — 3-currency wallet
5. `live-event-engine` — polls live-events.json
6. `server-tournament` — global leaderboard
7. `server-boss-engine` — collective boss fights
8. `skin-engine` — theme switcher
9. `engine-rule-generator` — admin variable dashboard
10. `layer2-seed-packager` — forge shareable seeds

## CODEX CONSTRAINTS (enforce always)

- Edit only the tool's own folder
- Do NOT touch: router.js, shared/tool-registry.js, shared/tool-graph.js, index.html, README.md
- Run `node --check tool.js` before committing
- No frameworks, no npm, no build step
- All state in localStorage
- All cross-tool communication via CustomEvent
