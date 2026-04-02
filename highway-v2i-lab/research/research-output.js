(function (global) {
  'use strict';

  function createResearchStore() {
    const datasets = [];
    const protocolLogs = [];
    const reports = [];
    const leaderboards = {
      protocol: [],
      infrastructure: [],
      architecture: []
    };

    function addDataset(name, payload) {
      const item = { name, payload, ts: new Date().toISOString() };
      datasets.push(item);
      return item;
    }

    function addProtocolLog(payload) {
      const item = { payload, ts: new Date().toISOString() };
      protocolLogs.push(item);
      return item;
    }

    function addReport(title, summary, table) {
      const item = { title, summary, table, ts: new Date().toISOString() };
      reports.push(item);
      return item;
    }

    function addLeaderboardEntry(kind, payload) {
      if (!leaderboards[kind]) leaderboards[kind] = [];
      leaderboards[kind].push(Object.assign({ ts: new Date().toISOString() }, payload || {}));
      leaderboards[kind] = leaderboards[kind].slice(-200);
      return leaderboards[kind][leaderboards[kind].length - 1];
    }

    function buildOptimizationSuggestions() {
      const latestInfra = datasets.filter((d) => d.name === 'infrastructure-eval').slice(-1)[0];
      const latestInfraEvolution = datasets.filter((d) => d.name === 'infrastructure-evolution').slice(-1)[0];
      const latestScenario = datasets.filter((d) => d.name === 'scenario-experiment').slice(-1)[0];
      const suggestions = [];

      if (latestInfra && latestInfra.payload && latestInfra.payload.metrics) {
        const m = latestInfra.payload.metrics;
        if ((m.congestion || 0) > 55) suggestions.push('Increase RSU density around bottleneck segments to reduce congestion.');
        if ((m.infrastructureHealth && m.infrastructureHealth.healthScore || 100) < 75) suggestions.push('Prioritize preventive maintenance for deteriorating road/sensor assets.');
      }

      if (latestInfraEvolution && latestInfraEvolution.payload && latestInfraEvolution.payload.recommendations) {
        const rec = latestInfraEvolution.payload.recommendations;
        suggestions.push(`RSU target spacing near ${rec.optimizedRsuPlacement.spacingMeters}m with topology mode ${rec.optimizedRsuPlacement.topology}.`);
        suggestions.push(`Sensor plan: density ${rec.sensorLayoutRecommendations.density}, sensor angle ${rec.sensorLayoutRecommendations.sensorAngle}°, camera angle ${rec.sensorLayoutRecommendations.cameraAngle}°.`);
      }

      if (latestScenario && latestScenario.payload && latestScenario.payload.metrics) {
        const s = latestScenario.payload.metrics;
        if (s.drainage && s.drainage.floodRisk === 'high') suggestions.push('Add drains and increase minimum slope in flood-prone road sections.');
        if (s.emergencyMobility && (s.emergencyMobility.avgEmergencyResponseTime || s.emergencyMobility.emergencyResponseTime) > 4) suggestions.push('Configure dynamic lane-clearing and adaptive signal priority for emergency corridors.');
      }

      if (!suggestions.length) suggestions.push('Corridor metrics are nominal; continue scenario stress testing to uncover edge-case risks.');
      return suggestions;
    }

    function snapshot() {
      const recommendations = buildOptimizationSuggestions();
      return {
        datasets: datasets.slice(-50),
        protocolLogs: protocolLogs.slice(-200),
        reports: reports.slice(-50),
        recommendations,
        leaderboards: {
          protocol: leaderboards.protocol.slice(-20),
          infrastructure: leaderboards.infrastructure.slice(-20),
          architecture: leaderboards.architecture.slice(-20)
        }
      };
    }

    return {
      addDataset,
      addProtocolLog,
      addReport,
      addLeaderboardEntry,
      snapshot
    };
  }

  global.HighwayResearchOutput = { createResearchStore };
})(window);
