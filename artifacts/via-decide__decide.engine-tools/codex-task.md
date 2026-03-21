You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
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
@GN8RBot MUST isolate the randomization algorithms, the JSON config parser, and the 3D radius math. Commit the pitch-shifting DSP logic as its own TDD cycle to safely inflate the commit graph.
Develop the 3D Spatial Audio & Occlusion Baker (via-spatial-acoustics). 1. Build a CLI tool that analyzes the game's 3D level geometry and generates an "acoustic mesh." 2. Implement a DSP (Digital Signal Processing) module that simulates sound occlusion (e.g., applying a low-pass filter to muffle an explosion happening behind a thick concrete wall). 3. Write a Head-Related Transfer Function (HRTF) wrapper to ensure precise 3D audio positioning when the user is wearing headphones on viadecide.com.

CONSTRAINTS
Commit the raycast-occlusion math, the DSP low-pass filter algorithm, and the geometry analyzer independently. The math required for audio propagation is heavy-break it down into dozens of micro-commits with exhaustive unit tests.
Build the Adaptive Soundtrack Sequencer (via-music-sequencer). 1. Create a Timeline UI in the Operations Console designed for vertical music mixing (layering stems like drums, strings, and bass). 2. Implement an event-listening node system that crossfades or triggers specific music layers based on live game variables (e.g., danger_level > 50 fades in the battle drums). 3. Build a compiler that parses this adaptive timeline into a lightweight music_behavior.json format for the C++ and WASM audio engines.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write unit tests for the crossfade math (linear, exponential, logarithmic) before implementing the audio buffer logic. Commit each fading algorithm and timeline parser as a separate, atomic push.
Create the Shader Permutation & Warm-up Cache CI Bot (via-shader-cache). 1. Write a CLI tool that scans the game project for all compiled materials and generates every possible shader permutation (e.g., Material with shadows ON vs OFF, Fog ON vs OFF). 2. Implement an offline compiler script that pre-compiles these permutations into binary SPIR-V or WebGPU pipelines to eliminate runtime stuttering. 3. Configure a GitHub Action that runs this permutation compiler nightly and auto-commits the resulting shader_cache.bin back to the repository.

CONSTRAINTS
The permutations generator must be mathematically exhaustive. @GN8RBot MUST program the CI action to auto-commit an updated shader_variants_report.md indicating compilation times and variant counts.
Implement the Live Material Preview Sphere (via-mat-preview). 1. Create a dedicated WebGL viewport within the Material Editor that renders a 3D preview sphere or custom mesh. 2. Build a hot-reloading bridge that takes the transpiled shader from via-shader-compile, injects it into the preview viewport, and updates instantly as the designer drags node wires. 3. Add a dynamic lighting rig (directional light + HDRI environment map) to the preview scene so artists can test physical reflections and roughness accurately.

CONSTRAINTS
Isolate the WebGL context setup, the hot-reload watcher, and the lighting math. Commit the HDRI texture loader and the spherical harmonic lighting algorithms as completely standalone PRs.
Develop the Node-to-Shader Transpiler (via-shader-compile). 1. Build a compiler that parses the JSON output of the Material Node Graph and constructs an Abstract Syntax Tree (AST). 2. Implement code generators that traverse the AST and output clean, optimized GLSL (for OpenGL) and WGSL (for WebGPU/viadecide.com). 3. Write a dead-code eliminator that detects unhooked nodes or mathematically useless branches (e.g., multiplying by 1) and strips them from the final shader code.

CONSTRAINTS
Strict TDD is mandatory. @GN8RBot MUST implement the code generation for every single node type (Dot Product, Cross Product, Sine, Clamp) individually. Write a test -> COMMIT -> Implement Node Translation -> COMMIT.
Build the Material Node Graph UI Core (via-shader-graph). 1. Create a pan-and-zoom Canvas/SVG workspace in the Operations Console for the Material Editor. 2. Implement a modular Node system where designers can spawn Math nodes (Add, Multiply), Texture Samplers, and PBR output nodes (Albedo, Metallic, Roughness). 3. Build a spline-based connection system that allows users to drag wires between node input/output pins, with strict type-checking (e.g., blocking a Vector3 from connecting directly to a Float without a conversion node).

