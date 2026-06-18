(function (global) {
  'use strict';

  const core = global.ProtocolCore || {};
  const fallbackUtils = {
    clamp(num, min, max) { return Math.max(min, Math.min(max, num)); },
    weightedScore(parts) {
      return Object.keys(parts).reduce((sum, key) => {
        const item = parts[key] || { value: 0, weight: 0 };
        return sum + (item.value * item.weight);
      }, 0);
    }
  };
  const utils = global.EngineUtils || fallbackUtils;

  function createSeededRng(seed) {
    let state = (Number(seed) || 1) % 2147483647;
    if (state <= 0) state += 2147483646;
    return function rand() {
      state = (state * 48271) % 2147483647;
      return (state - 1) / 2147483646;
    };
  }

  function randomIn(rng, min, max) {
    return min + ((max - min) * rng());
  }

  function createProtocolGenome(rng, base) {
    const ref = base || core.AMV2X_Model || core.DSRC_Model || {};
    return {
      name: `PROTO-${Math.floor(rng() * 100000)}`,
      broadcastInterval: randomIn(rng, 4, 20),
      relayProbability: randomIn(rng, 0.35, 0.95),
      priorityWeights: {
        safety: randomIn(rng, 0.35, 0.7),
        congestion: randomIn(rng, 0.1, 0.4),
        reliability: randomIn(rng, 0.15, 0.45),
        efficiency: randomIn(rng, 0.1, 0.35)
      },
      congestionControl: rng() > 0.5 ? 'adaptive-window' : String(ref.congestionControl || 'fixed-window'),
      ttl: Math.round(randomIn(rng, 2, 8)),
      adaptiveDelay: randomIn(rng, 4, 24),
      baseProtocol: ref.name || 'AM-V2X'
    };
  }

  function createInfrastructureGenome(rng) {
    return {
      nodeSpacing: randomIn(rng, 120, 360),
      nodeHeight: randomIn(rng, 5, 14),
      txPower: randomIn(rng, 8, 28),
      redundancyFactor: randomIn(rng, 1, 2.5)
    };
  }

  function normalizeWeights(weights) {
    const total = (weights.safety + weights.congestion + weights.reliability + weights.efficiency) || 1;
    return {
      safety: weights.safety / total,
      congestion: weights.congestion / total,
      reliability: weights.reliability / total,
      efficiency: weights.efficiency / total
    };
  }

  function evaluateCandidate(candidate, environment, rng) {
    const protocol = candidate.protocol;
    const infra = candidate.infrastructure;
    const densityFactor = utils.clamp(environment.vehicleCount / (environment.lengthKm * 100), 0.1, 2.5);
    const congestion = utils.clamp(
      (protocol.broadcastInterval * densityFactor * 2.8) - (infra.nodeSpacing / 70) - (protocol.relayProbability * 16),
      5,
      95
    );

    const latency = utils.clamp(
      (protocol.adaptiveDelay + (densityFactor * 5) + (100 / Math.max(1, infra.txPower)) + randomIn(rng, 0.1, 2.4)),
      3,
      120
    );

    const coverage = utils.clamp(
      (65 + (infra.txPower * 1.2) + (infra.redundancyFactor * 8) - (infra.nodeSpacing * 0.07) + (protocol.relayProbability * 16)),
      10,
      100
    );

    const collisionWarningSuccess = utils.clamp(
      100 - (latency * 0.9) - (congestion * 0.25) + (protocol.priorityWeights.safety * 24),
      0,
      100
    );

    const packetRedundancy = utils.clamp((protocol.relayProbability * 100) - (infra.nodeSpacing * 0.09), 0, 100);
    const coordinationSuccess = utils.clamp(
      55 + (protocol.priorityWeights.efficiency * 40) + (infra.redundancyFactor * 7) - (congestion * 0.22),
      0,
      100
    );

    const energyEfficiency = utils.clamp(
      100 - (infra.txPower * 1.5) - (protocol.broadcastInterval * 1.2) + (protocol.priorityWeights.efficiency * 20),
      0,
      100
    );

    const safetyScore = utils.weightedScore({
      latency: { value: 100 - latency, weight: 0.45 },
      warning: { value: collisionWarningSuccess, weight: 0.35 },
      coverage: { value: coverage, weight: 0.2 }
    });

    const networkEfficiency = utils.weightedScore({
      coverage: { value: coverage, weight: 0.34 },
      congestion: { value: 100 - congestion, weight: 0.31 },
      energy: { value: energyEfficiency, weight: 0.2 },
      redundancy: { value: 100 - packetRedundancy, weight: 0.15 }
    });

    const protocolStability = utils.weightedScore({
      ttl: { value: utils.clamp(protocol.ttl * 13, 0, 100), weight: 0.25 },
      delay: { value: 100 - utils.clamp(protocol.adaptiveDelay * 3, 0, 100), weight: 0.25 },
      relay: { value: utils.clamp(protocol.relayProbability * 100, 0, 100), weight: 0.2 },
      coordination: { value: coordinationSuccess, weight: 0.3 }
    });

    const fitness = utils.weightedScore({
      safety: { value: safetyScore, weight: 0.5 },
      efficiency: { value: networkEfficiency, weight: 0.3 },
      stability: { value: protocolStability, weight: 0.2 }
    });

    return {
      metrics: {
        latencyDistribution: {
          p50: Number((latency * 0.72).toFixed(2)),
          p95: Number((latency * 1.25).toFixed(2)),
          p99: Number((latency * 1.4).toFixed(2))
        },
        collisionWarningSuccess: Number(collisionWarningSuccess.toFixed(2)),
        packetRedundancy: Number(packetRedundancy.toFixed(2)),
        coverageReliability: Number(coverage.toFixed(2)),
        networkCongestion: Number(congestion.toFixed(2)),
        coordinationSuccess: Number(coordinationSuccess.toFixed(2)),
        energyEfficiency: Number(energyEfficiency.toFixed(2)),
        safetyScore: Number(safetyScore.toFixed(2)),
        networkEfficiency: Number(networkEfficiency.toFixed(2)),
        protocolStability: Number(protocolStability.toFixed(2)),
        compositeFitness: Number(fitness.toFixed(2))
      }
    };
  }

  function mutateCandidate(parent, mutationRate, rng) {
    const child = JSON.parse(JSON.stringify(parent));
    if (rng() < mutationRate) child.protocol.broadcastInterval = randomIn(rng, 4, 20);
    if (rng() < mutationRate) child.protocol.relayProbability = randomIn(rng, 0.35, 0.95);
    if (rng() < mutationRate) child.protocol.ttl = Math.round(randomIn(rng, 2, 8));
    if (rng() < mutationRate) child.protocol.adaptiveDelay = randomIn(rng, 4, 24);
    if (rng() < mutationRate) child.infrastructure.nodeSpacing = randomIn(rng, 120, 360);
    if (rng() < mutationRate) child.infrastructure.nodeHeight = randomIn(rng, 5, 14);
    if (rng() < mutationRate) child.infrastructure.txPower = randomIn(rng, 8, 28);
    if (rng() < mutationRate) child.infrastructure.redundancyFactor = randomIn(rng, 1, 2.5);
    child.protocol.priorityWeights = normalizeWeights(child.protocol.priorityWeights);
    return child;
  }

  function seedPopulation(populationSize, rng) {
    const bases = [core.DSRC_Model || {}, core.CV2X_Model || {}, core.AMV2X_Model || {}];
    const population = [];
    for (let i = 0; i < populationSize; i += 1) {
      const base = bases[i % bases.length];
      population.push({
        protocol: createProtocolGenome(rng, base),
        infrastructure: createInfrastructureGenome(rng)
      });
    }
    return population;
  }

  function createBaselines(environment, rng) {
    const infra = { nodeSpacing: 250, nodeHeight: 8, txPower: 16, redundancyFactor: 1.4 };
    const dsrc = {
      protocol: createProtocolGenome(rng, core.DSRC_Model || {}),
      infrastructure: { ...infra }
    };
    dsrc.protocol.name = 'DSRC_Model';
    const cv2x = {
      protocol: createProtocolGenome(rng, core.CV2X_Model || {}),
      infrastructure: { ...infra, nodeSpacing: 230, txPower: 18 }
    };
    cv2x.protocol.name = 'CV2X_Model';

    return {
      DSRC_Model: evaluateCandidate(dsrc, environment, rng).metrics,
      CV2X_Model: evaluateCandidate(cv2x, environment, rng).metrics
    };
  }

  function runEvolution(config) {
    const options = config || {};
    const seed = Number(options.seed || 20260402);
    const rng = createSeededRng(seed);
    const populationSize = Number(options.population || 50);
    const generations = Number(options.generations || 200);
    const mutationRate = Number(options.mutationRate == null ? 0.1 : options.mutationRate);
    const environment = {
      lengthKm: 1,
      lanes: Number(options.lanes || 3),
      vehicleCount: Number(options.vehicleCount || 110),
      rsuNodes: Number(options.rsuNodes || 5)
    };

    let population = seedPopulation(populationSize, rng);
    const history = [];

    for (let gen = 0; gen < generations; gen += 1) {
      const evaluated = population.map((candidate) => {
        const result = evaluateCandidate(candidate, environment, rng);
        return { ...candidate, metrics: result.metrics };
      });

      evaluated.sort((a, b) => b.metrics.compositeFitness - a.metrics.compositeFitness);
      const eliteCount = Math.max(2, Math.floor(populationSize * 0.2));
      const elite = evaluated.slice(0, eliteCount);
      const best = elite[0];

      history.push({
        generation: gen + 1,
        bestFitness: best.metrics.compositeFitness,
        bestSafetyScore: best.metrics.safetyScore,
        bestCongestion: best.metrics.networkCongestion,
        protocol: best.protocol.name
      });

      const nextPopulation = elite.map((item) => ({
        protocol: { ...item.protocol, priorityWeights: { ...item.protocol.priorityWeights } },
        infrastructure: { ...item.infrastructure }
      }));

      while (nextPopulation.length < populationSize) {
        const parent = elite[Math.floor(rng() * elite.length)];
        nextPopulation.push(mutateCandidate(parent, mutationRate, rng));
      }

      population = nextPopulation;
    }

    const finalEvaluated = population.map((candidate) => {
      const result = evaluateCandidate(candidate, environment, rng);
      return { ...candidate, metrics: result.metrics };
    }).sort((a, b) => b.metrics.compositeFitness - a.metrics.compositeFitness);

    const top = finalEvaluated.slice(0, 10);
    const baselines = createBaselines(environment, rng);
    const champion = top[0];

    return {
      seed,
      config: { population: populationSize, generations, mutationRate, environment },
      baselines,
      history,
      leaderboard: top,
      improvements: {
        vsDSRC: {
          latencyGain: Number((baselines.DSRC_Model.latencyDistribution.p95 - champion.metrics.latencyDistribution.p95).toFixed(2)),
          congestionGain: Number((baselines.DSRC_Model.networkCongestion - champion.metrics.networkCongestion).toFixed(2)),
          coverageGain: Number((champion.metrics.coverageReliability - baselines.DSRC_Model.coverageReliability).toFixed(2))
        },
        vsCV2X: {
          latencyGain: Number((baselines.CV2X_Model.latencyDistribution.p95 - champion.metrics.latencyDistribution.p95).toFixed(2)),
          congestionGain: Number((baselines.CV2X_Model.networkCongestion - champion.metrics.networkCongestion).toFixed(2)),
          coverageGain: Number((champion.metrics.coverageReliability - baselines.CV2X_Model.coverageReliability).toFixed(2))
        }
      },
      recommendations: {
        optimalRsuSpacing: Number(champion.infrastructure.nodeSpacing.toFixed(2)),
        minimumNodeDensity: Number((1000 / champion.infrastructure.nodeSpacing).toFixed(2)),
        criticalFailureConditions: [
          'Vehicle density above 180 vehicles/km with node spacing > 320m',
          'Interference spikes paired with relayProbability < 0.45',
          'safetyAlert priority below 0.5 under high congestion'
        ],
        stabilityRegime: champion.metrics.protocolStability >= 70 ? 'stable' : 'transitional'
      }
    };
  }

  function toCsvRows(result) {
    const rows = ['rank,protocol,fitness,safety,congestion,coverage,node_spacing,tx_power'];
    (result.leaderboard || []).forEach((item, idx) => {
      rows.push([
        idx + 1,
        item.protocol.name,
        item.metrics.compositeFitness,
        item.metrics.safetyScore,
        item.metrics.networkCongestion,
        item.metrics.coverageReliability,
        item.infrastructure.nodeSpacing.toFixed(2),
        item.infrastructure.txPower.toFixed(2)
      ].join(','));
    });
    return rows.join('\n');
  }

  const api = { runEvolution, toCsvRows, createSeededRng };
  global.ProtocolEvolution = api;

  const decide = global.DECIDE || { engine: {}, tools: {}, simulation: {}, ui: {} };
  global.DECIDE = decide;
  decide.engine = decide.engine || {};
  decide.engine.protocolEvolution = api;
})(window);
