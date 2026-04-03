(function (global) {
  'use strict';

  function toCsv(rows) {
    if (!rows || !rows.length) return '';
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(',')];
    rows.forEach((row) => {
      lines.push(headers.map((h) => JSON.stringify(row[h] == null ? '' : row[h])).join(','));
    });
    return lines.join('\n');
  }

  function runProtocolExperiment(lab, options) {
    const result = lab.runEvolution(options || {});
    const rows = result.history.map((entry) => ({
      generation: entry.generation,
      bestFitness: Number(entry.bestFitness.toFixed(3)),
      meanFitness: Number(entry.meanFitness.toFixed(3)),
      bestLatency: Number(entry.bestLatency.toFixed(3)),
      bestCongestion: Number(entry.bestCongestion.toFixed(3)),
      bestReliability: Number(entry.bestReliability.toFixed(3)),
      bestEnergy: Number((entry.bestEnergy || 0).toFixed(3)),
      bestSafetyResponseTime: Number((entry.bestSafetyResponseTime || 0).toFixed(3))
    }));

    return {
      json: {
        type: 'protocol-experiment',
        generatedAt: new Date().toISOString(),
        config: result.config,
        best: result.best,
        rows
      },
      csv: toCsv(rows)
    };
  }

  function runInfrastructureComparison(lab, layouts, options) {
    const rows = (layouts || []).map((layout, index) => {
      const evalResult = lab.evaluateInfrastructure(layout, options);
      return {
        layoutId: `layout-${index + 1}`,
        rsuSpacing: layout.rsuSpacing,
        sensorDensity: layout.sensorDensity,
        backupCommunicationLinks: layout.backupCommunicationLinks,
        latency: Number(evalResult.latency.toFixed(3)),
        congestion: Number(evalResult.congestion.toFixed(3)),
        coverageReliability: Number(evalResult.coverageReliability.toFixed(3)),
        infraScore: Number(evalResult.infrastructureScore.toFixed(3))
      };
    });

    return {
      json: { type: 'infrastructure-comparison', rows, generatedAt: new Date().toISOString() },
      csv: toCsv(rows)
    };
  }

  function runArchitectureSearchBatch(lab, options) {
    const cfg = Object.assign({ runs: 1000 }, options || {});
    const rows = [];

    for (let i = 0; i < cfg.runs; i += 1) {
      const discovery = lab.discoverArchitecture({ candidates: 24 });
      rows.push({
        runId: i + 1,
        networkMode: discovery.best.networkMode,
        behaviorMode: discovery.best.behaviorMode,
        latency: Number(discovery.best.metrics.latency.toFixed(3)),
        packetReliability: Number(discovery.best.metrics.packetReliability.toFixed(3)),
        energyConsumption: Number(discovery.best.metrics.energyConsumption.toFixed(3)),
        architectureScore: Number(discovery.best.architectureScore.toFixed(3))
      });
    }

    return {
      json: { type: 'architecture-batch', generatedAt: new Date().toISOString(), rows },
      csv: toCsv(rows)
    };
  }

  function runScenarioSuite(lab, options) {
    const suite = Object.assign({
      id: `scenario-suite-${Date.now()}`,
      scenarios: [
        { name: 'heavy-rain', rainIntensity: 35, roadSlope: 1.8, drainPlacement: 3, waterFlowDirection: 'west' },
        { name: 'traffic-accident', emergencyEvent: 'crash', rainIntensity: 10, behaviorMode: 'cooperative-braking-signals' },
        { name: 'festival-crowd', rainIntensity: 8, behaviorMode: 'dynamic-relay-nodes' },
        { name: 'sensor-failure', rainIntensity: 15, behaviorMode: 'baseline' },
        { name: 'power-outage', emergencyEvent: 'road_blockage', networkMode: 'opportunistic-communication', rainIntensity: 16 }
      ]
    }, options || {});

    const rows = suite.scenarios.map((scenario, idx) => {
      const run = lab.runScenarioExperiment(scenario);
      return {
        scenarioId: idx + 1,
        scenario: scenario.name,
        trafficDelay: Number((run.metrics.congestion * 0.7).toFixed(3)),
        accidentResponseTime: Number((run.metrics.emergencyMobility.avgEmergencyResponseTime || run.metrics.emergencyMobility.emergencyResponseTime || 0).toFixed(3)),
        networkLatency: Number(run.metrics.latency.toFixed(3)),
        energyConsumption: Number(run.metrics.energyConsumption.toFixed(3)),
        sensorCoverage: Number(run.metrics.coverageReliability.toFixed(3)),
        floodRisk: run.metrics.drainage.floodRisk
      };
    });

    const json = {
      type: 'scenario-experiment-suite',
      generatedAt: new Date().toISOString(),
      suiteId: suite.id,
      storagePath: '/highway-v2i-lab/research/',
      rows,
      summary: {
        avgTrafficDelay: Number((rows.reduce((sum, r) => sum + r.trafficDelay, 0) / Math.max(1, rows.length)).toFixed(3)),
        avgAccidentResponseTime: Number((rows.reduce((sum, r) => sum + r.accidentResponseTime, 0) / Math.max(1, rows.length)).toFixed(3)),
        avgNetworkLatency: Number((rows.reduce((sum, r) => sum + r.networkLatency, 0) / Math.max(1, rows.length)).toFixed(3)),
        avgEnergyConsumption: Number((rows.reduce((sum, r) => sum + r.energyConsumption, 0) / Math.max(1, rows.length)).toFixed(3)),
        avgSensorCoverage: Number((rows.reduce((sum, r) => sum + r.sensorCoverage, 0) / Math.max(1, rows.length)).toFixed(3))
      }
    };

    return {
      json,
      csv: toCsv(rows)
    };
  }

  function runInfrastructureEvolution(lab, options) {
    const result = lab.evolveInfrastructureDesigns(options || {});
    const rows = result.history.map((entry) => ({
      generation: entry.generation,
      bestFitness: Number(entry.bestFitness.toFixed(3)),
      meanFitness: Number(entry.meanFitness.toFixed(3)),
      trafficDelay: Number((entry.metrics.trafficDelay || 0).toFixed(3)),
      emergencyResponseTime: Number((entry.metrics.emergencyResponseTime || 0).toFixed(3)),
      sensorCoverage: Number((entry.metrics.sensorCoverage || 0).toFixed(3)),
      communicationLatency: Number((entry.metrics.communicationLatency || 0).toFixed(3)),
      floodRisk: Number((entry.metrics.floodRisk || 0).toFixed(3)),
      maintenanceCost: Number((entry.metrics.maintenanceCost || 0).toFixed(3))
    }));

    return {
      json: {
        type: 'infrastructure-evolution-lab',
        generatedAt: new Date().toISOString(),
        storagePath: '/highway-v2i-lab/research/',
        config: result.config,
        baseline: result.baseline,
        best: result.best,
        improvements: result.improvements,
        recommendations: result.recommendations,
        success: result.success,
        evolutionTree: result.tree,
        rows
      },
      csv: toCsv(rows)
    };
  }

  global.HighwayExperimentRunner = {
    runProtocolExperiment,
    runInfrastructureComparison,
    runArchitectureSearchBatch,
    runScenarioSuite,
    runInfrastructureEvolution,
    toCsv
  };
})(window);
