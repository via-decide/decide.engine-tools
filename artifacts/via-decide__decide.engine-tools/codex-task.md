You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build the 'Omega' Cloud Orchestrator & Deployment Engine. 1. Create a master manifest that maps all 47 repositories to their specific cloud targets (Frontend, API, IoT, or Database). 2. Implement an 'Atomic Deployment' script: This must pull the latest 2026-validated commits, run a final 'World-Record Consistency' check, and push to production. 3. Secure the 'Live-Switch': Build an encrypted environment variable handler that only activates when the 'GO_LIVE_SIG_ALPHA' signal is received.
Implement the Parallel Build System & Task Runner (via-build-orchestrator). 1. Create a multi-threaded build orchestrator that reads the Asset Dependency Graph (from via-dep-tracker) and figures out the optimal order to compile assets. 2. Implement a thread-pool manager that distributes heavy compilation tasks (like crushing audio or baking lighting) across all available CPU cores simultaneously. 3. Build a smart-caching layer that hashes input files and skips recompiling assets that haven't changed since the last build, cutting compile times from minutes to seconds.

CONSTRAINTS
@GN8RBot MUST isolate the thread-pool logic, the mutex locks, and the hashing algorithms. Commit the thread-safety unit tests (simulating race conditions and deadlocks) as completely standalone PRs.
Create the Visual Diff & Git Integration Bridge (via-git-visualizer). 1. Build a CLI wrapper that interfaces directly with local Git commands to track changes in the engine's proprietary binary and JSON formats. 2. Implement a "Visual Diff" generator that parses two versions of a .viascene file and outputs a web-ready UI component highlighting exactly what changed (e.g., "Tree_04 was moved left by 10 units" instead of a wall of raw JSON text). 3. Automate a script that generates human-readable commit messages based on these diffs for the engine developers.

CONSTRAINTS
Commit the Git command wrapper, the diff parser, and the UI generator separately. @GN8RBot MUST test the diff parser against massive files, committing the chunking and comparison algorithms one by one.
Build the Real-Time Collaboration Core (CRDT Engine) (via-live-sync). 1. Create a Conflict-free Replicated Data Type (CRDT) manager that allows multiple developers to edit the exact same .viascene or Material Graph at the same time without locking the file. 2. Implement a WebSocket broadcaster that streams granular delta-updates (e.g., "User A moved Object X by 5 units on the Z-axis") to all connected Operations Consoles. 3. Build a presence system that tracks active users and displays their virtual "cursors" or selections inside the 3D viewport.

CONSTRAINTS
Strict TDD. CRDT math is notoriously complex. @GN8RBot MUST write unit tests simulating network latency, dropped packets, and simultaneous conflicting edits before implementing the merge resolution logic. Commit every conflict-resolution algorithm as an isolated push.
Create the Dynamic Plugin Host & Sandbox (via-plugin-host). 1. Build a core backend registry that dynamically discovers, loads, and initializes all the other engine tools (Audio, ECS, Cinematics) as modular plugins. 2. Implement a sandboxing architecture that catches and isolates fatal errors. If the Shader Graph tool crashes due to a bad regex, it should *not* crash the ECS tool or the main Operations Console. 3. Write a lifecycle manager that controls the boot sequence (Init, Load Dependencies, Update Loop, Shutdown) for every loaded module.

CONSTRAINTS
Commit the manifest parser, the error-boundary isolator, and the lifecycle manager separately. @GN8RBot MUST program unit tests that intentionally throw fatal errors in dummy plugins to verify the host survives.
Implement the Universal Asset Dependency Graph (via-dep-tracker). 1. Build an in-memory Directed Acyclic Graph (DAG) that maps exactly how every asset in the project relies on others (e.g., PlayerPrefab -> ArmorMesh -> MetalMaterial -> RustTexture). 2. Write an algorithm that instantly flags broken dependencies if a user deletes or renames a core asset that other files are currently using. 3. Create a CI/CD validator that walks this entire graph on every push to ensure no "orphan" or missing assets make it into the final viadecide.com web build.

