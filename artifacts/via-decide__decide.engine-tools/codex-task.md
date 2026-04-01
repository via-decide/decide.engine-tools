You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Build a new micro-frontend named 'TwinTerminal' (The Cognitive RAG Chat). Create a new folder /TwinTerminal and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Setup & Auth: - A side panel to input Gemini API Key (BYOK) and a drag-and-drop zone to load the .vdb (Vector Database) file into memory. - Display a "Brain Status" indicator (e.g., Status: Synced | Memories: 5,821). 2. The Chat Interface: - A main chat window (like ChatGPT) with a message input area at the bottom. - Support for Markdown rendering in the chat bubbles. 3. The Local RAG Pipeline (The Magic): - When the user sends a message, FIRST ping the Gemini Embedding API to vectorize their text. - SECOND, run local cosine similarity against the .vdb file to find the Top 3 most relevant historical commits/PRDs. - THIRD, compile a master prompt: "You are the user's Cognitive Twin. Answer their query using ONLY the following historical architectural memories: [Insert Top 3 Memories]. Query: [User Message]". - FOURTH, send this master prompt to the Gemini text generation API. 4. Streaming Response & Citations: - Use the Gemini Streaming API to type out the response in real-time. - At the bottom of the AI's response bubble, append a small "Citations" block showing exactly which past commits it used to generate the answer (e.g., Recalled: "Swipe UI Logic" (Week 4), "Viaco Dashboard" (Week 12)). UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Must implement fetch with streaming (response.body.getReader()) to ensure the chat feels instantaneous and modern. The RAG pipeline must execute silently in the background before the chat response begins.
Build a new micro-frontend named 'VisionPruner' (The Vision API Token Squeezer). Create a new folder /VisionPruner and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Dropzone: - A massive, dashed drag-and-drop area for images (PNG, JPG, HEIC if supported). - Display the original file size and dimensions (e.g., Raw: 3840x2160, 4.2MB). 2. The Compression Engine (Canvas API): - Load the image into an HTML5 <canvas>. - Slider 1: 'Max Dimension' (Default 1024px, slider down to 512px). Maintain aspect ratio. - Slider 2: 'WebP Quality' (Default 0.6).

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS and HTML5 Canvas. Processing must happen 100% locally in the browser so sensitive UI screenshots are never uploaded to a third-party compression server.
Build a new micro-frontend named 'PromptMatrix' (The XML Metaprompt Compiler). Create a new folder /PromptMatrix and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Visual Form Inputs: - System Role (textarea): Who the AI is acting as. - Primary Objective (textarea): The core goal. - Constraints (Dynamic list): A section to click [+ Add Constraint] and type strict rules (e.g., "Do not use markdown"). - Output Format (Dropdown & text): Select JSON, XML, or Plain Text, and define the exact schema. - Few-Shot Examples (Dynamic list): Fields for Input Example and Expected Output Example. 2. The XML Compiler Engine: - On compilation, wrap every filled section in its corresponding XML tag (Anthropic/Google best practice standard). - E.g., wrap the role in <system_role>, constraints in <rules><rule>...</rule></rules>, and examples in <examples><example>...</example></examples>. 3. Real-Time Preview & Token Stats: - As the user types, instantly update a <textarea> on the right half of the screen with the live compiled XML prompt. - Show an estimated token count (assume ~4 chars per token) to keep the system prompt lean. 4. The Payload Delivery: - Provide a massive [ COPY METAPROMPT ] button to instantly copy the hardened XML string for deployment into LogicHub or Viaco's backend. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. DOM manipulation for adding dynamic input rows must be smooth. The output must perfectly escape any reserved characters to prevent XML parsing errors in the LLM.
Build a new micro-frontend named 'AIRForge' (The Agent Function Registry). Create a new folder /AIRForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Function Builder Panel: - Function Name (e.g., "fetchLiveStockPrice"). - Description (textarea): Tell the LLM exactly when and why to use this tool.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. The compiled JSON schema must strictly adhere to the OpenAPI 3.0 specification used by major LLM providers for function calling to ensure zero API rejection errors.
Build a new micro-frontend named 'DataForge' (The Synthetic Payload Engine). Create a new folder /DataForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Configuration Panel:

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Must robustly handle the API response by parsing out markdown code blocks (e.g., `json ... ```) to ensure the final copied payload is mathematically pure and ready to drop into a database or frontend state.
Build a new micro-frontend named 'ChunkForge' (The Semantic Text Splitter). Create a new folder /ChunkForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Input Panel: - A massive <textarea> for pasting raw documentation, SOPs, or massive codebases. - Slider 1: Chunk Size (Characters) (Range: 250 to 2000, Default 1000). - Slider 2: Overlap (Characters) (Range: 0 to 500, Default 150). - A massive [ FORGE SEMANTIC CHUNKS ] button. 2. The Splitting Engine: - Write a vanilla JS function that splits the text intelligently. - It should prioritize splitting at double newlines (\n\n), then single newlines (\n), then periods (. ), to avoid cutting in the middle of a sentence or code block. - It must respect the Overlap setting (the end of Chunk 1 becomes the beginning of Chunk 2 to preserve contextual flow). 3. Live Telemetry UI: - On the right side, display the results in a scrollable, glass-morphic list.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. The chunking algorithm must be robust enough to handle edge cases like extremely long sentences without crashing, falling back to a hard character slice only if absolutely necessary.
Build a new micro-frontend named 'VibeRender' (The Instant LLM UI Sandbox). Create a new folder /VibeRender and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Split UI Layout:

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. The iframe must be sandboxed but allow scripts (sandbox="allow-scripts allow-same-origin"). The execution must be purely client-side with no server round-trips for maximum speed and privacy.
Build a new micro-frontend named 'AIRManager' (The AI Resource Manager). Create a new folder /AIRManager and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Roster Dashboard: - A grid displaying currently active "Agent Profiles" as glass-morphic ID cards. - A massive [ + ONBOARD NEW AGENT ] button. 2. The Onboarding Modal: - Agent Name (e.g., "Viaco Scheduler"). - LLM Model (Dropdown: Gemini 3.1 Pro, Claude 3.5, Local Llama). - System Role (Textarea - meant to paste output from PromptMatrix). - Tool Permissions (Checkboxes/Input to define which functions from ToolForge this agent is allowed to call). - Token Budget (Slider: Max tokens allowed per session - acts as their compute "salary"). 3. The Roster State: - Save the deployed agents to an array of objects in localStorage so the roster persists across reloads. - Add [ EDIT ] and [ OFFBOARD ] (Delete) buttons to each agent's ID card. 4. The Payload Delivery: - A [ DOWNLOAD AIR_ROSTER.JSON ] button. This compiles the entire organization of agents into a single master JSON configuration file that a backend router can use to orchestrate the multi-agent system. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. DOM manipulation for the dynamic dashboard must be clean. The exported JSON must be strictly formatted so it can be ingested by an orchestrator script without parsing errors.
Build a new micro-frontend named 'AIREval' (The Agent Performance Crucible). Create a new folder /AIREval and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Dropzones & Config:

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Must handle API rate limits (429 errors) gracefully by pausing the loop and resuming, ensuring the simulation completes without crashing. The JSON validation check must be highly robust to catch LLM syntax hallucinations.
Build a new micro-frontend named 'AIRSwarm' (The Multi-Agent Routing Engine). Create a new folder /AIRSwarm and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. Setup & Roster Load:

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. The execution cascade must handle async/await cleanly so the UI doesn't freeze while waiting for API responses. If an agent fails or throws an API error, the swarm must pause and highlight the failing node in red.
Build a new micro-frontend named 'AIRTrace' (The Swarm Observability Deck). Create a new folder /AIRTrace and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Ingestion Engine: - A massive dropzone to load swarm_log.json (exported from AIRSwarm). 2. The Waterfall Dashboard (Timeline): - Parse the JSON array of agent interactions. - Render a chronological waterfall chart. Each block represents an Agent's API call. - Width of the block represents execution time (latency). - Color-code the blocks: Matrix Cyan #00e5ff (Success) and Saffron #ff671f (Failed/Error). 3. The Inspector Panel: - When a user clicks a block on the timeline, slide out a detailed inspector panel on the right. - Show 4 tabs: [ Payload In ], [ Payload Out ], [ Metrics ], [ RAG Context ].

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. DOM rendering for the waterfall chart must use flexbox or CSS Grid creatively to represent time visually, without relying on heavy charting libraries like Chart.js or D3.
Build a new micro-frontend named 'AIRBlueprint' (The Meta-Agency Synthesizer). Create a new folder /AIRBlueprint and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Synthesis Engine:

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. The JSON parsing must be highly resilient to ensure the LLM's output perfectly matches the schema required by the other AIR tools. The org-chart rendering should use simple CSS Grid/Flexbox or basic SVG lines, avoiding heavy libraries.
Build a new micro-frontend named 'AIRMount' (The Local File System Bridge). Create a new folder /AIRMount and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Secure Mounting Engine: - A massive [ MOUNT LOCAL DIRECTORY ] button. - When clicked, trigger window.showDirectoryPicker() to prompt the user to select a local folder on their machine. - Request persistent read/write permissions for that directory handle. 2. The File Tree Explorer: - Recursively read the mounted directory. - Render a visual, collapsible File Tree UI on the left side of the screen (e.g., 📁 src, 📄 index.html, 📄 data.csv). - Clicking a file opens its contents in a <textarea> on the right side for manual review/editing. 3. The Agent API Bridge: - Wrap the File System Access API into 3 pure JS functions: agentReadFile(path), agentWriteFile(path, content), and agentListDirectory(path). - Expose these functions to the window object so they can be injected into the AIRSwarm execution environment. 4. Telemetry UI & Safeguards: - Display an "Active Mount" status indicator (e.g., Mounted: /Users/admin/projects/LogicHub). - Show a live event log: [10:45:02] Agent 'Viaco Coder' modified /src/styles.css. UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Must strictly use the modern File System Access API. Include robust try/catch error handling for permission denials or unsupported browsers (fallback gracefully). The agent API bridge must be clearly documented in the UI so the user knows how to pass these functions to AIRForge.
Build a new micro-frontend named 'DaxiniPulse' (The Sovereign Heartbeat Monitor). Create a new folder /DaxiniPulse and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. API Health Checkers: - Use fetch to ping the Gemini API and GitHub API (using stored keys) to verify they are active and check remaining rate limits.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Use setInterval to refresh the data every 60 seconds. Ensure the UI is responsive so it can be monitored on a secondary monitor or a tablet in Gandhidham.
Build a new micro-frontend named 'DaxiniWall' (The Sovereign Proof-of-Work Gallery). Create a new folder /DaxiniWall and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Global Record Counter: - Fetch the current 'Merge' count from the ViaLogic repository using Octokit. - Display a massive, glowing number: 'OFFICIAL RECORD STATUS: [N] / 24,000'. 2. The Uniqueness Validator: - Load the metadata for all 24,000 entities. - Perform a 'Fingerprint Check' (hashing the identity.json/manifesto.md files). - Display the Uniqueness Metric: "Uniqueness Probability: 99.9999% (Verified by DaxiniWall)". 3. The Infinite Scroll Gallery: - Implement a high-performance virtualized list to render 24,000 entity thumbnails without crashing the browser. - Each thumbnail should be a miniature version of the Daxini Glass-morphic card. 4. The Efficiency Banner: - A permanent footer displaying: "Total Sovereign Savings: 18.7M Tokens ($1,200 saved using decide.engine-tools)". UI/UX AESTHETIC: - Adhere to the Daxini OS standard.

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Use 'IntersectionObserver' for the infinite scroll. The hash-check logic must be optimized to run on the client-side without lagging the main UI thread.
Build a new micro-frontend named 'DaxiniForge' (The Sovereign App Factory). Create a new folder /DaxiniForge and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Blueprint Selector: - Allow the user to drag-and-drop URLs or IDs from DaxiniSearch/DaxiniHive into a 'Forge Slot'.
Build a new micro-frontend named 'DaxiniHive' (The Collective Intelligence Interface). Create a new folder /DaxiniHive and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Hive Assembly Engine:

