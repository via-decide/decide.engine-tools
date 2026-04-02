(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  function createRandomGenome() {
    return {
      broadcastInterval: 1 + Math.random() * 6,
      relayProbability: 0.15 + Math.random() * 0.8,
      priorityRouting: Math.random() > 0.5,
      messageTTL: 2 + Math.floor(Math.random() * 10),
      adaptiveDelay: Math.random() * 0.9,
      dynamicRsuActivation: Math.random() > 0.5,
      clusterRelayBias: 2 + Math.floor(Math.random() * 6)
    };
  }

  function mutateGenome(genome, rate) {
    const mutationRate = Number(rate) || 0.12;
    const next = Object.assign({}, genome);

    if (Math.random() < mutationRate) next.broadcastInterval = utils.clamp(next.broadcastInterval + (Math.random() - 0.5), 0.5, 8);
    if (Math.random() < mutationRate) next.relayProbability = utils.clamp(next.relayProbability + (Math.random() - 0.5) * 0.2, 0.05, 0.98);
    if (Math.random() < mutationRate) next.priorityRouting = !next.priorityRouting;
    if (Math.random() < mutationRate) next.messageTTL = Math.max(1, Math.min(18, next.messageTTL + Math.round((Math.random() - 0.5) * 4)));
    if (Math.random() < mutationRate) next.adaptiveDelay = utils.clamp(next.adaptiveDelay + (Math.random() - 0.5) * 0.2, 0, 1);
    if (Math.random() < mutationRate) next.dynamicRsuActivation = !next.dynamicRsuActivation;
    if (Math.random() < mutationRate) next.clusterRelayBias = Math.max(2, Math.min(12, next.clusterRelayBias + Math.round((Math.random() - 0.5) * 3)));

    return next;
  }

  function crossoverGenome(a, b) {
    const left = a || createRandomGenome();
    const right = b || createRandomGenome();
    return {
      broadcastInterval: Math.random() > 0.5 ? left.broadcastInterval : right.broadcastInterval,
      relayProbability: Math.random() > 0.5 ? left.relayProbability : right.relayProbability,
      priorityRouting: Math.random() > 0.5 ? left.priorityRouting : right.priorityRouting,
      messageTTL: Math.random() > 0.5 ? left.messageTTL : right.messageTTL,
      adaptiveDelay: Math.random() > 0.5 ? left.adaptiveDelay : right.adaptiveDelay,
      dynamicRsuActivation: Math.random() > 0.5 ? left.dynamicRsuActivation : right.dynamicRsuActivation,
      clusterRelayBias: Math.random() > 0.5 ? left.clusterRelayBias : right.clusterRelayBias
    };
  }

  global.HighwayProtocolGenome = {
    createRandomGenome,
    mutateGenome,
    crossoverGenome
  };
})(window);
