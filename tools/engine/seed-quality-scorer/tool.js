(() => {
  class SeedQualityScorer {
    constructor() {
      this.state = {
        growthFocus: 'balanced',
        weights: {
          clarity: 35,
          viability: 35,
          growth: 30
        },
        seeds: [],
        scores: []
      };

      this.demoSeeds = [
        {
          id: 'seed-root-mapping',
          title: 'Root Mapping Checklist',
          clarity: 88,
          viability: 77,
          growthPotential: 84,
          tags: ['roots', 'onboarding']
        },
        {
          id: 'seed-fruit-template',
          title: 'Fruit Output Template',
          clarity: 73,
          viability: 91,
          growthPotential: 67,
          tags: ['fruits', 'delivery']
        },
        {
          id: 'seed-branch-playbook',
          title: 'Branch Specialization Playbook',
          clarity: 81,
          viability: 70,
          growthPotential: 89,
          tags: ['branches', 'career-growth']
        }
      ];
    }

    init() {
      this.bindDom();
      this.attachEvents();
      this.resetDemoData();
      this.scoreSeeds();
    }

    bindDom() {
      this.dom = {
        growthFocus: document.getElementById('growthFocus'),
        seedInput: document.getElementById('seedInput'),
        weightClarity: document.getElementById('weightClarity'),
        weightViability: document.getElementById('weightViability'),
        weightGrowth: document.getElementById('weightGrowth'),
        weightClarityValue: document.getElementById('weightClarityValue'),
        weightViabilityValue: document.getElementById('weightViabilityValue'),
        weightGrowthValue: document.getElementById('weightGrowthValue'),
        scoreBtn: document.getElementById('scoreBtn'),
        resetBtn: document.getElementById('resetBtn'),
        totalSeeds: document.getElementById('totalSeeds'),
        avgScore: document.getElementById('avgScore'),
        topTier: document.getElementById('topTier'),
        resultOutput: document.getElementById('resultOutput')
      };
    }

    attachEvents() {
      ['weightClarity', 'weightViability', 'weightGrowth'].forEach((key) => {
        this.dom[key].addEventListener('input', () => {
          this.updateWeightDisplay();
        });
      });

      this.dom.scoreBtn.addEventListener('click', () => this.scoreSeeds());
      this.dom.resetBtn.addEventListener('click', () => {
        this.resetDemoData();
        this.scoreSeeds();
      });
    }

    resetDemoData() {
      this.state.growthFocus = 'balanced';
      this.state.weights = { clarity: 35, viability: 35, growth: 30 };
      this.state.seeds = [...this.demoSeeds];

      this.dom.growthFocus.value = this.state.growthFocus;
      this.dom.weightClarity.value = this.state.weights.clarity;
      this.dom.weightViability.value = this.state.weights.viability;
      this.dom.weightGrowth.value = this.state.weights.growth;
      this.dom.seedInput.value = JSON.stringify(this.demoSeeds, null, 2);
      this.updateWeightDisplay();
    }

    updateWeightDisplay() {
      this.dom.weightClarityValue.textContent = `${this.dom.weightClarity.value}%`;
      this.dom.weightViabilityValue.textContent = `${this.dom.weightViability.value}%`;
      this.dom.weightGrowthValue.textContent = `${this.dom.weightGrowth.value}%`;
    }

    getFocusModifiers(focus) {
      if (focus === 'root-heavy') {
        return { clarity: 1.1, viability: 0.95, growthPotential: 1.05 };
      }
      if (focus === 'fruit-heavy') {
        return { clarity: 0.95, viability: 1.12, growthPotential: 1.0 };
      }
      return { clarity: 1.0, viability: 1.0, growthPotential: 1.0 };
    }

    normalizeWeights(rawWeights) {
      const total = rawWeights.clarity + rawWeights.viability + rawWeights.growth;
      return {
        clarity: rawWeights.clarity / total,
        viability: rawWeights.viability / total,
        growth: rawWeights.growth / total
      };
    }

    parseSeedsFromInput() {
      try {
        const parsed = JSON.parse(this.dom.seedInput.value);
        if (!Array.isArray(parsed)) {
          throw new Error('Seed batch must be a JSON array.');
        }
        return parsed;
      } catch (error) {
        throw new Error(`Invalid seed JSON: ${error.message}`);
      }
    }

    calculateSeedScore(seed, normalizedWeights, modifiers) {
      const clarity = this.clamp((seed.clarity || 0) * modifiers.clarity, 0, 100);
      const viability = this.clamp((seed.viability || 0) * modifiers.viability, 0, 100);
      const growthPotential = this.clamp((seed.growthPotential || 0) * modifiers.growthPotential, 0, 100);

      const totalScore = (
        clarity * normalizedWeights.clarity +
        viability * normalizedWeights.viability +
        growthPotential * normalizedWeights.growth
      );

      return {
        id: seed.id || 'unknown-seed',
        title: seed.title || 'Untitled Seed',
        metrics: {
          clarity: Number(clarity.toFixed(1)),
          viability: Number(viability.toFixed(1)),
          growthPotential: Number(growthPotential.toFixed(1))
        },
        totalScore: Number(totalScore.toFixed(2)),
        qualityTier: this.toQualityTier(totalScore),
        recommendation: this.toRecommendation(totalScore)
      };
    }

    toQualityTier(score) {
      if (score >= 85) return 'Prime Fruit';
      if (score >= 70) return 'Healthy Branch';
      if (score >= 55) return 'Developing Trunk';
      return 'Needs Root Work';
    }

    toRecommendation(score) {
      if (score >= 85) return 'Ship as reusable seed and share in orchard exchange.';
      if (score >= 70) return 'Polish examples and add edge-case guidance before scaling.';
      if (score >= 55) return 'Improve clarity with step-by-step structure and stronger defaults.';
      return 'Rebuild fundamentals first: define scope, outcomes, and viability proof.';
    }

    clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    scoreSeeds() {
      try {
        this.state.growthFocus = this.dom.growthFocus.value;
        this.state.weights = {
          clarity: Number(this.dom.weightClarity.value),
          viability: Number(this.dom.weightViability.value),
          growth: Number(this.dom.weightGrowth.value)
        };
        this.state.seeds = this.parseSeedsFromInput();

        const normalizedWeights = this.normalizeWeights(this.state.weights);
        const modifiers = this.getFocusModifiers(this.state.growthFocus);

        this.state.scores = this.state.seeds.map((seed) =>
          this.calculateSeedScore(seed, normalizedWeights, modifiers)
        ).sort((a, b) => b.totalScore - a.totalScore);

        const average = this.state.scores.length
          ? this.state.scores.reduce((sum, seed) => sum + seed.totalScore, 0) / this.state.scores.length
          : 0;

        this.dom.totalSeeds.textContent = String(this.state.scores.length);
        this.dom.avgScore.textContent = average.toFixed(1);
        this.dom.topTier.textContent = this.state.scores[0]?.qualityTier || '-';

        this.dom.resultOutput.textContent = JSON.stringify({
          tool: 'seed-quality-scorer',
          growthFocus: this.state.growthFocus,
          normalizedWeights,
          scoredAt: new Date().toISOString(),
          seeds: this.state.scores
        }, null, 2);
      } catch (error) {
        this.dom.resultOutput.textContent = JSON.stringify({ error: error.message }, null, 2);
        this.dom.totalSeeds.textContent = '0';
        this.dom.avgScore.textContent = '0.0';
        this.dom.topTier.textContent = '-';
      }
    }
  }

  const app = new SeedQualityScorer();
  app.init();
})();
