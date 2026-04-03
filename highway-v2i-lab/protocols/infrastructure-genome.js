(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  function createRandomInfrastructureGenome() {
    return {
      rsuSpacing: 120 + Math.random() * 300,
      sensorDensity: 0.2 + Math.random() * 0.65,
      sensorPlacement: Math.random(),
      sensorAngle: 15 + Math.random() * 65,
      cameraAngle: 20 + Math.random() * 55,
      edgeNodePlacement: Math.round(Math.random() * 4),
      coverageOverlap: 0.05 + Math.random() * 0.45,
      backupCommunicationLinks: Math.round(Math.random() * 5),
      communicationTopology: Math.round(Math.random() * 3),
      communicationRange: 120 + Math.random() * 300,
      drainSlope: 1.2 + Math.random() * 5.8,
      laneWidth: 2.9 + Math.random() * 1.3,
      emergencyLanePriority: Math.random(),
      bandwidthMbps: 80 + Math.random() * 260,
      nodeLatencyMs: 1 + Math.random() * 8
    };
  }

  function createBaselineInfrastructureGenome() {
    return {
      rsuSpacing: 220,
      sensorDensity: 0.45,
      sensorPlacement: 0.5,
      sensorAngle: 34,
      cameraAngle: 38,
      edgeNodePlacement: 2,
      coverageOverlap: 0.22,
      backupCommunicationLinks: 3,
      communicationTopology: 1,
      communicationRange: 260,
      drainSlope: 2.4,
      laneWidth: 3.5,
      emergencyLanePriority: 0.55,
      bandwidthMbps: 160,
      nodeLatencyMs: 3
    };
  }

  function mutateInfrastructureGenome(genome) {
    return {
      rsuSpacing: utils.clamp(genome.rsuSpacing + (Math.random() - 0.5) * 40, 80, 500),
      sensorDensity: utils.clamp(genome.sensorDensity + (Math.random() - 0.5) * 0.12, 0.1, 0.95),
      sensorPlacement: utils.clamp((genome.sensorPlacement == null ? 0.5 : genome.sensorPlacement) + (Math.random() - 0.5) * 0.18, 0, 1),
      sensorAngle: utils.clamp((genome.sensorAngle == null ? 34 : genome.sensorAngle) + (Math.random() - 0.5) * 14, 5, 85),
      cameraAngle: utils.clamp((genome.cameraAngle == null ? 38 : genome.cameraAngle) + (Math.random() - 0.5) * 10, 10, 85),
      edgeNodePlacement: Math.max(0, Math.min(6, genome.edgeNodePlacement + Math.round((Math.random() - 0.5) * 2))),
      coverageOverlap: utils.clamp(genome.coverageOverlap + (Math.random() - 0.5) * 0.06, 0.02, 0.7),
      backupCommunicationLinks: Math.max(0, Math.min(8, genome.backupCommunicationLinks + Math.round((Math.random() - 0.5) * 2))),
      communicationTopology: Math.max(0, Math.min(4, (genome.communicationTopology == null ? 1 : genome.communicationTopology) + Math.round((Math.random() - 0.5) * 2))),
      communicationRange: utils.clamp((genome.communicationRange == null ? 260 : genome.communicationRange) + (Math.random() - 0.5) * 45, 80, 480),
      drainSlope: utils.clamp((genome.drainSlope == null ? 2.4 : genome.drainSlope) + (Math.random() - 0.5) * 0.9, 1, 8),
      laneWidth: utils.clamp((genome.laneWidth == null ? 3.5 : genome.laneWidth) + (Math.random() - 0.5) * 0.32, 2.7, 4.8),
      emergencyLanePriority: utils.clamp((genome.emergencyLanePriority == null ? 0.55 : genome.emergencyLanePriority) + (Math.random() - 0.5) * 0.24, 0, 1),
      bandwidthMbps: utils.clamp(genome.bandwidthMbps + (Math.random() - 0.5) * 50, 40, 500),
      nodeLatencyMs: utils.clamp(genome.nodeLatencyMs + (Math.random() - 0.5) * 2, 1, 15)
    };
  }

  function crossoverInfrastructureGenome(a, b) {
    const left = a || createRandomInfrastructureGenome();
    const right = b || createRandomInfrastructureGenome();
    return {
      rsuSpacing: Math.random() > 0.5 ? left.rsuSpacing : right.rsuSpacing,
      sensorDensity: Math.random() > 0.5 ? left.sensorDensity : right.sensorDensity,
      sensorPlacement: Math.random() > 0.5 ? left.sensorPlacement : right.sensorPlacement,
      sensorAngle: Math.random() > 0.5 ? left.sensorAngle : right.sensorAngle,
      cameraAngle: Math.random() > 0.5 ? left.cameraAngle : right.cameraAngle,
      edgeNodePlacement: Math.random() > 0.5 ? left.edgeNodePlacement : right.edgeNodePlacement,
      coverageOverlap: Math.random() > 0.5 ? left.coverageOverlap : right.coverageOverlap,
      backupCommunicationLinks: Math.random() > 0.5 ? left.backupCommunicationLinks : right.backupCommunicationLinks,
      communicationTopology: Math.random() > 0.5 ? left.communicationTopology : right.communicationTopology,
      communicationRange: Math.random() > 0.5 ? left.communicationRange : right.communicationRange,
      drainSlope: Math.random() > 0.5 ? left.drainSlope : right.drainSlope,
      laneWidth: Math.random() > 0.5 ? left.laneWidth : right.laneWidth,
      emergencyLanePriority: Math.random() > 0.5 ? left.emergencyLanePriority : right.emergencyLanePriority,
      bandwidthMbps: Math.random() > 0.5 ? left.bandwidthMbps : right.bandwidthMbps,
      nodeLatencyMs: Math.random() > 0.5 ? left.nodeLatencyMs : right.nodeLatencyMs
    };
  }

  function scoreInfrastructure(metrics) {
    const congestionPenalty = 100 - metrics.congestion;
    const safetyScore = 100 - (metrics.safetyResponseTime || metrics.latency);
    const energyScore = 100 - (metrics.energyConsumption || 80);
    const emergencyScore = 100 - ((metrics.emergencyMobility && metrics.emergencyMobility.avgEmergencyResponseTime) || metrics.safetyResponseTime || metrics.latency || 0) * 9;
    const floodPenalty = ((metrics.drainage && metrics.drainage.floodHighTickRatio) || 0) * 100;
    return (metrics.coverageReliability * 0.24) + (congestionPenalty * 0.18) + ((100 - metrics.latency) * 0.2) + (safetyScore * 0.14) + (energyScore * 0.08) + (emergencyScore * 0.1) + ((100 - floodPenalty) * 0.06);
  }

  global.HighwayInfrastructureGenome = {
    createRandomInfrastructureGenome,
    createBaselineInfrastructureGenome,
    mutateInfrastructureGenome,
    crossoverInfrastructureGenome,
    scoreInfrastructure
  };
})(window);
