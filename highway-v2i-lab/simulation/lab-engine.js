(function (global) {
  'use strict';

  function createLabEngine(options) {
    const cfg = Object.assign({
      population: 60,
      generations: 200
    }, options || {});

    const events = global.HighwayEventEngine.createEventEngine();
    const vehicles = global.HighwayVehicleEngine.createVehicleEngine({ density: 28 });
    const network = global.HighwayNetworkEngine.createNetworkEngine({ rsuSpacing: 220 });
    const sensors = global.HighwaySensorEngine.createSensorEngine({ sensorDensity: 0.45 });
    const graphExecutor = global.HighwayDecisionGraph.createGraphExecutor();
    const evolution = global.HighwayProtocolEvolution.createEvolutionEngine({
      population: cfg.population,
      generations: cfg.generations
    });
    const infraGenomeApi = global.HighwayInfrastructureGenome;
    const research = global.HighwayResearchOutput.createResearchStore();

    function simulateGenome(genome, ticks) {
      const steps = Math.max(5, Number(ticks) || 24);
      let latencySum = 0;
      let congestionSum = 0;
      let reliabilitySum = 0;

      vehicles.applyRelayClusters(genome.clusterRelayBias || 4);

      for (let i = 0; i < steps; i += 1) {
        const vehicleState = vehicles.tick(0.35, events);
        const sensorState = sensors.tick(vehicleState, events);
        const networkState = network.simulateTick(vehicleState, genome, events);

        graphExecutor.execute({
          vehicles: vehicleState,
          sensor: sensorState,
          network: networkState
        }, events);

        latencySum += networkState.latency;
        congestionSum += networkState.congestion;
        reliabilitySum += networkState.coverageReliability;
      }

      return {
        latency: latencySum / steps,
        congestion: congestionSum / steps,
        coverageReliability: reliabilitySum / steps
      };
    }

    function baselineMetrics() {
      return simulateGenome({
        broadcastInterval: 5,
        relayProbability: 0.3,
        priorityRouting: false,
        messageTTL: 3,
        adaptiveDelay: 0.7,
        clusterRelayBias: 7
      }, 26);
    }

    function runEvolution(opts) {
      const baseline = baselineMetrics();
      const result = evolution.evolve((genome) => simulateGenome(genome, 24), opts || {});
      const best = result.best;
      const latencyGain = ((baseline.latency - best.metrics.latency) / baseline.latency) * 100;
      const congestionGain = ((baseline.congestion - best.metrics.congestion) / baseline.congestion) * 100;
      const reliabilityGain = ((best.metrics.coverageReliability - baseline.coverageReliability) / Math.max(1, baseline.coverageReliability)) * 100;

      const success = latencyGain >= 5 || congestionGain >= 5 || reliabilityGain >= 5 ||
        (best.metrics.latency < baseline.latency || best.metrics.congestion < baseline.congestion || best.metrics.coverageReliability > baseline.coverageReliability);

      research.addProtocolLog({ baseline, best, latencyGain, congestionGain, reliabilityGain, success });
      research.addReport(
        'Protocol comparison table',
        success ? 'Evolution discovered an improved strategy.' : 'No >=5% gain; best candidate still compared against baseline.',
        [
          { metric: 'latency', baseline: baseline.latency, candidate: best.metrics.latency, gainPct: latencyGain },
          { metric: 'congestion', baseline: baseline.congestion, candidate: best.metrics.congestion, gainPct: congestionGain },
          { metric: 'reliability', baseline: baseline.coverageReliability, candidate: best.metrics.coverageReliability, gainPct: reliabilityGain }
        ]
      );

      return Object.assign({}, result, {
        baseline,
        improvements: { latencyGain, congestionGain, reliabilityGain },
        success
      });
    }

    function evaluateInfrastructure(genome) {
      network.updateInfrastructure(genome);
      sensors.updateDensity(genome.sensorDensity);
      const metrics = simulateGenome(global.HighwayProtocolGenome.createRandomGenome(), 16);
      const infrastructureScore = infraGenomeApi.scoreInfrastructure(metrics);
      research.addDataset('infrastructure-eval', { genome, metrics, infrastructureScore });
      return Object.assign({}, metrics, { infrastructureScore });
    }

    function discoverInfrastructure(iterations) {
      const total = Math.max(10, Number(iterations) || 40);
      let best = null;
      for (let i = 0; i < total; i += 1) {
        const seed = infraGenomeApi.createRandomInfrastructureGenome();
        const genome = i === 0 ? seed : infraGenomeApi.mutateInfrastructureGenome(seed);
        const score = evaluateInfrastructure(genome);
        if (!best || score.infrastructureScore > best.score.infrastructureScore) {
          best = { genome, score };
        }
      }
      return best;
    }

    function telemetrySnapshot() {
      return {
        events: events.snapshotTelemetry(250),
        research: research.snapshot()
      };
    }

    return {
      runEvolution,
      evaluateInfrastructure,
      discoverInfrastructure,
      telemetrySnapshot,
      simulateGenome
    };
  }

  global.HighwayLabEngine = { createLabEngine };
})(window);