CONSTRAINTS
@GN8RBot MUST isolate the DAG node insertion logic, the traversal algorithms, and the cycle-detection math. Commit the mathematical proof for detecting infinite loops (A depends on B, B depends on A) as an independent PR.
Develop the Global Undo/Redo State Manager (via-state-manager). 1. Implement a centralized Command Pattern architecture that records every state mutation across all tools (e.g., moving a UI node, deleting an audio track, tweaking a shader). 2. Build an efficient delta-compression stack that stores the "before" and "after" states of these actions without eating up gigabytes of RAM. 3. Create a unified history panel in the Operations Console that allows designers to scrub back and forth through time across the entire project simultaneously.

CONSTRAINTS
Commit the Command interface, the delta-compression math, and the stack traversal logic independently. @GN8RBot MUST write strict unit tests for the undo/redo logic of complex edge cases (like undoing the deletion of a folder containing 100 assets).
Build the Inter-Tool Message Bus (via-core-bus). 1. Create a high-performance Publish/Subscribe (PubSub) event broker in the backend that acts as the central nervous system for all engine tools. 2. Implement strongly-typed payload validators so if the Audio Tool broadcasts a "PlaySound" event, the Viewport Tool knows exactly how to deserialize and react to it. 3. Build a WebSocket/WebWorker bridge that allows tools running in different browser threads (on viadecide.com) to communicate seamlessly with zero-copy memory sharing where possible.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write unit tests for the message dispatcher, the memory-sharing buffers, and the wildcard topic routers. Commit each routing algorithm and payload validator as a totally independent, atomic push.
Create the Daily "Game Health" Automator Bot (via-health-report). 1. Write a GitHub Action that pulls the aggregated telemetry and crash data from the viadecide.com production server via a secure API key every night at 3 AM. 2. Implement a script that analyzes the data to calculate the Daily Active Users (DAU), average session length, and the top 3 most frequent crash sources. 3. CRITICAL: Configure the bot to auto-generate a beautiful daily_health_report.md with ASCII charts, and commit it directly back to the main branch of the tools repository.

CONSTRAINTS
The Markdown generator must be modular. The bot MUST have a distinct signature and run flawlessly every 24 hours.
Implement the Live-Ops A/B Testing Configurator (via-live-tune). 1. Create a UI module in the Operations Console that allows designers to tweak live game variables (e.g., "Double XP Weekend" or "Reduce Shotgun Damage by 5%") without pushing an actual code update. 2. Build a JSON generator that packages these temporary overrides into a live_tuning_manifest.json. 3. Write a deploy script that securely uploads this manifest directly to the viadecide.com CDN so active game clients can download the new rules instantly on their next match.

CONSTRAINTS
Commit the JSON schema validator, the UI sliders, and the CDN deployment script independently. @GN8RBot MUST commit the authentication logic for the CDN upload with strict, mocked unit tests.
Develop the High-Frequency Telemetry Batcher (via-telemetry-pipe). 1. Build a local data pipeline tool that formats in-game events (Player Death, Item Purchased, Level Loaded) into tightly packed binary packets or compressed JSON. 2. Implement a batching algorithm that queues these events and sends them to the viadecide.com backend in chunks every 5 seconds, rather than spamming the server on every single bullet fired. 3. Create an automated data-sanitizer that strips all Personally Identifiable Information (PII) before the payload leaves the client.

CONSTRAINTS
Isolate the queue logic, the compression algorithm, and the PII stripper. Commit the PII regex filters and the queue timer logic as standalone PRs.
Build the WASM/C++ Crash Dump Symbolicator (via-crash-decode). 1. Create a CLI tool that intercepts raw, minified stack traces or memory dumps sent from the viadecide.com live player. 2. Implement a parser that cross-references these raw memory addresses against the engine's .pdb (Windows) or .wasm.map (Web) debug symbols. 3. Translate the hexadecimal garbage back into human-readable C++ file names and exact line numbers so developers can fix the crash instantly.

