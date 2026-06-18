// GENERATED VIA METADATA MAP

declare module 'shared/agent-layer.js' {
  function tokenize(text): any;
  function scoreTool(tool, tokens): any;
  function pickToolsForTask(taskPrompt, tools, limit = 5): any;
  function createAgentWorkflow(agentName, taskPrompt, tools): any;
  function runAgentTask(agentWorkflow, allTools, options = {}): any;
}

declare module 'shared/agent-runtime.js' {
  function getIdentityForUser(userId): any;
  function injectIdentity(prompt, userId, options = {}): any;
  function run(agent, tools, options): any;
  function runSequentially(agent, tools, context = {}): any;
  function runSequentiallyAsync(agent, tools, context = {}): any;
  function getLastRun(): any;
}

declare module 'shared/agent-storage.js' {
  function loadAll(): any;
  function saveAll(agents): any;
  function save(agent): any;
  function findById(id): any;
}

declare module 'shared/circle-manager.js' {
  function getSupabaseClient(): any;
  function listCircles(): any;
  function createCircle(name): any;
  function attackSiege(memberId, damage, circleId): any;
  function subscribeSiegeUpdates(): any;
  // Dispatches CustomEvent: 'circle:error'
  // Dispatches CustomEvent: 'circle:siege_hit'
}

declare module 'shared/commandRouter.js' {
  function resolveCommandRoute(command): any;
}

declare module 'shared/components.js' {
}

declare module 'shared/engine-balance.js' {
  function analyzeBalance(sim): any;
  function round(v): any;
}

declare module 'shared/engine-models.js' {
  function asNumber(value, fallback = 0): any;
  function baseMetrics(parsed, mode, secondary): any;
  function template(name, metrics, extras): any;
}

declare module 'shared/engine-utils.js' {
  function tryParse(value): any;
  function clamp(num, min, max): any;
  function weightedScore(parts): any;
}

declare module 'shared/event-validator.js' {
}

declare module 'shared/growth-stage-engine.js' {
  function getInitData(): any;
  function stageForXP(xp): any;
  function syncStage(): any;
  function hydrateFromServer(payload = {}): any;
  function postPlantUpdate(delta): any;
  function init(): any;
  function applyTick(): any;
  function addXP(amount = 0): any;
  function waterPlant(amount = 0): any;
  function getState(): any;
  // Dispatches CustomEvent: 'growth:stage_evolved'
  // Dispatches CustomEvent: 'growth:state_updated'
}

declare module 'shared/layout.js' {
  function escapeHtml(value): any;
  function renderLayout({ mount, title = 'decide.engine tools', navItems = [] }): any;
}

declare module 'shared/mock-injector.js' {
}

declare module 'shared/patch-applier.js' {
  function applyJSONPatch(sourceString, patchJSON): any;
}

declare module 'shared/progression-engine.js' {
  function init(): any;
  function applyTick(): any;
  function waterPlant(amount = 0): any;
}

declare module 'shared/reward-wallet.js' {
  function getInitData(): any;
  function postTransaction(payload): any;
  function applyDelta(currency, amount): any;
  function rollback(currency, amount): any;
  function earn(currency, amount = 0, reason = 'unknown'): any;
  function spend(currency, amount = 0, reason = 'unknown'): any;
  function syncBalances(balances = {}): any;
  function getBalances(): any;
  // Dispatches CustomEvent: 'wallet:earned'
  // Dispatches CustomEvent: 'wallet:synced'
  // Dispatches CustomEvent: 'wallet:sync_error'
  // Dispatches CustomEvent: 'wallet:insufficient'
  // Dispatches CustomEvent: 'wallet:spent'
}

declare module 'shared/season-engine.js' {
  function load(): any;
  function save(): any;
  function getTodayWeather(): any;
  function advanceDay(): any;
  // Dispatches CustomEvent: 'season:day_advanced'
}

