(function (global) {
  'use strict';

  const DEFAULT_PARAMS = {
    vehicleSpeed: 100,
    nodePositions: [150, 400, 650, 900],
    signalDecay: 0.33,
    latency: 12,
    packetLoss: 0.02
  };

  const TOOL_ENTRY_MAP = {
    'decision-matrix': 'tools/decision-matrix/index.html',
    'scenario-planner': 'tools/scenario-planner/index.html',
    'output-evaluator': 'tools/output-evaluator/index.html',
    'analytics-bay': 'tools/engine/leaderboard-analytics/index.html'
  };

  const runtime = global.DECIDE || {
    engine: {},
    tools: {},
    simulation: {},
    ui: {}
  };
  global.DECIDE = runtime;

  const state = {
    pos: 0,
    speedStep: 2,
    isEmergency: false,
    params: { ...DEFAULT_PARAMS },
    dom: {},
    lab: null,
    latestEvolution: null
  };

  function getEngineUtils() {
    const fallback = {
      clamp(num, min, max) { return Math.max(min, Math.min(max, num)); },
      weightedScore(parts) {
        return Object.keys(parts).reduce((sum, key) => {
          const item = parts[key] || { value: 0, weight: 0 };
          return sum + (item.value * item.weight);
        }, 0);
      }
    };
    return global.EngineUtils || fallback;
  }

  function resolveToolEntry(toolName) {
    const key = String(toolName || '').trim().toLowerCase();
    if (TOOL_ENTRY_MAP[key]) return TOOL_ENTRY_MAP[key];
    return null;
  }

  runtime.tools.load = function loadTool(toolName) {
    const entry = resolveToolEntry(toolName);
    const frame = state.dom.toolFrame;
    if (!frame || !entry) return null;
    frame.src = `./${entry}`;
    return entry;
  };

  runtime.simulation.run = function runSimulation(params) {
    const utils = getEngineUtils();
    const merged = { ...state.params, ...(params || {}) };
    merged.nodePositions = Array.isArray(merged.nodePositions) && merged.nodePositions.length
      ? merged.nodePositions.slice().sort((a, b) => a - b)
      : DEFAULT_PARAMS.nodePositions.slice();

    const spacing = merged.nodePositions
      .slice(1)
      .map((pos, idx) => pos - merged.nodePositions[idx]);
    const avgSpacing = spacing.length
      ? spacing.reduce((sum, n) => sum + n, 0) / spacing.length
      : 250;

    const signalScore = utils.clamp(100 - (avgSpacing * merged.signalDecay * 0.22), 0, 100);
    const latencyScore = utils.clamp(100 - (merged.latency * 2.1), 0, 100);
    const packetScore = utils.clamp(100 - (merged.packetLoss * 1300), 0, 100);
    const mobilityScore = utils.clamp(100 - Math.max(0, merged.vehicleSpeed - 90) * 0.75, 0, 100);

    const reliability = utils.clamp(
      utils.weightedScore({
        signal: { value: signalScore, weight: 0.34 },
        latency: { value: latencyScore, weight: 0.26 },
        packet: { value: packetScore, weight: 0.2 },
        mobility: { value: mobilityScore, weight: 0.2 }
      }),
      0,
      100
    );

    state.params = merged;
    return {
      params: merged,
      telemetry: {
        signalScore,
        latencyScore,
        packetScore,
        mobilityScore,
        reliability,
        recommendedRsuPlacement: merged.nodePositions
      }
    };
  };

  runtime.simulation.optimize = function optimizeSimulation() {
    const utils = getEngineUtils();
    const candidates = [120, 180, 240, 300, 360, 420, 480, 560, 640, 720, 800, 880, 960];
    let best = null;

    for (let i = 0; i < 250; i += 1) {
      const shuffled = candidates.slice().sort(() => Math.random() - 0.5);
      const nodePositions = shuffled.slice(0, 4).sort((a, b) => a - b);
      const scenario = runtime.simulation.run({
        vehicleSpeed: 80 + Math.round(Math.random() * 55),
        signalDecay: 0.2 + (Math.random() * 0.25),
        latency: 8 + (Math.random() * 20),
        packetLoss: 0.005 + (Math.random() * 0.06),
        nodePositions
      });

      const adjusted = utils.clamp(
        scenario.telemetry.reliability - (Math.max(0, scenario.params.latency - 18) * 0.45),
        0,
        100
      );

      const run = {
        ...scenario,
        telemetry: {
          ...scenario.telemetry,
          adjustedReliability: adjusted
        }
      };

      if (!best || run.telemetry.adjustedReliability > best.telemetry.adjustedReliability) {
        best = run;
      }
    }

    return {
      trials: 250,
      bestLayout: best.params.nodePositions,
      bestTelemetry: best.telemetry,
      example: {
        corridor: '1km pilot',
        projectedCoverage: `${Math.round(best.telemetry.signalScore)}%`,
        expectedP95LatencyMs: Number(best.params.latency.toFixed(2))
      }
    };
  };

  runtime.simulation.initializeLab = function initializeLab(options) {
    if (!global.HighwayLabEngine || !global.HighwayLabEngine.createLabEngine) return null;
    state.lab = global.HighwayLabEngine.createLabEngine(options || {});
    return state.lab;
  };

  runtime.simulation.runEvolution = function runEvolution(options) {
    if (!state.lab) runtime.simulation.initializeLab();
    if (!state.lab) return null;
    state.latestEvolution = state.lab.runEvolution(options || {});
    return state.latestEvolution;
  };

  function drawNodes(nodePositions) {
    const { highway } = state.dom;
    if (!highway) return;

    highway.querySelectorAll('.rsu-node, .signal-aura').forEach((node) => node.remove());

    nodePositions.forEach((x) => {
      const node = document.createElement('div');
      node.className = 'rsu-node';
      node.style.left = `${x}px`;
      highway.appendChild(node);

      const signal = document.createElement('div');
      signal.className = 'signal-aura';
      signal.style.left = `${x - 125}px`;
      signal.style.width = '250px';
      highway.appendChild(signal);
    });
  }

  function renderTelemetry(report) {
    if (!report || !state.dom.uiRssi || !state.dom.barRssi || !state.dom.uiLatency) return;
    const rssi = -40 - ((100 - report.telemetry.signalScore) * 0.7);
    state.dom.uiRssi.innerText = `${Math.round(rssi)} dBm`;
    state.dom.barRssi.style.width = `${Math.max(0, 100 + rssi)}%`;
    state.dom.barRssi.className = rssi < -75 ? 'h-full bg-red-500 transition-all' : 'h-full bg-cyan-500 transition-all';
    state.dom.uiLatency.innerText = String(Math.round(report.params.latency));
    drawNodes(report.params.nodePositions);
  }

  function animate() {
    if (!state.isEmergency) {
      state.pos += state.speedStep;
      if (state.pos > 1000) state.pos = -50;
      state.dom.car.style.left = `${state.pos}px`;

      const report = runtime.simulation.run({
        vehicleSpeed: state.speedStep * 40,
        latency: Number(state.dom.uiLatency.innerText) || state.params.latency
      });
      renderTelemetry(report);
    }

    global.requestAnimationFrame(animate);
  }

  function bindUi() {
    state.dom.runScenarioBtn.addEventListener('click', () => {
      runtime.tools.load('scenario-planner');
      const report = runtime.simulation.run({
        vehicleSpeed: Number(state.dom.uiSpeed.innerText) || 100,
        latency: 9 + Math.random() * 15,
        packetLoss: 0.01 + Math.random() * 0.05,
        signalDecay: 0.25 + Math.random() * 0.2
      });
      renderTelemetry(report);
    });

    state.dom.optimizeCorridorBtn.addEventListener('click', () => {
      runtime.tools.load('decision-matrix');
      const result = runtime.simulation.optimize();
      state.dom.optimizationResult.textContent = JSON.stringify(result, null, 2);
      const report = runtime.simulation.run({
        nodePositions: result.bestLayout,
        latency: result.example.expectedP95LatencyMs
      });
      renderTelemetry(report);
    });

    state.dom.evaluateNetworkBtn.addEventListener('click', () => {
      runtime.tools.load('output-evaluator');
      const report = runtime.simulation.run();
      state.dom.optimizationResult.textContent = JSON.stringify({
        evaluation: report.telemetry.reliability >= 80 ? 'Network nominal' : 'Network needs intervention',
        reliabilityScore: Number(report.telemetry.reliability.toFixed(2)),
        recommendedRsuPlacement: report.telemetry.recommendedRsuPlacement
      }, null, 2);
    });

    state.dom.openAnalyticsBtn.addEventListener('click', () => {
      runtime.tools.load('analytics-bay');
    });

    state.dom.runEvolutionBtn.addEventListener('click', () => {
      const generations = Number(state.dom.generationSelector.value) || 200;
      const evolution = runtime.simulation.runEvolution({ generations });
      if (!evolution) return;

      global.HighwayProtocolLabUi.renderLeaderboard(
        state.dom.protocolLeaderboard,
        evolution.best,
        evolution.baseline
      );
      global.HighwayProtocolLabUi.drawEvolutionChart(state.dom.evolutionCanvas, evolution.history);

      const exportBundle = global.HighwayExperimentRunner.runProtocolExperiment(state.lab, { generations });
      state.dom.experimentOutput.textContent = JSON.stringify({
        success: evolution.success,
        improvements: evolution.improvements,
        bestGenome: evolution.best.genome,
        csvPreview: exportBundle.csv.split('\n').slice(0, 6).join('\n')
      }, null, 2);
    });

    state.dom.compareLayoutBtn.addEventListener('click', () => {
      if (!state.lab) runtime.simulation.initializeLab();
      const layouts = [1, 2, 3, 4].map(() => global.HighwayInfrastructureGenome.createRandomInfrastructureGenome());
      const comparison = global.HighwayExperimentRunner.runInfrastructureComparison(state.lab, layouts);
      state.dom.experimentOutput.textContent = JSON.stringify(comparison.json, null, 2);
    });

    state.dom.replaySimBtn.addEventListener('click', () => {
      if (!state.latestEvolution) return;
      const report = state.lab.simulateGenome(state.latestEvolution.best.genome, 24);
      state.dom.optimizationResult.textContent = JSON.stringify({
        replay: 'Best evolved protocol replay',
        metrics: report
      }, null, 2);
      renderTelemetry({
        params: { latency: report.latency, nodePositions: state.params.nodePositions },
        telemetry: { signalScore: report.coverageReliability, latencyScore: 100 - report.latency, packetScore: 100 - report.congestion, mobilityScore: 80, reliability: report.coverageReliability }
      });
    });
  }

  global.toggleEmergency = function toggleEmergency() {
    state.isEmergency = !state.isEmergency;
    const status = state.dom.globalStatus;
    const dots = document.querySelectorAll('.led-dot');

    if (state.isEmergency) {
      state.dom.car.classList.add('emergency-active');
      status.innerText = '● EMERGENCY DETECTED';
      status.className = 'text-red-500 font-mono font-bold status-pulse';
      dots.forEach((dot, i) => {
        global.setTimeout(() => { dot.style.backgroundColor = '#ef4444'; }, i * 450);
      });
      return;
    }

    state.dom.car.classList.remove('emergency-active');
    status.innerText = '● CONNECTED / NOMINAL';
    status.className = 'text-emerald-400 font-mono font-bold';
    dots.forEach((dot) => { dot.style.backgroundColor = '#3f3f46'; });
  };

  global.changeSpeed = function changeSpeed(val) {
    state.speedStep = Number(val) / 40;
    state.dom.uiSpeed.innerText = String(val);
    state.dom.uiLatency.innerText = String(Math.round((Math.random() * 5) + (val / 10)));
  };

  function init() {
    state.dom = {
      car: document.getElementById('car'),
      highway: document.getElementById('highway'),
      globalStatus: document.getElementById('global-status'),
      uiSpeed: document.getElementById('ui-speed'),
      uiLatency: document.getElementById('ui-latency'),
      uiRssi: document.getElementById('ui-rssi'),
      barRssi: document.getElementById('bar-rssi'),
      toolFrame: document.getElementById('tool-frame'),
      runScenarioBtn: document.getElementById('run-scenario-btn'),
      optimizeCorridorBtn: document.getElementById('optimize-corridor-btn'),
      evaluateNetworkBtn: document.getElementById('evaluate-network-btn'),
      openAnalyticsBtn: document.getElementById('open-analytics-btn'),
      optimizationResult: document.getElementById('optimization-result'),
      runEvolutionBtn: document.getElementById('run-evolution-btn'),
      compareLayoutBtn: document.getElementById('compare-layout-btn'),
      replaySimBtn: document.getElementById('replay-sim-btn'),
      protocolLeaderboard: document.getElementById('protocol-leaderboard'),
      evolutionCanvas: document.getElementById('evolution-canvas'),
      generationSelector: document.getElementById('generation-selector'),
      experimentOutput: document.getElementById('experiment-output')
    };

    drawNodes(state.params.nodePositions);
    runtime.simulation.initializeLab();
    bindUi();
    runtime.tools.load('scenario-planner');
    animate();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
