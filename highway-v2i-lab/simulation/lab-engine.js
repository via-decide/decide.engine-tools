(function (global) {
  'use strict';

  function createLabEngine(options) {
    const cfg = Object.assign({
      population: 80,
      generations: 200,
      corridorLength: 1000,
      defaultNetworkMode: 'dsrc',
      behaviorMode: 'baseline'
    }, options || {});

    const events = global.HighwayEventEngine.createEventEngine();
    const vehicles = global.HighwayVehicleEngine.createVehicleEngine({ density: 28, corridorLength: cfg.corridorLength, behaviorMode: cfg.behaviorMode });
    const network = global.HighwayNetworkEngine.createNetworkEngine({ rsuSpacing: 220, corridorLength: cfg.corridorLength, networkMode: cfg.defaultNetworkMode });
    const sensors = global.HighwaySensorEngine.createSensorEngine({ sensorDensity: 0.45 });
    const graphExecutor = global.HighwayDecisionGraph.createGraphExecutor();
    const evolution = global.HighwayProtocolEvolution.createEvolutionEngine({
      population: cfg.population,
      generations: cfg.generations
    });
    const infraGenomeApi = global.HighwayInfrastructureGenome;
    const protocolGenomeApi = global.HighwayProtocolGenome;
    const research = global.HighwayResearchOutput.createResearchStore();

    function simulateGenome(genome, ticks, simOptions) {
      const steps = Math.max(5, Number(ticks) || 24);
      const opts = Object.assign({
        networkMode: cfg.defaultNetworkMode,
        behaviorMode: cfg.behaviorMode
      }, simOptions || {});

      network.setNetworkMode(opts.networkMode);
      vehicles.applyBehaviorMode(opts.behaviorMode);
      vehicles.applyRelayClusters(genome.clusterRelayBias || 4);

      let latencySum = 0;
      let congestionSum = 0;
      let reliabilitySum = 0;
      let energySum = 0;
      let trafficEfficiencySum = 0;
      let safetyResponseSum = 0;
      let decisionsTriggered = 0;

      for (let i = 0; i < steps; i += 1) {
        const vehicleState = vehicles.tick(0.35, events);
        const sensorState = sensors.tick(vehicleState, events);
        const networkState = network.simulateTick(vehicleState, genome, events);

        const graphOutputs = graphExecutor.execute({
          vehicles: vehicleState,
          sensor: sensorState,
          network: networkState
        }, events);

        if (graphOutputs.responseAction === 'dispatch-safety-alert') decisionsTriggered += 1;

        latencySum += networkState.latency;
        congestionSum += networkState.congestion;
        reliabilitySum += networkState.coverageReliability;
        energySum += networkState.energyConsumption;
        trafficEfficiencySum += networkState.trafficEfficiency;
        safetyResponseSum += networkState.safetyResponseTime;
      }

      return {
        latency: latencySum / steps,
        congestion: congestionSum / steps,
        coverageReliability: reliabilitySum / steps,
        packetReliability: reliabilitySum / steps,
        energyConsumption: energySum / steps,
        trafficEfficiency: trafficEfficiencySum / steps,
        safetyResponseTime: safetyResponseSum / steps,
        graphActivations: decisionsTriggered,
        networkMode: opts.networkMode,
        behaviorMode: opts.behaviorMode
      };
    }

    function baselineMetrics(networkMode) {
      return simulateGenome({
        broadcastInterval: 5,
        relayProbability: 0.3,
        priorityWeight: 0.4,
        clusterRadius: 80,
        adaptiveDelay: 0.7,
        collisionAvoidanceFactor: 0.35,
        priorityRouting: false,
        messageTTL: 3,
        clusterRelayBias: 7
      }, 26, { networkMode: networkMode || 'dsrc', behaviorMode: 'baseline' });
    }

    function runEvolution(opts) {
      const options = Object.assign({ networkMode: cfg.defaultNetworkMode }, opts || {});
      const baseline = baselineMetrics(options.networkMode);
      const result = evolution.evolve((genome) => simulateGenome(genome, 24, options), options);
      const best = result.best;

      const latencyGain = ((baseline.latency - best.metrics.latency) / baseline.latency) * 100;
      const reliabilityGain = ((best.metrics.packetReliability - baseline.packetReliability) / Math.max(1, baseline.packetReliability)) * 100;
      const energyGain = ((baseline.energyConsumption - best.metrics.energyConsumption) / Math.max(1, baseline.energyConsumption)) * 100;
      const safetyGain = ((baseline.safetyResponseTime - best.metrics.safetyResponseTime) / Math.max(1, baseline.safetyResponseTime)) * 100;

      const success = latencyGain >= 5 || reliabilityGain >= 5 || energyGain >= 5 || safetyGain >= 5;

      research.addProtocolLog({ baseline, best, latencyGain, reliabilityGain, energyGain, safetyGain, success });
      research.addLeaderboardEntry('protocol', {
        networkMode: options.networkMode,
        behaviorMode: options.behaviorMode || cfg.behaviorMode,
        fitness: best.fitness,
        genome: best.genome,
        metrics: best.metrics,
        gains: { latencyGain, reliabilityGain, energyGain, safetyGain },
        success
      });
      research.addReport(
        'Protocol comparison table',
        success ? 'Evolution discovered an improved strategy.' : 'No >=5% gain; best candidate still compared against baseline.',
        [
          { metric: 'latency', baseline: baseline.latency, candidate: best.metrics.latency, gainPct: latencyGain },
          { metric: 'reliability', baseline: baseline.packetReliability, candidate: best.metrics.packetReliability, gainPct: reliabilityGain },
          { metric: 'energy', baseline: baseline.energyConsumption, candidate: best.metrics.energyConsumption, gainPct: energyGain },
          { metric: 'safety-response', baseline: baseline.safetyResponseTime, candidate: best.metrics.safetyResponseTime, gainPct: safetyGain }
        ]
      );

      return Object.assign({}, result, {
        baseline,
        improvements: { latencyGain, reliabilityGain, energyGain, safetyGain },
        success
      });
    }

    function evaluateInfrastructure(genome, simOptions) {
      network.updateInfrastructure(genome);
      sensors.updateDensity(genome.sensorDensity);
      const metrics = simulateGenome(protocolGenomeApi.createRandomGenome(), 16, simOptions || {});
      const infrastructureScore = infraGenomeApi.scoreInfrastructure(metrics);
      research.addDataset('infrastructure-eval', { genome, metrics, infrastructureScore });
      return Object.assign({}, metrics, { infrastructureScore });
    }

    function discoverInfrastructure(iterations, simOptions) {
      const total = Math.max(10, Number(iterations) || 40);
      let best = null;
      for (let i = 0; i < total; i += 1) {
        const seed = infraGenomeApi.createRandomInfrastructureGenome();
        const genome = i === 0 ? seed : infraGenomeApi.mutateInfrastructureGenome(seed);
        const score = evaluateInfrastructure(genome, simOptions);
        if (!best || score.infrastructureScore > best.score.infrastructureScore) {
          best = { genome, score };
        }
      }
      research.addLeaderboardEntry('infrastructure', best);
      return best;
    }

    function discoverArchitecture(options) {
      const opt = Object.assign({
        candidates: 60,
        networkModes: ['dsrc', 'c-v2x', '5g-v2x', 'vehicle-mesh-relay', 'cluster-broadcast', 'opportunistic-communication', 'edge-assisted-routing'],
        behaviorModes: ['baseline', 'cluster-leader-election', 'dynamic-relay-nodes', 'platoon-communication', 'cooperative-braking-signals', 'adaptive-speed-coordination']
      }, options || {});

      let best = null;
      const ranked = [];
      for (let i = 0; i < opt.candidates; i += 1) {
        const protocolGenome = protocolGenomeApi.createRandomGenome();
        const infrastructureGenome = infraGenomeApi.createRandomInfrastructureGenome();
        const networkMode = opt.networkModes[i % opt.networkModes.length];
        const behaviorMode = opt.behaviorModes[i % opt.behaviorModes.length];

        network.updateInfrastructure(infrastructureGenome);
        sensors.updateDensity(infrastructureGenome.sensorDensity);

        const metrics = simulateGenome(protocolGenome, 20, { networkMode, behaviorMode });
        const architectureScore = evolution.scoreCandidate(metrics) + infraGenomeApi.scoreInfrastructure(metrics);

        const candidate = { protocolGenome, infrastructureGenome, behaviorMode, networkMode, metrics, architectureScore };
        ranked.push(candidate);
        if (!best || architectureScore > best.architectureScore) best = candidate;
      }

      ranked.sort((a, b) => b.architectureScore - a.architectureScore);
      research.addDataset('architecture-discovery', ranked.slice(0, 25));
      research.addLeaderboardEntry('architecture', best);
      return { best, ranked: ranked.slice(0, 25) };
    }

    function runInventionMode(options) {
      const candidateBehaviors = ['cluster-leader-election', 'dynamic-relay-nodes', 'platoon-communication', 'cooperative-braking-signals', 'adaptive-speed-coordination'];
      const candidateNetworks = ['vehicle-mesh-relay', 'cluster-broadcast', 'opportunistic-communication', 'edge-assisted-routing'];
      const discovery = discoverArchitecture(Object.assign({
        candidates: 90,
        networkModes: candidateNetworks,
        behaviorModes: candidateBehaviors
      }, options || {}));

      const baseline = baselineMetrics('c-v2x');
      const improvedLatency = baseline.latency - discovery.best.metrics.latency;
      const improvedReliability = discovery.best.metrics.packetReliability - baseline.packetReliability;
      const improvedEfficiency = discovery.best.metrics.trafficEfficiency - baseline.trafficEfficiency;
      const success = improvedLatency > 0 && improvedReliability > 0 && improvedEfficiency > 0;

      research.addReport('Invention mode outcome', success ? 'Novel architecture outperformed C-V2X baseline.' : 'Novel architectures did not beat all baseline dimensions.', [
        { metric: 'latencyDelta', value: improvedLatency },
        { metric: 'reliabilityDelta', value: improvedReliability },
        { metric: 'efficiencyDelta', value: improvedEfficiency }
      ]);

      return {
        baseline,
        candidate: discovery.best,
        deltas: { improvedLatency, improvedReliability, improvedEfficiency },
        success
      };
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
      discoverArchitecture,
      runInventionMode,
      telemetrySnapshot,
      simulateGenome
    };
  }

  global.HighwayLabEngine = { createLabEngine };
})(window);