CONSTRAINTS
Zero NPM dependencies. Pure Vanilla JS. Must interface with the existing 'DaxiniSearch' metadata index to ensure instantaneous team selection without redundant API calls.
Build a new micro-frontend named 'DaxiniImmune' (The Self-Healing Sentinel). Create a new folder /DaxiniImmune' and a single index.html file inside it. CORE LOGIC (Pure Vanilla JS): 1. The Random Patrol Engine: - Use a 'Random Walk' algorithm to select 50 random folders from ViaLogic/people, /logic, /assets, and /ops every hour. 2. The Diagnostic Layer: - For the selected entities, run a 'Dry Run' of the JS logic. - Use Gemini 1.5 Flash to 'Spot Check' the README content against the manifest.json.

CONSTRAINTS
Zero NPM dependencies for the core logic. If using a library for ZIP generation, use a CDN link. The dependency resolution must handle missing files gracefully by suggesting alternatives from the 24,000-unit pool.

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
⭐ If this saved you $X in API costs, star this repo Help other devs discover metadata-driven development # VIA Platform: 58-Tool Ecosystem with 80% Token Savings > **Before you fork another monorepo: This one saved me $33,756 in API costs and 2.25M tokens. Here's how.** [Detailed breakdown...] #

- AGENTS snippet:
# AGENTS.md — ViaDecide Studio ## Rules for all AI coding agents working in this repository --- ## IDENTITY This is a **production codebase** for a $199/month subscription product on the Play Store. Every change you make affects paying subscribers. Treat it accordingly. --- ## HARD GATE 1 — DES
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