Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Create tools/engine/root-challenge-view/. Build a player-facing UI for the "Root Challenge". Focus the visual hierarchy on "Root Strength" gain over the current week. Render a line chart or visual growth indicator comparing the player's local root progression against a simulated average competitor score. Read state from server-tournament-engine.
Create tools/engine/harvest-race-view/. Build a player-facing UI specific to the "Harvest Race" tournament. Display a simulated global leaderboard reading from orchard_engine_mock_leaderboard. Emphasize the player's current "Fruit Output" metric. Provide real-time UI feedback (progress bars, rank changes) by listening to updates from the server-tournament-engine.
Create tools/engine/skin-selector-ui/. Build a player-facing gallery UI displaying the 5 defined skins (Space Colony, Dojo, Kitchen, Scholar, Street Food). Read orchard_engine_owned_skins to determine state. For owned skins, show an "Equip" button that updates orchard_engine_active_skin and dispatches engine:skin_changed. For unowned skins, show a "Unlock (X Gems)" button that interfaces with the skin-pack-manager. Display visual previews of the color palettes and term changes for each skin.
Create tools/engine/skin-pack-manager/. Build a headless Vanilla JS utility that manages skin ownership. Initialize a default array in localStorage.getItem('orchard_engine_owned_skins') containing only the base farming skin. Implement functions to check if a skin is owned and a function to purchase a skin, which deducts 'Harvest Gems' via localStorage and adds the skin ID to the owned array. Dispatch engine:skin_unlocked on successful purchase.
Create tools/engine/skin-engine/. Build a foundational Vanilla JS script that runs on initialization. It must read localStorage.getItem('orchard_engine_active_skin') (defaulting to the farming theme). The script must select all DOM elements with specific data-skin-label attributes (e.g., data-skin-label="roots") and update their innerText based on the active skin's dictionary. It must also remap the root CSS variables (--color-soil-dark, etc.) to the active skin's palette by applying styles to the document.documentElement. Listen for engine:skin_changed to trigger a re-render.
Create tools/engine/event-notification-hub/. Build a player-facing UI panel that reads orchard_engine_scheduled_events and displays a tabbed inbox: "Active", "Upcoming", and "Completed". Listen for engine:tournament_started, engine:boss_defeated, etc., to render visual alerts. Use a clean, list-based layout with countdown timers for active events.
Create tools/engine/live-event-scheduler/. Build a Vanilla JS admin dashboard to manage scheduled server events. UI should allow creating entries for Tournaments and Bosses with fields: id, type, startTime, endTime, reward, and targetGoal. The tool must save an array of these objects to localStorage.getItem('orchard_engine_scheduled_events') and dispatch window.dispatchEvent(new CustomEvent('engine:events_updated')) when changes are saved.
Create tools/engine/server-tournament-engine/. Build a headless Vanilla JS logic controller that listens for engine:events_updated and polls the current time. If an event of type 'tournament' is active (Harvest Race, Root Challenge, Seed Auction, Pest Hunt, Water Trial), it reads local player progression via localStorage.getItem('orchard_engine_player_state') and simulates submitting scores to a mock global leaderboard (localStorage.getItem('orchard_engine_mock_leaderboard')). Dispatch engine:tournament_started and engine:tournament_ended (with payload {rank, reward}).
Create tools/engine/server-boss-engine/. Build a headless Vanilla JS logic controller handling collective challenges (The Blight, The Drought, Locust King, The Frost). It must listen for player action events (e.g., engine:research_completed, engine:pest_cleared) and incrementally update a mock global progress counter stored in localStorage.getItem('orchard_engine_boss_progress'). It must evaluate if the targetGoal from the active event is reached within the timeframe and dispatch engine:boss_defeated or engine:boss_failed.
Add a new standalone tool called memory-match in tools/games/memory-match/. Title: "Memory Match". Description: "Card flip memory game with scoring and timer.". Category: "games". The tool must contain: config.json, index.html, tool.js. The game must run in browser, use vanilla JS, have simple UI, no external frameworks. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.
Add a new standalone tool called pricing-calculator in tools/pricing-calculator/. Title: "Pricing Calculator". Description: "Compare pricing models: freemium, tiered, usage-based.". Category: "business". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.
Add a new standalone tool called okr-planner in tools/okr-planner/. Title: "OKR Planner". Description: "Define objectives and key results with progress tracking.". Category: "business". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.
Add a new standalone tool called swot-analyzer in tools/swot-analyzer/. Title: "SWOT Analyzer". Description: "Structured SWOT analysis with export.". Category: "business". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.
Create candidate-comparison-view tool in tools/engine/candidate-comparison-view/ with config.json, index.html, tool.js. Enables recruiters to select multiple players and visually compare their root fundamentals, branch depth, trust scores, and fruit yields side-by-side. Vanilla JS, standalone UI.
Integrate GSAP (GreenSock) via CDN into _assets/js/magnetic-buttons.js. Rewrite the "Magnetic Button" logic to use GSAP's gsap.to() for buttery-smooth spring physics instead of native CSS transitions. Also, create a GSAP timeline function to trigger the "Shimmering Text" and "Glowing Border" evolution alerts in the growth-milestone-engine.
Integrate vanilla-tilt.js via CDN into the root index.html. Apply the data-tilt attribute and initialize the tilt physics on all .orchard-panel game cards in the Bento Grid. Configure it for a subtle 3D glare effect (data-tilt-glare="true") to enhance the glassmorphism look when the user hovers over the games.
Create _assets/js/engine-bus.js. This is the central wiring hub. Create a global window.OrchardBus object with .on(event, callback) and .emit(event, payload) methods (wrapping standard CustomEvents). Update the new router to automatically clear specific tool listeners when navigating away to prevent memory leaks, while keeping core state listeners alive.
Update orchard-router.js and global-theme.css to add view transitions. Before injecting new HTML into #game-stage, apply a CSS class .fade-out-scale to the old content. Wait for the transition duration, swap the innerHTML, and apply .fade-in-scale to the new content. If the browser supports the native document.startViewTransition() API, use that as the primary method for buttery smooth, morphing transitions between tools.
Create a new core script _assets/js/orchard-router.js. Implement a Vanilla JS SPA router that intercepts all <a href> clicks to internal tools. Prevent default navigation. Instead, use fetch() to get the target HTML, parse it, extract the contents of the .orchard-panel or main container, and inject it into a central <main id="game-stage"> in the root index.html. Execute any accompanying <script> tags safely.

