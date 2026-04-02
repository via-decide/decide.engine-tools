(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  function createRandomInfrastructureGenome() {
    return {
      rsuSpacing: 120 + Math.random() * 300,
      sensorDensity: 0.2 + Math.random() * 0.65,
      edgeNodePlacement: Math.round(Math.random() * 4),
      coverageOverlap: 0.05 + Math.random() * 0.45,
      backupCommunicationLinks: Math.round(Math.random() * 5),
      bandwidthMbps: 80 + Math.random() * 260,
      nodeLatencyMs: 1 + Math.random() * 8
    };
  }

  function mutateInfrastructureGenome(genome) {
    return {
      rsuSpacing: utils.clamp(genome.rsuSpacing + (Math.random() - 0.5) * 40, 80, 500),
      sensorDensity: utils.clamp(genome.sensorDensity + (Math.random() - 0.5) * 0.12, 0.1, 0.95),
      edgeNodePlacement: Math.max(0, Math.min(6, genome.edgeNodePlacement + Math.round((Math.random() - 0.5) * 2))),
      coverageOverlap: utils.clamp(genome.coverageOverlap + (Math.random() - 0.5) * 0.06, 0.02, 0.7),
      backupCommunicationLinks: Math.max(0, Math.min(8, genome.backupCommunicationLinks + Math.round((Math.random() - 0.5) * 2))),
      bandwidthMbps: utils.clamp(genome.bandwidthMbps + (Math.random() - 0.5) * 50, 40, 500),
      nodeLatencyMs: utils.clamp(genome.nodeLatencyMs + (Math.random() - 0.5) * 2, 1, 15)
    };
  }

  function scoreInfrastructure(metrics) {
    const congestionPenalty = 100 - metrics.congestion;
    const safetyScore = 100 - (metrics.safetyResponseTime || metrics.latency);
    const energyScore = 100 - (metrics.energyConsumption || 80);
    return (metrics.coverageReliability * 0.3) + (congestionPenalty * 0.2) + ((100 - metrics.latency) * 0.2) + (safetyScore * 0.2) + (energyScore * 0.1);
  }

  global.HighwayInfrastructureGenome = {
    createRandomInfrastructureGenome,
    mutateInfrastructureGenome,
    scoreInfrastructure
  };
})(window);
