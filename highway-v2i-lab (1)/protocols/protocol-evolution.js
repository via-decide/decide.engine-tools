(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  function createEvolutionEngine(config) {
    const cfg = Object.assign({ population: 80, generations: 200 }, config || {});
    const genomeApi = global.HighwayProtocolGenome;

    function scoreCandidate(metrics) {
      const latencyScore = utils.clamp(100 - metrics.latency, 0, 100);
      const reliabilityScore = utils.clamp(metrics.packetReliability || metrics.coverageReliability, 0, 100);
      const energyScore = utils.clamp(100 - (metrics.energyConsumption || 100), 0, 100);
      const trafficScore = utils.clamp(metrics.trafficEfficiency || 0, 0, 100);
      const safetyScore = utils.clamp(100 - (metrics.safetyResponseTime || metrics.latency), 0, 100);
      return (latencyScore * 0.25) + (reliabilityScore * 0.25) + (energyScore * 0.15) + (trafficScore * 0.15) + (safetyScore * 0.2);
    }

    function evolve(stepEvaluator, options) {
      const opt = Object.assign({}, cfg, options || {});
      const populationSize = Math.max(8, Number(opt.population) || cfg.population);
      const generations = Math.max(1, Number(opt.generations) || cfg.generations);

      let population = Array.from({ length: populationSize }, () => genomeApi.createRandomGenome());
      const history = [];
      let best = null;

      for (let generation = 0; generation < generations; generation += 1) {
        const scored = population.map((genome) => {
          const metrics = stepEvaluator(genome);
          const fitness = scoreCandidate(metrics);
          const row = { genome, metrics, fitness, generation };
          if (!best || row.fitness > best.fitness) best = row;
          return row;
        }).sort((a, b) => b.fitness - a.fitness);

        history.push({
          generation,
          bestFitness: scored[0].fitness,
          meanFitness: scored.reduce((sum, item) => sum + item.fitness, 0) / scored.length,
          bestLatency: scored[0].metrics.latency,
          bestCongestion: scored[0].metrics.congestion,
          bestReliability: scored[0].metrics.coverageReliability,
          bestEnergy: scored[0].metrics.energyConsumption,
          bestSafetyResponseTime: scored[0].metrics.safetyResponseTime
        });

        const eliteCount = Math.max(2, Math.floor(populationSize * 0.2));
        const elites = scored.slice(0, eliteCount).map((item) => item.genome);
        const nextPopulation = elites.slice();

        while (nextPopulation.length < populationSize) {
          const parentA = elites[Math.floor(Math.random() * elites.length)];
          const parentB = elites[Math.floor(Math.random() * elites.length)];
          const child = genomeApi.mutateGenome(genomeApi.crossoverGenome(parentA, parentB), 0.18);
          nextPopulation.push(child);
        }

        population = nextPopulation;
      }

      return {
        config: { population: populationSize, generations },
        best,
        history
      };
    }

    return { evolve, scoreCandidate };
  }

  global.HighwayProtocolEvolution = { createEvolutionEngine };
})(window);