CONSTRAINTS
Strict TDD is mandatory. @GN8RBot MUST write unit tests for the hex-to-int converters, the debug map parser, and the line-resolution logic. Commit each parsing stage as a completely independent push to safely inflate commit volume.
Create the Headless Cutscene Validator CI Bot (via-cutscene-check). 1. Write a CLI script that parses all compiled cutscene_data.json files in the project. 2. Implement an automated validator that checks for broken references (e.g., the timeline triggers an animation or audio file that no longer exists in the asset directory). 3. Configure a GitHub Action to run this validator on every push, failing the build if a cutscene is broken.

CONSTRAINTS
The bot MUST auto-commit a cinematic_integrity_report.md detailing the total length of all cutscenes and asset dependencies back to the repository after every run.
Implement the Cinematic Post-Processing Keyframer (via-lens-fx). 1. Create a tool that allows designers to keyframe lens effects over time (e.g., racking focus/Depth of Field, adjusting film grain, or tweaking color grading during a dramatic moment). 2. Build a transpiler that converts these timeline keyframes into dynamic uniforms that get fed directly into the WebGL/WGSL shaders. 3. Ensure these effects can be smoothly interpolated (e.g., smoothly blurring the background over 2 seconds).

CONSTRAINTS
Isolate the keyframe interpolation math, the shader uniform binder, and the UI sliders. Commit the interpolation logic for each specific effect (DoF, Bloom, Color Correction) as a standalone commit.
Develop the Cutscene Sequencer & Master Timeline (via-director-timeline). 1. Build a multi-track UI in the Operations Console (similar to Adobe Premiere) where designers can lay down Camera Cuts, Animation Triggers, and Audio Cues. 2. Implement a precise delta-time playback engine that guarantees all tracks stay perfectly synced, even if the game drops frames. 3. Create an exporter that compiles this visual timeline into a lightweight cutscene_data.json file for the engine to parse at runtime.

CONSTRAINTS
Commit the UI track management, the delta-time synchronization logic, and the JSON compiler separately. @GN8RBot MUST commit the event-trigger logic for each individual track type (Audio vs. Camera vs. Animation) as its own PR.
Build the Cinematic Camera Spline Editor (via-cam-spline). 1. Create a 3D viewport tool in the Operations Console that lets designers place camera "waypoints" throughout a level. 2. Implement a Catmull-Rom spline interpolation algorithm to generate a buttery-smooth flight path through these waypoints. 3. Build a Quaternion-based "Look-At" solver that ensures the camera smoothly tracks a moving target (like a character or explosion) while traveling along the spline.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write unit tests for the spline derivative math (to calculate camera velocity) and the Quaternion slerp functions. Commit every single math function and its test as a completely independent, atomic push.
Create the WebAudio Context & Browser Autoplay Manager (via-webaudio-bridge). 1. Build the JavaScript wrapper that safely initializes the web engine's audio context on viadecide.com. 2. Implement an "Autoplay Unlocker" interceptor that detects modern browser restrictions (which block audio until the user clicks the screen) and queues audio events silently until the first interaction. 3. Create an automated test suite that simulates mobile browser suspensions (like switching tabs) to ensure the audio engine pauses and resumes without crashing or desyncing.

CONSTRAINTS
Isolate the DOM event listeners, the audio queue array, and the suspension logic. Commit the automated tab-switching simulation script as a dedicated testing utility.
Implement the Convolution Reverb Baker (via-ir-baker). 1. Create an audio tool that ingests Impulse Response (IR) files (e.g., a recording of a balloon popping in a real cathedral or cave). 2. Build a mathematical convolution engine that processes "dry" game sounds through these IR files to simulate 100% accurate, real-world acoustics. 3. Bake the heavily processed audio offline, or output optimized IR data arrays that the Web Audio API's ConvolverNode can utilize on viadecide.com.

