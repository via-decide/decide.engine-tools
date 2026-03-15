You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Add a new standalone tool called study-timer in tools/study-timer/. Title: "Study Timer". Description: "Pomodoro-style study timer with session tracking.". Category: "education". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.

CONSTRAINTS
preserve all existing tool folders; preserve standalone behavior; do not break category routing; update router/index/registry/README only as needed; use minimal corrective edits
Add a new standalone tool called note-summarizer in tools/note-summarizer/. Title: "Note Summarizer". Description: "Paste notes, get structured summary with key points.". Category: "education". The tool must contain: config.json, index.html, tool.js. The tool must be standalone, use vanilla JS, load shared.css and tool-storage.js. Register in shared/tool-registry.js importableToolDirs array. Add to router.js modularTools map. Ensure index.html dynamic render picks it up. Add to README.md tool list.

CONSTRAINTS
preserve all existing tool folders; preserve standalone behavior; do not break category routing; update router/index/registry/README only as needed; use minimal corrective edits
Upgrade the root index.html game launcher to use a "Glassmorphism Bento Grid" UI (inspired by React Bits). Update _assets/css/global-theme.css and index.html to wrap game cards in translucent panels using CSS backdrop-filter: blur(12px), subtle rgba borders, and a smooth hover-lift physics effect. Pure CSS and HTML5.

CONSTRAINTS
preserve existing tools; preserve standalone behavior; register in tool-registry.js and router.js; update README if needed
Create a utility script _assets/js/magnetic-buttons.js and update global-theme.css to implement "Magnetic Buttons" (inspired by modern React UI). Add Vanilla JS mousemove listeners to .btn elements so they gently pull towards the cursor on hover, and add a CSS ripple/glow effect on click. Must work without frameworks.

CONSTRAINTS
preserve existing tools; preserve standalone behavior; register in tool-registry.js and router.js; update README if needed
Add "Shimmer Text" and "Animated Glowing Borders" utilities to _assets/css/global-theme.css. Create pure CSS @keyframes for a light sweep effect across text (class .text-shimmer) and rotating conic-gradient borders (class .border-glow). Apply these classes to the milestone evolution states in the growth-milestone-engine for premium visual feedback.

CONSTRAINTS
preserve existing tools; preserve standalone behavior; register in tool-registry.js and router.js; update README if needed
Create a new utility _assets/js/environment-particles.js that uses HTML5 Canvas to render dynamic particle backgrounds (inspired by React Bits particle components). Logic must read the current environment state (rain, sun, toxic pests) and spawn lightweight falling raindrops, floating sun dust, or sickly green spores using requestAnimationFrame. Integrate into growth-milestone-engine.

CONSTRAINTS
preserve existing tools; preserve standalone behavior; register in tool-registry.js and router.js; update README if needed
Integrate swup.js via CDN into the root index.html to handle page routing. Wrap the main content areas in <main id="swup" class="transition-fade">. Configure Swup so that clicking a game card in the launcher smoothly fades out the index and fades in the specific tool's UI (like starter-farm-generator) without a hard browser refresh.
> Create a new branch feature/ui-theme-engine. Create a new file shared/theme-engine.js. Build a utility object ThemeEngine that injects and modifies CSS variables (e.g., --bg-color, --text-color, --accent) at the document.documentElement level. Define three default themes: "Light" (clean white/gray), "Dark" (deep slate), and "Midnight" (pure black with neon accents). Read the user's preferred theme from localStorage.getItem('engine_theme') on initialization. Create a small floating UI toggle (or a function to bind to a settings menu) that cycles through these themes dynamically without reloading the page. Commit the changes with the message "feat: implement global CSS variable theme engine". Push the branch and open a Pull Request to main with the title "Feat: Global Theme Engine" and a description mentioning dynamic CSS custom properties.
Implement the native View Transitions API (or a CSS fade/scale fallback in Vanilla JS) in the root router logic. When a user clicks a game card on the main index.html launcher to open a specific tool (like starter-farm-generator), the UI should smoothly morph/fade into the new view instead of a harsh page load cut.