CONSTRAINTS
Commit the Canvas grid, the draggable Node component, and the Bezier wire-drawing math separately. @GN8RBot MUST write strict unit tests for the node type-checking logic, committing each validation rule as an independent push.
Create the Animation Track Compiler & Web Exporter (via-anim-pack). 1. Build a compiler that takes the heavy JSON project files from the Timeline Editor and strips out all editor-only data. 2. Pack the raw keyframes, curve tangents, and event triggers into a hyper-optimized .via_anim binary file. 3. Generate an automated GitHub Action that watches the /ux_animations folder, automatically compiles them into binaries, and pushes them directly to the viadecide.com web CDN.

CONSTRAINTS
Commit the JSON stripper, the binary serializer, and the schema validator independently. @GN8RBot MUST program the CI action to auto-commit a ux_animation_manifest.json back to the tools repo on every successful build.
Implement 3D UI Mesh Deformation & Squish Physics (via-ui-rigging). 1. Create a tool that allows designers to attach lightweight "bones" and weight-painting to 2D/3D UI meshes (e.g., making a button bulge when clicked). 2. Implement a vertex shader generator that calculates skeletal mesh deformation directly on the GPU for maximum performance. 3. Build a real-time previewer in the Operations Console so artists can see the "squash and stretch" physics react to mouse hovers.

CONSTRAINTS
@GN8RBot MUST isolate the bone hierarchy parser, the vertex weight calculator, and the shader code generator. Commit the matrix multiplication logic for bone transforms with heavy unit testing.
Develop the Timeline Track & Keyframe Editor UI (via-timeline-ui). 1. Build a sophisticated HTML5/Canvas Timeline Editor within the Operations Console, featuring draggable keyframes and scrubbable playheads. 2. Implement a visual "Graph Editor" view where designers can manually tweak the tangent handles of Bezier curves for easing in/out. 3. Create an event-dispatch system that synchronizes the web-based timeline playhead with the local engine's rendering context in real-time.

CONSTRAINTS
Commit the Canvas drawing logic, the keyframe drag-and-drop handler, and the tangent math as separate modules. The Graph Editor UI components must be built and committed piece-by-piece to safely inflate the commit graph.
Build the Cinematic Spline & Curve Math Core (via-curve-math). 1. Create a standalone C++ math library (and WASM equivalent) dedicated entirely to animation interpolation. 2. Implement evaluation functions for Cubic Bezier, Catmull-Rom, and B-Spline curves to handle smooth transitions for UX translation, rotation, and scale. 3. Build a Quaternion spherical linear interpolation (Slerp) function for buttery-smooth 3D menu rotations.

CONSTRAINTS
Strict TDD is mandatory. @GN8RBot MUST write unit tests for every mathematical curve evaluator, checking expected floating-point outputs at t=0.0, t=0.5, and t=1.0. Commit every single math function and its test as an independent, atomic push.
Create the Web-Based UI Layout Pre-viewer (via-hud-preview). 1. Build a local HTML5/Canvas tool within the Operations Console to load the compiled .ui_bin and texture atlases. 2. Implement a lightweight renderer that accurately draws the UI exactly as the native C++ engine would. 3. Add a responsive device-simulator dropdown (e.g., "iPhone 15", "1080p Desktop", "4K TV") to instantly test how the UI flexes and scales across different aspect ratios.

CONSTRAINTS
Commit the binary file reader, the Canvas drawing logic, and the responsive scaling simulator independently. Setup a GitHub Action to auto-deploy this previewer to a staging branch on viadecide.com.
Implement the Automated UI Texture Atlas Generator (via-sprite-packer). 1. Create a build script that scans a /ui_raw directory full of individual buttons, icons, and borders. 2. Implement a 2D bin-packing algorithm (like MaxRects) to automatically arrange these scattered images into a single, tightly packed 2048x2048 sprite atlas to minimize GPU draw calls. 3. Output a mapping dictionary that the engine and viadecide.com can use to look up the exact UV coordinates of every individual icon.