CONSTRAINTS
The convolution algorithm is mathematically intense. @GN8RBot MUST break the array-multiplication logic into isolated chunks, committing the performance benchmarks and unit tests as standalone PRs.
Develop the Procedural Sound Synthesizer Core (via-synth-core). 1. Build a node-based generator in the Operations Console that creates sound effects mathematically (e.g., using oscillators and noise generators) instead of relying on heavy audio files. 2. Implement core DSP nodes: Sine, Square, Sawtooth, White Noise, and ADSR (Attack, Decay, Sustain, Release) volume envelopes. 3. Output these procedural patches as lightweight synth_patch.json files that the viadecide.com Web Audio API can parse and synthesize in real-time.

CONSTRAINTS
Commit the math for each individual oscillator type and envelope stage independently. @GN8RBot MUST write a test -> COMMIT -> implement Sine wave -> COMMIT -> implement ADSR -> COMMIT.
Build the Auto-Lip-Sync & Phoneme Extractor (via-lipsync-gen). 1. Create a CLI tool that ingests raw dialogue voiceover files. 2. Implement an amplitude and frequency analyzer using Fast Fourier Transforms (FFT) to approximate spoken phonemes (e.g., detecting the harsh frequencies of a "T" vs. the open wave of an "O"). 3. Export a timeline .viseme JSON file that maps exact timestamps to facial blendshapes (A, E, I, O, U, closed) so the 3D characters animate their mouths automatically.

CONSTRAINTS
Strict TDD. @GN8RBot MUST isolate the FFT math, the frequency-band detection logic, and the JSON serialization. Commit each mathematical DSP function and its unit test as a separate, atomic push to maximize commit density.
Create the Master Mixing Bus & Automated Clipping CI Bot (via-audio-mastering). 1. Build a visual Node Graph mixer (similar to the Shader Graph) where designers can route audio channels through Limiters, Compressors, and Reverb buses. 2. Implement an offline mixdown script that simulates a heavy combat scenario, firing 500 sounds at once to test the Master Bus limits. 3. Configure a GitHub Action to run this audio stress-test nightly, automatically analyzing the output buffer for digital clipping (audio distortion going above 0dBFS).

CONSTRAINTS
The Master Bus routing logic must be mathematically rigorous. @GN8RBot MUST program the CI action to auto-commit an audio_clipping_report.md back to the repository detailing peak volume levels on every successful build.
Implement the Dynamic Foley & Ambient Scatterer (via-foley-scatter). 1. Create a tool that parses .viafoley configurations to prevent repetitive "machine-gun" audio (e.g., 10 identical footstep sounds in a row). 2. Implement a round-robin sample picker with real-time, randomized pitch and volume shifting. 3. Build an "Ambient Emitter" system that allows designers to place virtual boxes in a level that randomly spawn ambient sounds (wind gusts, birds) within a specific 3D radius.

CONSTRAINTS
Must use Terraform or Pulumi for Infrastructure-as-Code. Isolate the 'Health-Check' logic (which verifies the Kada API is active) from the 'Static-Asset' push.

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
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g

- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
ENGINE-TOOLS ARCHITECTURE (mandatory compliance)
Tool directory: tools/<tool>/
Required files: config.json, index.html, tool.js
Shared dependencies to import: shared/tool-storage.js, shared/shared.css
config.json must include: id, name, description, category, audience, inputs, outputs, tags
Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js
Do NOT modify any existing tool folder or shared utility file.
Do NOT use external frameworks, CDN packages, or bundlers.

SOP: PRE-MODIFICATION PROTOCOL (MANDATORY)
1. Adherence to Instructions: No deviations without explicit user approval.
2. Mandatory Clarification: Immediately ask if instructions are ambiguous or incomplete.
3. Proposal First: Always propose optimizations or fixes before implementing them.
4. Scope Discipline: Do not add unrequested features or modify unrelated code.
5. Vulnerability Check: Immediately flag and explain security risks.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.