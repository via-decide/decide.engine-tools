(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  function createNetworkEngine(config) {
    const cfg = Object.assign({
      rsuSpacing: 250,
      relayProbability: 0.45,
      messageTTL: 6,
      adaptiveDelay: 0.2,
      corridorLength: 1000
    }, config || {});

    function evaluateCoverage() {
      const rsuCount = Math.max(2, Math.floor(cfg.corridorLength / cfg.rsuSpacing));
      const overlapFactor = utils.clamp(1 - (cfg.rsuSpacing / 500), 0, 1);
      return {
        rsuCount,
        coverageReliability: utils.clamp(62 + (overlapFactor * 38), 0, 100)
      };
    }

    function simulateTick(simState, genome, events) {
      const anomalies = simState.anomalyCount || 0;
      const effectiveRelay = utils.clamp((genome.relayProbability + cfg.relayProbability) / 2, 0.05, 0.95);
      const ttl = Math.max(1, Number(genome.messageTTL) || cfg.messageTTL);
      const adaptiveDelay = Math.max(0, Number(genome.adaptiveDelay) || cfg.adaptiveDelay);

      const baseLatency = 8 + (anomalies * 1.8) + (genome.broadcastInterval * 0.6);
      const congestion = utils.clamp((1000 / cfg.rsuSpacing) * (1 - effectiveRelay) * 20 + (anomalies * 4), 0, 100);
      const latency = utils.clamp(baseLatency + (congestion * 0.25) + (adaptiveDelay * 20) - (ttl * 0.5), 4, 300);

      if (anomalies > 0) {
        events.emit('network.relay', {
          anomalies,
          effectiveRelay,
          latency,
          congestion
        });
      }

      const coverage = evaluateCoverage();
      return {
        latency,
        congestion,
        coverageReliability: coverage.coverageReliability,
        rsuCount: coverage.rsuCount
      };
    }

    function updateInfrastructure(genome) {
      cfg.rsuSpacing = Math.max(80, Number(genome.rsuSpacing) || cfg.rsuSpacing);
      return evaluateCoverage();
    }

    return { simulateTick, updateInfrastructure, evaluateCoverage };
  }

  global.HighwayNetworkEngine = { createNetworkEngine };
})(window);