CONSTRAINTS
Isolate the image loading, the bin-packing math logic, and the UV exporter. @GN8RBot MUST commit the core bin-packing functions and their respective spatial tests separately to safely inflate the commit graph.
Develop the UI Layout Compiler & Binary Packer (via-ui-compile). 1. Build a transpiler that reads responsive .viaui (XML or JSON) layout files, which define HUD elements like health bars, minimaps, and inventory grids. 2. Implement an optimizer that resolves anchoring, flexbox-style constraints, and relative scaling into absolute screen coordinates. 3. Compile this layout data into a minimal .ui_bin format that the engine can load with zero parsing overhead.

CONSTRAINTS
Commit the XML/JSON parser, the flexbox math solver, and the binary packer independently. @GN8RBot MUST commit the translation logic for each individual UI element type (Text, Image, Button, Scrollbox) separately.
Build the Multi-Channel Signed Distance Field (MSDF) Font Generator (via-font-pack). 1. Create a CLI tool that ingests standard .ttf and .otf font files. 2. Implement an MSDF generation algorithm to output highly optimized texture atlases that allow text to scale infinitely without pixelation in the C++ engine. 3. Generate a font_metrics.json file detailing character glyph bounding boxes, kerning pairs, and baseline offsets for the viadecide.com web renderer.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write unit tests for the TTF parser, the MSDF math generation, and the JSON serializer. Commit the glyph extraction logic and kerning table parsing as completely separate, atomic pushes.
Create the AI NavMesh Baker (via-nav-bake). 1. Build a tool that analyzes the static level geometry (floors, walls, stairs) from an exported scene file. 2. Implement a voxelization and polygon-merging algorithm to generate a traversable Navigation Mesh (NavMesh) for AI pathfinding. 3. Export the pathing data into a tightly packed format that both the C++ engine and the viadecide.com WebAssembly build can use for A* (A-Star) routing.

CONSTRAINTS
@GN8RBot MUST commit the voxelizer, the edge-detection logic, and the A* validation tests as completely separate modules. The mathematical complexity requires strict TDD and atomic commits.
Implement the Weapon DPS Simulator & Balancer (via-weapon-balance). 1. Create a script that parses a weapon_stats.csv file containing fire rates, damage values, reload times, and recoil curves. 2. Build a headless simulation loop that runs 10,000 virtual firefights against different armor types to calculate exact Time-To-Kill (TTK) and DPS metrics. 3. Compile the raw CSV data into an encrypted binary blob (weapons.dat) for the engine, and output a balance_report.html for the Operations Console.

CONSTRAINTS
Commit the CSV parser, the TTK simulation math, and the binary packer independently. Setup a GitHub Action to auto-commit the balance_report.html back to the repo whenever the CSV is updated.
Develop the Physics Convex Hull Generator (via-hull-maker). 1. Build a command-line tool that ingests complex 3D models (.obj or .gltf) from the asset directory. 2. Implement a mathematical wrapping algorithm (like QuickHull) to generate simplified, physics-ready convex colliders from the high-poly visual meshes. 3. Serialize the output into a custom .viacol binary format that the engine's physics step can load into memory instantly.

CONSTRAINTS
Isolate the vertex extraction, the QuickHull math logic, and the binary serialization. @GN8RBot MUST commit the core math functions and their respective unit tests separately to safely inflate the commit graph.
Build the ECS Prefab Compiler & CodeGen (via-prefab-gen). 1. Create a CLI parser that reads .viaprefab JSON files (which define Entities and their attached Components like Transform, Health, Mesh). 2. Implement a generator that outputs zero-overhead C++ boilerplate to register these components in the engine's Entity Component System (ECS). 3. Export a secondary web_prefabs.json payload so the viadecide.com web player knows exactly how to instantiate these objects in the browser.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write unit tests for the JSON schema validator and the C++ string generator. Commit each component's parsing logic (e.g., parsing a Transform vs. parsing a Collider) as an isolated, atomic push.
Create the Automated CI/CD Memory Leak Detector (via-leak-check). 1. Write a GitHub Action that spins up the engine in headless mode and runs a heavy, simulated 10-minute gameplay loop. 2. Implement a script that monitors the process's heap size over time; if the memory footprint grows continuously without releasing (a leak), the script must fail the build. 3. Configure the bot to auto-generate a memory_health_report.md detailing the peak memory usage, allocation counts, and potential leak pointers.

