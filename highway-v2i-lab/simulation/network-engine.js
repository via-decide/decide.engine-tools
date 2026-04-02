(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  const NETWORK_PRESETS = {
    dsrc: { latencyBase: 14, reliabilityBoost: 0, congestionFactor: 1, energyFactor: 1.1 },
    'c-v2x': { latencyBase: 10, reliabilityBoost: 4, congestionFactor: 0.9, energyFactor: 1 },
    '5g-v2x': { latencyBase: 7, reliabilityBoost: 8, congestionFactor: 0.8, energyFactor: 1.2 },
    'vehicle-mesh-relay': { latencyBase: 9, reliabilityBoost: 6, congestionFactor: 0.85, energyFactor: 0.9 },
    'cluster-broadcast': { latencyBase: 11, reliabilityBoost: 5, congestionFactor: 0.75, energyFactor: 1.05 },
    'opportunistic-communication': { latencyBase: 13, reliabilityBoost: 3, congestionFactor: 0.7, energyFactor: 0.8 },
    'edge-assisted-routing': { latencyBase: 8, reliabilityBoost: 9, congestionFactor: 0.7, energyFactor: 1.15 }
  };

  function createNetworkEngine(config) {
    const cfg = Object.assign({
      rsuSpacing: 250,
      relayProbability: 0.45,
      messageTTL: 6,
      adaptiveDelay: 0.2,
      corridorLength: 1000,
      networkMode: 'dsrc',
      bandwidthMbps: 160,
      nodeLatencyMs: 3,
      energyPerMessage: 0.08
    }, config || {});

    function setNetworkMode(mode) {
      const key = String(mode || '').toLowerCase();
      cfg.networkMode = NETWORK_PRESETS[key] ? key : 'dsrc';
      return cfg.networkMode;
    }

    function evaluateCoverage() {
      const rsuCount = Math.max(2, Math.floor(cfg.corridorLength / cfg.rsuSpacing));
      const overlapFactor = utils.clamp(1 - (cfg.rsuSpacing / 500), 0, 1);
      const preset = NETWORK_PRESETS[cfg.networkMode] || NETWORK_PRESETS.dsrc;
      return {
        rsuCount,
        coverageReliability: utils.clamp(62 + (overlapFactor * 30) + preset.reliabilityBoost, 0, 100)
      };
    }

    function simulateTick(simState, genome, events) {
      const preset = NETWORK_PRESETS[cfg.networkMode] || NETWORK_PRESETS.dsrc;
      const anomalies = simState.anomalyCount || 0;
      const effectiveRelay = utils.clamp((genome.relayProbability + cfg.relayProbability) / 2, 0.05, 0.95);
      const ttl = Math.max(1, Number(genome.messageTTL) || cfg.messageTTL);
      const adaptiveDelay = Math.max(0, Number(genome.adaptiveDelay) || cfg.adaptiveDelay);
      const clusterRadius = Number(genome.clusterRadius) || 120;

      const baseLatency = preset.latencyBase + (anomalies * 1.8) + (genome.broadcastInterval * 0.6);
      const trafficDensityPenalty = utils.clamp((simState.vehicles.length / 40) * 8, 0, 30);
      const congestion = utils.clamp(((1000 / cfg.rsuSpacing) * (1 - effectiveRelay) * 20 * preset.congestionFactor) + (anomalies * 4) + trafficDensityPenalty, 0, 100);
      const latency = utils.clamp(baseLatency + (congestion * 0.25) + (adaptiveDelay * 20) - (ttl * 0.5) - (clusterRadius / 180), 4, 300);

      const packetReliability = utils.clamp(100 - congestion + preset.reliabilityBoost + ((genome.collisionAvoidanceFactor || 0.5) * 10), 20, 100);
      const energyConsumption = utils.clamp((simState.vehicles.length * cfg.energyPerMessage * preset.energyFactor) + (congestion * 0.04), 1, 500);
      const trafficEfficiency = utils.clamp(100 - (latency * 0.55) - (anomalies * 6), 0, 100);
      const safetyResponseTime = utils.clamp(latency + (anomalies > 0 ? 8 : 2) - ((genome.priorityWeight || 0.5) * 4), 2, 300);

      if (anomalies > 0) {
        events.emit('network.relay', {
          anomalies,
          mode: cfg.networkMode,
          effectiveRelay,
          latency,
          congestion,
          packetReliability
        });
      }

      const coverage = evaluateCoverage();
      return {
        mode: cfg.networkMode,
        latency,
        congestion,
        packetReliability,
        energyConsumption,
        trafficEfficiency,
        safetyResponseTime,
        coverageReliability: coverage.coverageReliability,
        rsuCount: coverage.rsuCount,
        bandwidthMbps: cfg.bandwidthMbps,
        nodeLatencyMs: cfg.nodeLatencyMs
      };
    }

    function updateInfrastructure(genome) {
      cfg.rsuSpacing = Math.max(80, Number(genome.rsuSpacing) || cfg.rsuSpacing);
      cfg.bandwidthMbps = Math.max(40, Number(genome.bandwidthMbps) || cfg.bandwidthMbps);
      cfg.nodeLatencyMs = Math.max(1, Number(genome.nodeLatencyMs) || cfg.nodeLatencyMs);
      return evaluateCoverage();
    }

    return { simulateTick, updateInfrastructure, evaluateCoverage, setNetworkMode };
  }

  global.HighwayNetworkEngine = { createNetworkEngine, NETWORK_PRESETS };
})(window);
