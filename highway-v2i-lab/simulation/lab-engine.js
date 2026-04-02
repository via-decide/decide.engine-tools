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

    function deriveTrafficIntelligence(vehicleState, networkState) {
      const density = vehicleState.densityPerKm || 0;
      const wave = vehicleState.trafficWaveIndex || 0;
      const speedVar = vehicleState.speedVariance || 0;
      const bottleneckLane = vehicleState.bottleneckLane || 0;
      const laneUsage = vehicleState.laneCounts || [0, 0, 0];
      const congestionScore = Math.max(0, Math.min(100, (density * 0.7) + (wave * 30) + networkState.congestion * 0.6 + (speedVar * 0.4)));
      const predictedCongestion = congestionScore > 70 ? 'high' : (congestionScore > 45 ? 'medium' : 'low');
      const travelTimeMinutes = (cfg.corridorLength / 1000) / Math.max(5, vehicleState.averageSpeed || 20) * 60;
      const heatmap = laneUsage.map((count, idx) => ({ lane: idx + 1, density: count, heat: Math.min(100, Math.round((count / Math.max(1, vehicleState.vehicles.length)) * 300)) }));
      const laneOptimization = laneUsage.map((count, idx) => ({
        lane: idx + 1,
        recommendation: count === Math.max.apply(null, laneUsage) ? 'offload' : 'accept',
        utilization: Number((count / Math.max(1, vehicleState.vehicles.length)).toFixed(3))
      }));

      return {
        density,
        laneSwitchingRate: vehicleState.laneChanges / Math.max(1, vehicleState.vehicles.length),
        speedVariation: speedVar,
        trafficWaveIndex: wave,
        bottleneckLane,
        predictedCongestion,
        travelTimeMinutes,
        congestionAlerts: predictedCongestion === 'high' ? ['Corridor congestion risk elevated'] : [],
        laneOptimization,
        heatmap
      };
    }

    function simulateDrainage(simOptions, vehicleState, sensorState) {
      const rainfall = Number(simOptions && simOptions.rainIntensity) || 12;
      const roadSlope = Number(simOptions && simOptions.roadSlope) || 2.4;
      const drainPlacement = Number(simOptions && simOptions.drainPlacement) || 4;
      const flowDirection = simOptions && simOptions.waterFlowDirection ? simOptions.waterFlowDirection : 'east';

      const accumulation = Math.max(0, (rainfall * 1.8) - (roadSlope * 4.2) - (drainPlacement * 1.5) + (vehicleState.densityPerKm * 0.09));
      const floodRisk = accumulation > 28 ? 'high' : (accumulation > 16 ? 'medium' : 'low');
      const safeRoadSlope = Math.max(1.5, Number((rainfall / 6.8).toFixed(2)));
      const drainPlacementOptimization = Math.max(2, Math.ceil(rainfall / 5));

      return {
        rainIntensity: rainfall,
        roadSlope,
        drainPlacement,
        waterFlowDirection: flowDirection,
        waterAccumulationMap: {
          segmentA: Number((accumulation * 0.9).toFixed(2)),
          segmentB: Number(accumulation.toFixed(2)),
          segmentC: Number((accumulation * 1.1).toFixed(2))
        },
        floodRisk,
        safeRoadSlope,
        drainPlacementOptimization,
        drainageAngle: sensorState.drainageSensor.angle,
        selfCleaningSensorDesignScore: Number((sensorState.drainageSensor.selfCleaningFactor * 100).toFixed(2))
      };
    }

    function simulateEmergencyMobility(simOptions, vehicleState, networkState, trafficIntelligence) {
      const eventType = simOptions && simOptions.emergencyEvent ? simOptions.emergencyEvent : null;
      const incidentDetected = Boolean(eventType) || vehicleState.anomalyCount > 0;
      const prioritySignals = incidentDetected ? Math.max(2, Math.round(networkState.rsuCount * 0.35)) : 0;
      const distanceClearedKm = incidentDetected ? Number((0.3 + (prioritySignals * 0.08)).toFixed(2)) : 0;
      const responseMinutes = incidentDetected
        ? Number((2 + (networkState.latency / 25) + (trafficIntelligence.predictedCongestion === 'high' ? 2.2 : 0.9)).toFixed(2))
        : 0;
      const disruptionIndex = incidentDetected
        ? Number(Math.min(100, 28 + trafficIntelligence.density * 0.5 + networkState.congestion * 0.4).toFixed(2))
        : 0;

      if (incidentDetected) {
        events.emit('emergency.corridor', {
          eventType: eventType || 'vehicle-anomaly',
          responseMinutes,
          prioritySignals,
          distanceClearedKm
        });
      }

      return {
        crashDetected: eventType === 'crash' || vehicleState.anomalyCount > 1,
        breakdownDetected: eventType === 'breakdown',
        roadBlockageDetected: eventType === 'road_blockage',
        emergencyCorridorActive: incidentDetected,
        dynamicLaneClearing: incidentDetected,
        priorityTrafficSignals: prioritySignals,
        vehicleAlertsIssued: incidentDetected ? vehicleState.vehicles.length : 0,
        emergencyResponseTime: responseMinutes,
        distanceCleared: distanceClearedKm,
        trafficDisruptionIndex: disruptionIndex
      };
    }

    function buildDigitalTwin(vehicleState, sensorState, networkState, trafficIntelligence, drainage, emergency) {
      return {
        timestamp: new Date().toISOString(),
        entities: {
          vehicles: vehicleState.vehicles.length,
          sensors: sensorState.sensorHits,
          trafficLights: Math.max(4, Math.round(networkState.rsuCount / 2)),
          rsuNodes: networkState.rsuCount,
          weather: {
            rainIntensity: drainage.rainIntensity,
            floodRisk: drainage.floodRisk
          },
          energySystems: {
            energyConsumption: networkState.energyConsumption,
            backupGridState: sensorState.health.networkDowntime < 0.1 ? 'stable' : 'degraded'
          }
        },
        layers: {
          traffic: {
            averageSpeed: vehicleState.averageSpeed,
            congestion: trafficIntelligence.predictedCongestion,
            heatmap: trafficIntelligence.heatmap
          },
          sensorNetwork: {
            confidence: sensorState.confidence,
            healthScore: sensorState.health.score
          },
          communication: {
            mode: networkState.mode,
            latency: networkState.latency,
            coverageReliability: networkState.coverageReliability
          },
          environment: {
            floodRisk: drainage.floodRisk,
            waterAccumulationMap: drainage.waterAccumulationMap,
            emergencyCorridorActive: emergency.emergencyCorridorActive
          }
        }
      };
    }

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
      let densitySum = 0;
      let laneSwitchSum = 0;
      let speedVarSum = 0;
      let waveSum = 0;
      let infraHealthSum = 0;
      let repairPrioritySum = 0;
      let emergencyResponseSum = 0;
      let disruptionSum = 0;
      let floodRiskHighTicks = 0;
      let twin = null;
      let lastTraffic = null;
      let lastDrainage = null;
      let lastEmergency = null;
      let lastSensor = null;

      for (let i = 0; i < steps; i += 1) {
        const vehicleState = vehicles.tick(0.35, events);
        const sensorState = sensors.tick(vehicleState, events);
        const networkState = network.simulateTick(vehicleState, genome, events);

        const graphOutputs = graphExecutor.execute({
          vehicles: vehicleState,
          sensor: sensorState,
          network: networkState
        }, events);

        const trafficIntelligence = deriveTrafficIntelligence(vehicleState, networkState);
        const drainage = simulateDrainage(opts, vehicleState, sensorState);
        const emergency = simulateEmergencyMobility(opts, vehicleState, networkState, trafficIntelligence);
        twin = buildDigitalTwin(vehicleState, sensorState, networkState, trafficIntelligence, drainage, emergency);

        if (graphOutputs.responseAction === 'dispatch-safety-alert') decisionsTriggered += 1;

        latencySum += networkState.latency;
        congestionSum += networkState.congestion;
        reliabilitySum += networkState.coverageReliability;
        energySum += networkState.energyConsumption;
        trafficEfficiencySum += networkState.trafficEfficiency;
        safetyResponseSum += networkState.safetyResponseTime;
        densitySum += trafficIntelligence.density;
        laneSwitchSum += trafficIntelligence.laneSwitchingRate;
        speedVarSum += trafficIntelligence.speedVariation;
        waveSum += trafficIntelligence.trafficWaveIndex;
        infraHealthSum += sensorState.health.score;
        repairPrioritySum += sensorState.health.repairPriorityScore;
        emergencyResponseSum += emergency.emergencyResponseTime;
        disruptionSum += emergency.trafficDisruptionIndex;
        if (drainage.floodRisk === 'high') floodRiskHighTicks += 1;

        lastTraffic = trafficIntelligence;
        lastDrainage = drainage;
        lastEmergency = emergency;
        lastSensor = sensorState;
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
        behaviorMode: opts.behaviorMode,
        trafficIntelligence: Object.assign({}, lastTraffic, {
          averageDensity: densitySum / steps,
          averageLaneSwitchingRate: laneSwitchSum / steps,
          averageSpeedVariation: speedVarSum / steps,
          averageTrafficWaveIndex: waveSum / steps
        }),
        infrastructureHealth: {
          healthScore: infraHealthSum / steps,
          repairPriorityScore: repairPrioritySum / steps,
          maintenancePredictionTimeline: lastSensor ? lastSensor.health.maintenancePredictionHrs : 0
        },
        drainage: Object.assign({}, lastDrainage, {
          floodHighTickRatio: floodRiskHighTicks / steps
        }),
        emergencyMobility: Object.assign({}, lastEmergency, {
          avgEmergencyResponseTime: emergencyResponseSum / steps,
          avgTrafficDisruptionIndex: disruptionSum / steps
        }),
        digitalTwin: twin
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
      if (sensors.updateInfrastructureConfig) sensors.updateInfrastructureConfig(genome);
      else sensors.updateDensity(genome.sensorDensity);
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

    function buildInfrastructureScenarios() {
      return [
        { name: 'heavy-traffic', behaviorMode: 'baseline', networkMode: 'dsrc', rainIntensity: 9 },
        { name: 'heavy-rain', behaviorMode: 'dynamic-relay-nodes', networkMode: 'c-v2x', rainIntensity: 38, roadSlope: 1.6, drainPlacement: 3, waterFlowDirection: 'west' },
        { name: 'sensor-failure', behaviorMode: 'baseline', networkMode: 'vehicle-mesh-relay', rainIntensity: 12 },
        { name: 'emergency-vehicle', behaviorMode: 'cooperative-braking-signals', networkMode: '5g-v2x', emergencyEvent: 'breakdown', rainIntensity: 10 },
        { name: 'accident', behaviorMode: 'cooperative-braking-signals', networkMode: 'edge-assisted-routing', emergencyEvent: 'crash', rainIntensity: 11 }
      ];
    }

    function scoreInfrastructureAcrossScenarios(results) {
      const totals = results.reduce((acc, row) => {
        const metrics = row.metrics || {};
        const emergency = metrics.emergencyMobility || {};
        const drainage = metrics.drainage || {};
        acc.trafficDelay += metrics.congestion || 0;
        acc.emergencyResponseTime += emergency.avgEmergencyResponseTime || emergency.emergencyResponseTime || metrics.safetyResponseTime || 0;
        acc.sensorCoverage += metrics.coverageReliability || 0;
        acc.communicationLatency += metrics.latency || 0;
        acc.floodRisk += drainage.floodHighTickRatio != null ? drainage.floodHighTickRatio * 100 : (drainage.floodRisk === 'high' ? 90 : (drainage.floodRisk === 'medium' ? 45 : 15));
        acc.maintenanceCost += Math.max(0, 100 - ((metrics.infrastructureHealth && metrics.infrastructureHealth.healthScore) || 80));
        return acc;
      }, {
        trafficDelay: 0,
        emergencyResponseTime: 0,
        sensorCoverage: 0,
        communicationLatency: 0,
        floodRisk: 0,
        maintenanceCost: 0
      });
      const count = Math.max(1, results.length);
      const metrics = {
        trafficDelay: totals.trafficDelay / count,
        emergencyResponseTime: totals.emergencyResponseTime / count,
        sensorCoverage: totals.sensorCoverage / count,
        communicationLatency: totals.communicationLatency / count,
        floodRisk: totals.floodRisk / count,
        maintenanceCost: totals.maintenanceCost / count
      };
      const score = (
        (100 - metrics.trafficDelay) * 0.25 +
        (100 - (metrics.emergencyResponseTime * 10)) * 0.22 +
        metrics.sensorCoverage * 0.2 +
        (100 - metrics.communicationLatency) * 0.17 +
        (100 - metrics.floodRisk) * 0.1 +
        (100 - metrics.maintenanceCost) * 0.06
      );
      return {
        score,
        metrics
      };
    }

    function evolveInfrastructureDesigns(options) {
      const opt = Object.assign({
        population: 24,
        generations: 40,
        mutationRate: 0.22,
        scenarios: buildInfrastructureScenarios()
      }, options || {});
      const populationSize = Math.max(8, Number(opt.population) || 24);
      const generations = Math.max(2, Number(opt.generations) || 40);
      const mutationRate = Math.max(0.02, Math.min(0.8, Number(opt.mutationRate) || 0.22));
      let population = Array.from({ length: populationSize }, () => infraGenomeApi.createRandomInfrastructureGenome());
      const baselineGenome = infraGenomeApi.createBaselineInfrastructureGenome
        ? infraGenomeApi.createBaselineInfrastructureGenome()
        : infraGenomeApi.createRandomInfrastructureGenome();
      const baselineScenarioMetrics = opt.scenarios.map((scenario) => ({
        name: scenario.name,
        metrics: evaluateInfrastructure(baselineGenome, scenario)
      }));
      const baselineScore = scoreInfrastructureAcrossScenarios(baselineScenarioMetrics);
      const history = [];
      const tree = [];
      let best = null;

      for (let generation = 0; generation < generations; generation += 1) {
        const scored = population.map((genome, idx) => {
          const scenarioResults = opt.scenarios.map((scenario) => ({
            name: scenario.name,
            metrics: evaluateInfrastructure(genome, scenario)
          }));
          const aggregate = scoreInfrastructureAcrossScenarios(scenarioResults);
          const row = {
            id: `g${generation}-i${idx}`,
            generation,
            genome,
            scenarioResults,
            score: aggregate.score,
            metrics: aggregate.metrics
          };
          if (!best || row.score > best.score) best = row;
          return row;
        }).sort((a, b) => b.score - a.score);

        const meanFitness = scored.reduce((sum, item) => sum + item.score, 0) / scored.length;
        history.push({ generation, bestFitness: scored[0].score, meanFitness, metrics: scored[0].metrics });
        tree.push({
          generation,
          nodes: scored.slice(0, 6).map((item) => ({
            id: item.id,
            score: Number(item.score.toFixed(2)),
            rsuSpacing: Number(item.genome.rsuSpacing.toFixed(1)),
            laneWidth: Number(item.genome.laneWidth.toFixed(2)),
            drainSlope: Number(item.genome.drainSlope.toFixed(2))
          }))
        });

        const eliteCount = Math.max(2, Math.floor(populationSize * 0.25));
        const elites = scored.slice(0, eliteCount).map((item) => item.genome);
        const next = elites.slice();
        while (next.length < populationSize) {
          const parentA = elites[Math.floor(Math.random() * elites.length)];
          const parentB = elites[Math.floor(Math.random() * elites.length)];
          const crossover = infraGenomeApi.crossoverInfrastructureGenome
            ? infraGenomeApi.crossoverInfrastructureGenome(parentA, parentB)
            : infraGenomeApi.mutateInfrastructureGenome(parentA);
          let child = crossover;
          if (Math.random() < mutationRate) child = infraGenomeApi.mutateInfrastructureGenome(child);
          next.push(child);
        }
        population = next;
      }

      const improvements = {
        trafficDelayGainPct: ((baselineScore.metrics.trafficDelay - best.metrics.trafficDelay) / Math.max(1, baselineScore.metrics.trafficDelay)) * 100,
        emergencyResponseGainPct: ((baselineScore.metrics.emergencyResponseTime - best.metrics.emergencyResponseTime) / Math.max(0.5, baselineScore.metrics.emergencyResponseTime)) * 100,
        sensorCoverageGainPct: ((best.metrics.sensorCoverage - baselineScore.metrics.sensorCoverage) / Math.max(1, baselineScore.metrics.sensorCoverage)) * 100
      };
      const success = improvements.trafficDelayGainPct > 0 && improvements.emergencyResponseGainPct > 0 && improvements.sensorCoverageGainPct > 0;

      const recommendations = {
        optimizedRsuPlacement: {
          spacingMeters: Number(best.genome.rsuSpacing.toFixed(2)),
          communicationRange: Number(best.genome.communicationRange.toFixed(2)),
          topology: best.genome.communicationTopology
        },
        sensorLayoutRecommendations: {
          density: Number(best.genome.sensorDensity.toFixed(3)),
          placement: Number(best.genome.sensorPlacement.toFixed(3)),
          sensorAngle: Number(best.genome.sensorAngle.toFixed(2)),
          cameraAngle: Number(best.genome.cameraAngle.toFixed(2))
        },
        trafficControlStrategies: {
          emergencyLanePriority: Number(best.genome.emergencyLanePriority.toFixed(3)),
          laneWidth: Number(best.genome.laneWidth.toFixed(2)),
          drainSlope: Number(best.genome.drainSlope.toFixed(2))
        }
      };

      research.addDataset('infrastructure-evolution', {
        config: { population: populationSize, generations, mutationRate },
        baseline: { genome: baselineGenome, score: baselineScore },
        best,
        history,
        tree,
        recommendations,
        success
      });
      research.addLeaderboardEntry('infrastructure', {
        mode: 'evolution',
        fitness: best.score,
        genome: best.genome,
        metrics: best.metrics,
        improvements,
        success
      });
      research.addReport('Infrastructure Evolution Lab', success ? 'Evolution produced infrastructure gains over baseline.' : 'Evolution did not beat baseline on all key dimensions.', [
        { metric: 'traffic-delay', baseline: baselineScore.metrics.trafficDelay, candidate: best.metrics.trafficDelay, gainPct: improvements.trafficDelayGainPct },
        { metric: 'emergency-response', baseline: baselineScore.metrics.emergencyResponseTime, candidate: best.metrics.emergencyResponseTime, gainPct: improvements.emergencyResponseGainPct },
        { metric: 'sensor-coverage', baseline: baselineScore.metrics.sensorCoverage, candidate: best.metrics.sensorCoverage, gainPct: improvements.sensorCoverageGainPct }
      ]);

      return {
        config: { population: populationSize, generations, mutationRate, scenarios: opt.scenarios },
        baseline: { genome: baselineGenome, score: baselineScore },
        best,
        history,
        tree,
        improvements,
        recommendations,
        success
      };
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

    function runScenarioExperiment(scenario) {
      const cfgScenario = Object.assign({
        name: 'custom-scenario',
        rainIntensity: 12,
        roadSlope: 2.4,
        drainPlacement: 4,
        waterFlowDirection: 'east',
        emergencyEvent: null,
        networkMode: cfg.defaultNetworkMode,
        behaviorMode: cfg.behaviorMode
      }, scenario || {});
      const genome = protocolGenomeApi.createRandomGenome();
      const metrics = simulateGenome(genome, 30, cfgScenario);
      const record = {
        scenario: cfgScenario,
        metrics,
        generatedAt: new Date().toISOString()
      };
      research.addDataset('scenario-experiment', record);
      return record;
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
      evolveInfrastructureDesigns,
      telemetrySnapshot,
      simulateGenome,
      runScenarioExperiment
    };
  }

  global.HighwayLabEngine = { createLabEngine };
})(window);