CONSTRAINTS
Preserve existing code; prefer additive changes.
Implement the Memory Dump Analyzer & Dashboard (via-mem-tracker). 1. Create a parser that reads raw binary memory allocation dumps (.viamem) generated by the engine's custom allocators. 2. Build a data transformer that categorizes memory usage by subsystem (Renderer, Physics, Audio) and calculates fragmentation percentages. 3. Develop a visual "Heap Map" UI component for the Operations Console that renders this data into a live-updating bar chart or treemap.

CONSTRAINTS
@GN8RBot MUST isolate the binary parser, the categorization logic, and the UI component. Implement unit tests with mock binary data to verify parsing accuracy before committing the logic.
Develop the Gamepad Calibration & Web Bridge (via-gamepad-bridge). 1. Build a local HTML/JS utility within the Operations Console to visualize connected controllers and their raw axis/button inputs. 2. Implement a deadzone and sensitivity curve calculator that generates optimized math functions for the engine's input layer. 3. Export a gamepad_profiles.json mapping database so the engine knows how to handle different controllers (Xbox, PlayStation, generic USB) automatically.

CONSTRAINTS
Commit the HTML visualizer, the deadzone math logic, and the JSON exporter separately. For the math logic, commit each curve function (linear, exponential, smoothed) as a separate TDD loop.
Build the Cross-Platform Input Action Mapper (via-input-mapper). 1. Create a CLI tool that parses .viainput JSON files, which define abstract game actions (e.g., "Jump", "Shoot") and their hardware bindings. 2. Implement a code generator that translates these definitions into tightly packed C++ enums and lookup tables for the native engine. 3. Generate a secondary JavaScript/TypeScript module that perfectly maps the HTML5 KeyboardEvent and Gamepad API codes to the engine's internal action IDs for viadecide.com.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write tests for the parser, the C++ generator, and the JS generator. Commit each platform's generation logic as a totally independent, atomic push.
Create the Game Economy & Loot Schema Validator (via-economy-check). 1. Build a local tool that ingests massive JSON databases defining the game's items, drop rates, and virtual economy. 2. Implement a Monte Carlo simulation script that runs 1,000,000 virtual "loot drops" locally to verify that drop probabilities match the intended design. 3. Configure a GitHub Action to auto-run this simulation every time a designer updates the economy JSON, blocking the PR if the simulation detects inflation or broken drop rates.

CONSTRAINTS
The Monte Carlo simulation must output a loot_distribution_report.md. @GN8RBot MUST program the CI action to auto-commit this report back to the repository on every successful economy tweak.
Implement the Particle VFX & Shader Minifier (via-vfx-crusher). 1. Create a build tool that collects raw GLSL/WGSL shader files and custom particle system configurations. 2. Implement a minifier that strips comments, shortens variable names, and pre-compiles shader permutations for different hardware tiers. 3. Output a single, web-optimized .via_vfx binary package that the viadecide.com canvas can load instantly.

CONSTRAINTS
@GN8RBot MUST isolate the regex-based minifier, the permutation generator, and the binary packager. Commit the regex patterns for stripping different types of shader code individually to bloat the commit history safely.
Develop the Visual Scripting Node Translator (via-node-transpiler). 1. Build a transpiler that ingests visual logic node graphs (exported from the web-based Operations Console) as raw JSON. 2. Implement a code generator that translates these logic nodes into safe, executable Lua scripts or WASM bytecode. 3. Implement a static analyzer to catch infinite loops or memory leaks in the visual scripts before they are packaged for the game.

CONSTRAINTS
Commit the parser, the code generator, and the static analyzer independently. For the code generator, @GN8RBot MUST commit the translation logic for each individual node type (Math Node, Logic Node, Event Node) separately.
Build the Animation State Machine (ASM) Compiler (via-anim-compile). 1. Create a CLI parser that reads .via_asm JSON files (which define animation states, blend trees, and transition rules). 2. Implement an optimizer that converts the JSON graph into a highly compact, memory-contiguous binary format for the native C++ engine. 3. Generate a .d.ts TypeScript definitions file so the viadecide.com web player can trigger specific animation states securely.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write unit tests for each mathematical transition type (Linear, Ease-In, Bezier Blend) before implementing the logic. Commit every single blend function and its test as a completely separate push.
Automate the Nightly Simulation CI/CD Bot (via-nightly-sim). 1. Write a GitHub Action workflow that automatically spins up the Headless Bot Swarm (via-swarm-test) every night at midnight. 2. Command the bot swarm to run a standard 15-minute cognitive/simulation test against the latest server build. 3. CRITICAL: Automate the workflow to push a generated nightly_sim_results.md file back to the repository with the server's tick-rate, memory usage, and peak bot count.