CONSTRAINTS
preserve existing tools; preserve standalone behavior; register in tool-registry.js and router.js; update README if needed
Integrate swup.js via CDN into the root index.html to handle page routing. Wrap the main content areas in <main id="swup" class="transition-fade">. Configure Swup so that clicking a game card in the launcher smoothly fades out the index and fades in the specific tool's UI (like starter-farm-generator) without a hard browser refresh.
> Create a new branch feature/ux-particle-system. Create a file shared/particle-engine.js. Build a Vanilla JS ParticleEngine object. It should dynamically generate absolute-positioned <div> elements (confetti, sparks, stars) that animate outwards from a given (x,y) coordinate using CSS transitions, and then automatically remove themselves from the DOM after the animation completes (e.g., 800ms). Include pre-configured burst profiles: burstXP(x, y) (green/gold sparks), burstError(x, y) (red shake), and burstClick(x, y) (subtle white rings). Attach global listeners to trigger these bursts on existing engine events (like wallet:earned or swipe:card_swiped). Commit the changes with the message "feat: implement DOM-based particle effects engine". Push the branch and open a Pull Request to main with the title "Feat: Particle Effects Engine" and a description mentioning it adds visual 'juice' to interactions.

CONSTRAINTS
> Pure Vanilla JS. Do not use Canvas if DOM elements suffice (for better accessibility and crispness). Ensure it does not cause memory leaks by properly garbage-collecting the DOM elements.
> Create a new branch feature/ux-audio-manager. Create a file shared/audio-manager.js. Build an AudioManager that initializes the Web Audio API or uses simple HTMLAudioElement objects. It should preload 3-4 very short, subtle base64-encoded sound strings (or simple synthesized oscillators): a "pop" for clicks, a "chime" for success, and a "low thud" for errors. Implement a vibrate(pattern) method using the navigator.vibrate API for mobile devices. Add a global "Mute" toggle state stored in localStorage. Listen for global custom events (e.g., agent:step_success, growth:stage_evolved) to play the corresponding sound and haptic pattern automatically. Commit the changes with the message "feat: add global audio and haptic feedback manager". Push the branch and open a Pull Request to main with the title "Feat: Audio & Haptic Manager" and a description mentioning tactile game feedback.

CONSTRAINTS
> Pure Vanilla JS. Use synthesized oscillator sounds or incredibly tiny base64 strings to avoid loading external asset files. Respect the browser's autoplay policies (require a user interaction first).
> Create a new branch feature/ux-view-transitions. Create a file shared/transition-engine.js. Update the existing routing/tab-switching logic. Wrap DOM updates (when changing tabs or switching pages) inside document.startViewTransition(() => { ... }). If the browser does not support the View Transitions API, fallback gracefully to a standard CSS opacity fade in/out. In your CSS, define custom ::view-transition-old and ::view-transition-new animations (e.g., a slight slide-up and fade effect). Commit the changes with the message "feat: implement native view transitions for routing". Push the branch and open a Pull Request to main with the title "Feat: Dynamic View Transitions" and a description mentioning native app-like routing.

CONSTRAINTS
> Pure Vanilla JS and CSS. Do not break the existing routing logic, only wrap the DOM mutation step. Ensure the fallback works seamlessly on older browsers (Safari/Firefox).
> Create a new branch feature/ux-achievement-toasts. Create a file shared/toast-system.js. Build a ToastSystem utility that creates beautiful, floating notification cards at the bottom-right or top-center of the screen. It must support queuing: if 3 notifications fire at once, they should stack vertically with smooth CSS translation animations, rather than overlapping. Implement a progress bar inside the toast that shrinks over 3-5 seconds before the toast auto-dismisses. Allow the toast to accept an icon/emoji, title, and description. Hook this up to listen to wallet:earned, agent:run_completed, and growth:stage_evolved events to display premium "Achievement Unlocked" style popups. Commit the changes with the message "feat: add queue-based stacking toast notification system". Push the branch and open a Pull Request to main with the title "Feat: Achievement & Toast System" and a description mentioning it replaces native alerts.

CONSTRAINTS
> Pure Vanilla JS and CSS. Ensure the toasts can be swiped away manually on mobile. Handle DOM cleanup properly when a toast disappears.

PROCESS (MANDATORY)
1. Read README.md and AGENTS.md before editing.
2. Audit architecture before coding. Summarize current behavior.
3. Preserve unrelated working code. Prefer additive modular changes.
4. Implement the smallest safe change set for the stated goal.
5. Run validation commands and fix discovered issues.
6. Self-review for regressions, missing env wiring, and docs drift.
7. Return complete final file contents for every modified or created file.

REPO AUDIT CONTEXT
- Description: 
- Primary language: HTML
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
ENGINE-TOOLS ARCHITECTURE (mandatory compliance)
Tool directory: tools/<tool>/
Required files: config.json, index.html, tool.js
Shared dependencies to import: shared/tool-storage.js, shared/shared.css
config.json must include: id, name, description, category, audience, inputs, outputs, tags
Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js
Do NOT modify any existing tool folder or shared utility file.
Do NOT use external frameworks, CDN packages, or bundlers.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.