RULES
1. Audit touched files first and identify regressions.
2. Preserve architecture and naming conventions.
3. Make minimal repairs only; do not expand scope.
4. Re-run checks and provide concise root-cause notes.
5. Return complete contents for changed files only.

REPO CONTEXT
- README snippet:
# Decide Engine Tools + Orchard Engine Foundation

This repository is a preservation-first browser-native tool mesh by **ViaDecide**.

It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career game system.

## Preservation-first policy

- Existing standalone tools are preserved.
- New systems are additive.
- No unrelated folder is deleted or replaced.
- Tools remain standalone HTML/CSS/JS.

## Tool categories

Tools are organized into 9 categories. The index page at `index.html` renders them grouped automatically from registry metadata.

| Category | Tools |
|---|---|
| **Creators** | PromptAlchemy, Script Generator |
| **Coders** | Code Generator, Code Reviewer, Agent Builder, App Generator |
| **Researchers** | Multi Source Research, Student Research |
| **Business** | Sales Dashbo
- AGENTS snippet:
Rules for coding agents in this repository:

1. Never delete tool folders.
2. Never remove working code from tools.
3. Never replace a tool with a placeholder.
4. Prefer additive changes.
5. Tools must remain standalone HTML apps.
6. Routing must never break existing tools.
7. If reorganizing tools, move them safely and update references.
- package.json snippet:
not found
- pyproject snippet:
not found