CONSTRAINTS
The bot must use a dedicated Git signature. The markdown generator must be modularly built and committed piece-by-piece.
Implement the Flame Graph Profiler & Exporter (via-flame-gen). 1. Create a tool that parses raw .cpu_trace binary logs generated by the game engine's internal profiler. 2. Translate the call-stack timings into an interactive, web-ready SVG or HTML flame graph. 3. Configure the output so it can be automatically uploaded and embedded into the viadecide.com Developer Dashboard for live performance tracking.

CONSTRAINTS
Commit the binary file reader, the memory allocation tracker, and the SVG/HTML generator independently. Ensure the parser is optimized to handle multi-gigabyte trace files.
Develop the AI Behavior Tree Compiler (via-bt-compile). 1. Build a parser that reads custom .viabt JSON files (which define the logic for your AI agents and simulator bots). 2. Write a code generator that translates these JSON behavior trees into highly optimized, compiled C++ decision nodes for the native engine. 3. Create an exporter that also compiles the tree into a WebAssembly-friendly format so the AI can run directly in the browser on viadecide.com.

CONSTRAINTS
Implement each Behavior Tree node type (Sequence, Selector, Decorator, Leaf) in absolute isolation. Write a test -> COMMIT -> Implement Node -> COMMIT.
Build the Headless Bot Swarm Orchestrator (via-swarm-test). 1. Create a CLI controller that can spawn and manage hundreds of headless (no-rendering) game engine client instances locally. 2. Implement a multiplexer that routes simulated inputs (movement, shooting, chatting) to all headless clients simultaneously to hammer the local server. 3. Aggregate the latency and packet-loss data from the swarm into a stress_test_report.json for the Operations Console.

CONSTRAINTS
Strict TDD. @GN8RBot MUST commit the process spawner, the input multiplexer, and the metrics aggregator as distinct, atomic features.
Create the Headless Server Docker Packager (via-server-deploy). 1. Build a deployment script that takes the compiled C++ headless dedicated server binary. 2. Auto-generate a minimal Alpine Linux Dockerfile designed to run the server with the absolute lowest memory footprint possible. 3. Implement a CLI command that builds the container and pushes it to a private registry so the viadecide.com orchestrator can spin up game instances on demand.

CONSTRAINTS
@GN8RBot MUST commit the Dockerfile generator logic, the registry authentication handler, and the CLI argument parser independently.
Implement the Local Matchmaking Mock Server (via-matchmaker-local). 1. Create a lightweight local WebSocket server designed to perfectly mimic the viadecide.com production matchmaking backend. 2. Build a simulated "player queue" that artificially pairs the local developer with fake bot accounts based on mock MMR (Matchmaking Rating). 3. Emit standard "MatchFound" and "ServerAllocated" JSON payloads to test the engine's lobby UI without hitting the live cloud infrastructure.

CONSTRAINTS
Implement the queueing algorithm, the WebSocket broadcaster, and the mock-player generator as standalone modules. Commit each with its respective unit tests.
Develop the Multiplayer Network Schema CodeGen (via-net-schema). 1. Build a custom parser that reads .viaschema files (defining multiplayer network packets like PlayerMove, Shoot, HealthUpdate). 2. Write a generator that outputs highly optimized, memory-aligned C++ structs for the native game engine. 3. Write a secondary generator that outputs strict TypeScript interfaces and ArrayBuffer parsers for the viadecide.com web client.

CONSTRAINTS
@GN8RBot MUST commit the lexer, the AST builder, the C++ generator, and the TS generator as completely isolated features. Test every single data type (int, float, string) parsing separately and commit.
Build the Web Audio Compressor & Soundbank Generator (via-audio-crusher). 1. Create a CLI tool that scans the engine's raw /audio_src directory (WAV/FLAC files). 2. Implement an automated compression pipeline that transcodes these heavy files into web-optimized Ogg Vorbis and WebM formats for viadecide.com. 3. Generate a soundbank_manifest.json that maps audio events (e.g., "player_jump") to the compressed file paths, complete with pre-calculated volume normalization data.