declare module 'shared/simulation-utils.js' {
  function createRng(seed): any;
  function pickName(rng): any;
  function generatePlayer(id, archetype, rng): any;
  function generateBatch(count, archetypeMix, seed): any;
  function simulateDay(player, dayIndex, rng): any;
  function weeklyHarvest(weekDays): any;
  function promotionCheck(playerState): any;
  function fairRankScore(playerState): any;
  function simulatePlayer(player, durationDays, rng): any;
  function runSimulation(players, durationDays, seed): any;
  function jitter(): any;
}

declare module 'shared/swipe-engine.js' {
  function getInitData(): any;
  function validateSession(results): any;
  function pickCards(): any;
  function startSession(): any;
  function completeSession(): any;
  function swipeCard(direction): any;
  // Dispatches CustomEvent: 'swipe:session_completed'
  // Dispatches CustomEvent: 'swipe:session_error'
}

declare module 'shared/tool-bridge.js' {
  function createEnvelope(payload): any;
  function sendContext(fromToolId, toToolId, data): any;
  function receiveContext(toolId): any;
  function peekContext(toolId): any;
  function openTool(entryPath): any;
  // Dispatches CustomEvent: 'toolbridge:send'
}

declare module 'shared/tool-bus.js' {
  function getStorage(): any;
  function getSource(): any;
  function emit(channel, payload): any;
  function read(channel): any;
  function clear(channel): any;
  function listChannels(): any;
  function onUpdate(channel, callback, intervalMs = 1500): any;
  function buildPipelineStatus(steps, currentStep): any;
}

declare module 'shared/tool-graph.js' {
  function escapeHtml(value): any;
  function buildLegend(container): any;
  function buildAgentNodes(agents): any;
  function renderGraph(svg, graphRoot, nodesGroup, edgesGroup, tooltip, nodes, edges): any;
  function init(): any;
  function apply(): any;
}

declare module 'shared/tool-intelligence.js' {
  function uniqueEdges(edges): any;
  function ioDependencies(tools): any;
  function relatedEdges(tools): any;
  function scoreTool(tool): any;
  function analyze(tools): any;
}

declare module 'shared/tool-registry.js' {
  function normalizeCategory(category): any;
  function normalizeTool(meta, toolDir): any;
  function getPersistedPlugins(): any;
  function savePlugins(plugins): any;
  function loadManifest(): any;
  function loadToolMeta({ toolDir, metaPath }): any;
  function loadAll(): any;
  function findById(id): any;
  function getCategories(): any;
  function registerPlugin(pluginMeta): any;
  function registerPlugins(plugins): any;
  function getGraph(): any;
  function normalizeLLMText(payload): any;
  function llmRouter(input = {}, options = {}): any;
}

declare module 'shared/tool-storage.js' {
  function read(key, fallback): any;
  function write(key, value): any;
  function remove(key): any;
}

declare module 'shared/utils.js' {
}

declare module 'shared/vd-auth.js' {
  function init(): any;
  function updateLoginWall(): any;
}

declare module 'shared/vd-nav-fix.js' {
  function getHomeHref(): any;
  function addNav(): any;
}

declare module 'shared/vd-wallet.js' {
  function _sparksKey(): any;
  // Dispatches CustomEvent: 'vdwallet:updated'
}

declare module 'shared/workflow-engine.js' {
  function createStep(step, index): any;
  function createWorkflow(id, name, steps): any;
  function setRunState(state): any;
  function getRunState(): any;
  function clearRunState(): any;
  function runWorkflow(workflow, allTools, options = {}): any;
}

declare module 'shared/workflow-storage.js' {
  function loadAll(): any;
  function saveAll(workflows): any;
  function save(workflow): any;
  function findById(id): any;
  function remove(id): any;
}

declare module 'shared/workflow-ui.js' {
  function uid(): any;
  function currentAgent(): any;
  function saveDraft(): any;
  function renderToolOptions(selectedId): any;
  function updatePreview(extra): any;
  function bindStepInputs(): any;
  function render(): any;
  function addStep(prefill): any;
  function refreshSavedAgents(): any;
  function loadAgent(agent): any;
  function bindControls(): any;
  function restoreDraft(): any;
  function init(): any;
  function el(id): any;
}
