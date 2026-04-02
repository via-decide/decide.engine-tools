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

  global.HighwayExperimentRunner = {
    runProtocolExperiment,
    runInfrastructureComparison,
    runArchitectureSearchBatch,
    toCsv
  };
})(window);
