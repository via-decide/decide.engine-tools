Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement the SwarmGraphBinder to map Agent States to SVG Data Streams. 1. Create shared/swarm-graph-binder.js. 2. Implement a function updateSwarmGraph(activeAgentsArray). This array contains objects like [{ id: 'researcher', status: 'computing', linkedTo: 'summarizer' }]. 3. The function must query the DOM for all SVG nodes matching .swarm-node[data-agent-id="..."] and SVG paths matching .swarm-link[data-link-source="..."]. 4. Logic mapping:
Wire the Supabase Realtime payload to the CSS Cyber-Health Bar. 1. Open shared/circle-manager.js (or your multiplayer handler). 2. Locate the Supabase WebSocket listener that receives UPDATE events for the pest_sieges table. 3. When a payload arrives (e.g., { current_hp: 4500, max_hp: 5000 }), calculate the percentage: const hpPercent = (current_hp / max_hp) * 100. 4. Select the DOM element with the .siege-health-fill class. 5. Dynamically update its CSS variable: element.style.setProperty('--hp-percent', \${hpPercent}%\). 6. Select the parent .siege-health-track container and temporarily add the .taking-damage class. Remove it after 200ms using setTimeout.
Build the TerminalLogger to map LLM JSON outputs into the CRT CSS UI. 1. Create shared/terminal-logger.js. 2. Implement a TerminalLogger class with a streamToUI(elementId, jsonPayload) method. 3. The method must target a container with the .hud-terminal class (built in the CSS phase). 4. Instead of dumping raw text, it must parse the jsonPayload. For each key-value pair (e.g., {"step": "Analyzing", "status": "Success"}), it should dynamically generate HTML lines. 5. If status === "Success", append the .status-ok class (triggering the green glow). If status === "Error", append the .btn-glitch class to the text to make it visually unstable. 6. Add a simulated "typing" delay (e.g., 20ms per character) to the output so it feels like a retro console receiving live data, appending the .cursor-blink class to the last active line.

RULES
1. Audit touched files first and identify regressions.
2. Preserve architecture and naming conventions.
3. Make minimal repairs only; do not expand scope.
4. Re-run checks and provide concise root-cause notes.
5. Return complete contents for changed files only.

SOP: REPAIR PROTOCOL (MANDATORY)
1. Strict Fix Only: Do not use repair mode to expand scope or add features.
2. Regression Check: Audit why previous attempt failed before proposing a fix.
3. Minimal Footprint: Only return contents for the actual repaired files.

REPO CONTEXT
- README snippet:
⭐ If this saved you $X in API costs, star this repo Help other devs discover metadata-driven development # VIA Platform: 58-Tool Ecosystem with 80% Token Savings > **Before you fork another monorepo: This one saved me $33,756 in API costs and 2.25M tokens. Here's how.** [Detailed breakdown...] #
- AGENTS snippet:
# AGENTS.md — ViaDecide Studio ## Rules for all AI coding agents working in this repository --- ## IDENTITY This is a **production codebase** for a $199/month subscription product on the Play Store. Every change you make affects paying subscribers. Treat it accordingly. --- ## HARD GATE 1 — DES
- package.json snippet:
{ "name": "decide-engine-tools", "version": "1.0.0", "description": "ViaDecide Studio — 37 decision-making, productivity and game tools", "private": true, "scripts": { "test": "node tests/run-all.js", "test:unit": "node tests/unit/run.js", "test:smoke": "node tests/smoke/run.js