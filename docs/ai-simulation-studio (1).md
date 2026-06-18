# AI Simulation Studio

## Overview

The AI Simulation Studio introduces an AI-driven generation flow for playable runtime modules inside Decide Engine Studio.

Users (or Zayvora) can submit prompt requests such as:
- Create a simulation
- Create a strategy game
- Create a skill network

The platform selects a template, generates a runtime module definition, registers it, and launches it in the shared engine runtime.

## Generation Flow

1. **Prompt Intake**
   - Studio UI captures a request string.
   - `AISimulationPipeline.parseRequest()` derives an environment name and normalized prompt.

2. **Template Selection**
   - `GameScaffoldGenerator.normalizeTemplate()` maps explicit template selection or infers one from prompt keywords.

3. **Module Generation**
   - `EnvironmentBuilder.buildEnvironmentTemplate()` constructs a runtime-ready environment object with:
     - config metadata
     - game logic factory
     - UI factory

4. **Module Registration**
   - `SimulationGenerator.generateModule()` stores generated modules in localStorage and in runtime memory.
   - `GameLoader.registerDynamicModule()` exposes the module to runtime loading.

5. **Launch**
   - `AISimulationPipeline.launchSimulation()` starts the selected environment via `EngineCore.startSimulation(name)`.

## Simulation Templates

Template scaffolds are under `/templates`:

- `/templates/strategy-game`
- `/templates/simulation`
- `/templates/network-game`
- `/templates/sandbox`

Each template folder includes:
- `game-entry.js`
- `ui-template.js`
- `config-template.json`

## Engine Runtime Integration

The runtime loader now supports:
- built-in module manifest loading (`/games/manifest.json`)
- dynamic module registration from AI generation

This allows generated environments to run without requiring a file-system write during browser runtime.

## Public API

The following APIs are globally available:

- `generateSimulation(prompt, options)`
- `launchSimulation(name)`
- `listSimulations()`

Example:

```js
generateSimulation('Create a Mars colony economy simulation', {
  template: 'simulation',
  creator: 'zayvora',
  autoLaunch: true
});
```

## Zayvora Integration

Zayvora can trigger generation by calling the same API flow:

workspace request -> zayvora reasoning -> simulation generator -> engine runtime -> simulation launched.

## Marketplace Metadata

Generated simulation config objects include metadata fields for marketplace integration:

- `creator`
- `type`
- `launchUrl`

These fields can be consumed by daxini.space publication workflows.