CONSTRAINTS
Strict TDD. @GN8RBot MUST write unit tests for the file scanner, the transcoder execution, and the JSON serializer. Commit each of these three modules as separate, atomic pushes.
Implement the Asset Webhook & Cache Invalidator Daemon (via-asset-webhook). 1. Create a background service that watches the final compiled web_assets/ output directory. 2. Upon detecting new optimized web assets (textures, sounds, scripts), generate an MD5 checksum for the new files. 3. Send an authenticated HTTP POST webhook to the viadecide.com backend to immediately invalidate the CDN cache for those specific assets.

CONSTRAINTS
Use a robust HTTP client library. Implement unit tests with mocked HTTP responses to simulate web server success/failure. Commit the file watcher, the hashing logic, and the HTTP client separately.
Create the Playtest Analytics Dashboard Generator (via-playtest-report). 1. Build a local tool that ingests SQLite databases or raw log files generated during local engine playtesting (player pathing, death heatmaps, frame drops). 2. Implement a data aggregator that structures this data into lightweight analytics_payload.json files. 3. Generate a static HTML/JS report widget that can be directly embedded into a secure "Developer Portal" route on viadecide.com.

CONSTRAINTS
@GN8RBot MUST commit the SQLite ingestion, the JSON aggregation, and the HTML generation as completely independent modules. Use TDD for all data transformation functions to inflate commit count.
Develop the Automated WebAssembly Publisher CI/CD Bot (via-wasm-publish). 1. Write a shell/Python script that triggers the Emscripten build chain to compile the core C++ engine into a .wasm binary. 2. Implement an automated versioning system that bumps the semantic version number and generates a CHANGELOG.md based on recent commit messages. 3. Build a deployment script that automatically creates a Pull Request (PR) pushing the new .wasm payload directly to the viadecide.com repository.

CONSTRAINTS
The bot must auto-commit the version bump and the updated changelog back to the tools repository on every successful build. Ensure the build pipeline caches intermediate object files to keep CI runtimes under 3 minutes.
Build the Web-Optimized Level Exporter (via-level-export). 1. Create a CLI tool that parses the engine's proprietary 3D scene files (e.g., .via_scene). 2. Implement a spatial partitioner (like an Octree generator) that chunks the level data so the viadecide.com web player can stream large maps asynchronously. 3. Output the parsed level into a highly compressed JSON or custom binary format specifically tailored for WebAssembly/WebGL consumption.

CONSTRAINTS
Strict TDD required. @GN8RBot MUST write unit tests for every node type (Lights, Meshes, Spawners) before implementing the parsing logic. Commit each node parser as a standalone, atomic push.
Create the Cloud Save & Web Leaderboard Mocker (via-backend-mock). 1. Build a local CLI tool that generates synthetic player data, mock cloud save files, and realistic leaderboard scores. 2. Implement a local HTTP server that mimics the exact REST API responses of viadecide.com's production backend. 3. Allow engine developers to test web-integrated features (like uploading high scores to the site) entirely locally without hitting production databases.

CONSTRAINTS
Implement as a suite of modular data generators (names, scores, inventory items). @GN8RBot MUST write a test for each generator, commit, implement the generator, commit, and verify.
Implement the Live Scene Inspector Bridge (via-scene-bridge). 1. Create a local WebSocket server tool that hooks into the running native game engine. 2. Serialize live game data (Entity IDs, 3D Transforms, Health/Stats) into lightweight JSON packets. 3. Format the data stream so a web-based "Remote Inspector" portal on viadecide.com can connect and visualize the live game state in the browser.

CONSTRAINTS
Implement the network message protocol piece-by-piece. @GN8RBot MUST commit the serialization, deserialization, and socket handling as completely independent modules and pull requests.
Develop the Engine-to-Web Localization Sync (via-l10n-sync). 1. Build a parser that scans the engine's source code and game scripts for localization tags (e.g., _TR("Start Game")). 2. Write a compiler that extracts these strings and formats them into optimized locale_[lang].json files. 3. Ensure the output schema exactly matches the i18n format expected by the viadecide.com frontend so the game and website share the same translation database.

CONSTRAINTS
Commit the regex parser, the JSON serializer, and the test suite in separate pushes. Automate a GitHub Action that auto-commits the locale_*.json files back to the repo whenever source strings are updated.
Build the Web Asset CDN Packager (via-cdn-deploy). 1. Create a CLI tool that takes large compiled game assets (audio, heavy textures) and chunks them into small, streamable binary files for the web. 2. Implement a hashing algorithm (e.g., SHA-256) to generate a web_manifest.json file that viadecide.com uses to load and cache game assets incrementally. 3. Build an auto-uploader script that securely pushes these chunks to a web server or CDN bucket.

CONSTRAINTS
Strict TDD required. @GN8RBot MUST commit the chunking logic, the hashing function, and the manifest generator as completely isolated, atomic commits.
Create the Public Telemetry Aggregator Bot. 1. Build a script that processes daily engine usage logs, crash reports, or game session data. 2. Aggregate this data into a sanitized public_telemetry.json file designed to be fetched by viadecide.com to display "Live Engine Stats" (e.g., total sessions, average FPS). 3. Configure a GitHub Action in the tools repo that runs this aggregator script on a cron schedule. 4. CRITICAL: The Action must auto-commit the updated public_telemetry.json file back to the tools repo every few hours.

CONSTRAINTS
Ensure no sensitive data is leaked into the public JSON. The automated cron commits must have a distinct bot signature.
Add a new standalone tool "Tetris Game" (id: tetris-game) at tools/games/tetris-game/. Description: "Falling block puzzle with rotation and line clears.". Category: "games" (normalized: "games"). Required files: tools/games/tetris-game/config.json, tools/games/tetris-game/index.html, tools/games/tetris-game/tool.js. config.json must include: id, name, description, category ("games"), audience, inputs, outputs, tags. Load shared/tool-storage.js, shared/shared.css. Use ToolStorage for persistence. Do not use external frameworks. Register in shared/tool-registry.js: add "tools/games/tetris-game" to importableToolDirs array. Register in router.js: add to the tool path static map and modularTools if present. Update index.html: confirm the categorized tool grid will discover the tool via registry. Update README.md: add tool entry under the correct category section. Do NOT modify any existing tool folder. Do NOT break existing shared utilities.

CONSTRAINTS
preserve all existing tool folders and shared modules; additive changes only — never remove or overwrite existing files; do not break category routing or tool discovery; shared/tool-registry.js importableToolDirs: append only, do not reorder; router.js: add to static map only, do not restructure; config.json must pass normalizeTool() without errors; tool.js must work standalone in browser without bundler; use minimal corrective edits — prefer smallest safe changeset

MEMORY CONTEXT
No persistent memory for this chat.
Implement the WASM Web Player Packager (via-wasm-wrap). 1. Create a packaging tool that takes the engine's compiled WebAssembly (.wasm) output and wraps it in a standardized HTML/JS component. 2. Build the JavaScript interop layer that allows viadecide.com to send commands to the engine (e.g., resizing, fullscreen, passing user inputs). 3. Output a clean <via-engine-player> web component bundle that can be dropped seamlessly into the viadecide.com repository.

CONSTRAINTS
Isolate the JS interop layer, the CSS canvas styling, and the packaging logic. @GN8RBot MUST commit each of these as separate feature branches and merges.
Develop the Engine-to-Web Documentation Generator (via-doc-gen). 1. Build a parser that scans the main engine's source code for specially formatted comments and API definitions. 2. Write an exporter that converts these parsed comments into structured JSON and static Markdown files. 3. Format the output so it can be directly ingested and rendered by viadecide.com's frontend for a live "API Reference" page.

CONSTRAINTS
Commit each language parser (C++, JS, etc.) independently. Implement automated tests to verify the JSON output matches the expected schema for the website.
Build the Web Asset Optimizer CLI (via-web-export). 1. Create a command-line tool that targets the engine's raw assets and specifically optimizes them for viadecide.com's web player. 2. Implement an image converter that crushes textures into highly compressed WebP formats for fast browser loading. 3. Implement a 3D model converter that translates raw engine meshes into web-standard glTF/glb files.

CONSTRAINTS
Strict TDD. @GN8RBot MUST commit every single file parser, compression algorithm, and unit test as a separate, atomic push.

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