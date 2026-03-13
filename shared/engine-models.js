(function (global) {
  const U = global.EngineUtils;

  function baseMetrics(parsed, mode, secondary) {
    const base = U.toNumber(parsed.base, 50);
    const consistency = U.toNumber(parsed.consistency, 60);
    const quality = U.toNumber(parsed.quality, 55);
    const depth = U.toNumber(parsed.depth, 50);
    const peer = U.toNumber(parsed.peer, 45);
    const modifier = mode === 'accelerated' ? 1.15 : mode === 'resilient' ? 1.05 : 1;
    return { base, consistency, quality, depth, peer, modifier, secondary: U.toNumber(secondary, 0) };
  }

  function template(name, metrics, extras) {
    return {
      engine: name,
      roots: Math.round((metrics.base + metrics.consistency) * metrics.modifier / 2),
      trunk: Math.round((metrics.depth + metrics.quality) * metrics.modifier / 2),
      fruits: Math.round((metrics.quality + metrics.peer + metrics.secondary) * metrics.modifier / 2),
      seeds: Math.round((metrics.depth + metrics.peer) * metrics.modifier / 2),
      water: metrics.consistency,
      ...extras
    };
  }

  // Wave 1 models (Layer 1 Farm)
  function playerSignup(payload, mode) {
    const name = (payload.name || 'New Player').trim();
    const archetype = payload.archetype || 'steady-grower';
    const orchardName = payload.orchardName || `${name.replace(/\s+/g, '-')}-orchard`;
    const focusBranch = payload.focusBranch || 'generalist';
    return {
      player: { name, archetype, focusBranch },
      orchard: { id: orchardName.toLowerCase(), name: orchardName, layer: 'farm' },
      starterSummary: `${name} joins as ${archetype} with ${focusBranch} branch focus.`,
      mode
    };
  }

  function orchardProfileBuilder(payload, mode) {
    const roots = U.toNumber(payload.roots, 40);
    const trunk = U.toNumber(payload.trunk, 35);
    const branches = Array.isArray(payload.branches) ? payload.branches : ['research', 'build', 'communication'];
    const leaves = U.toNumber(payload.leaves, 10);
    const fruits = U.toNumber(payload.fruits, 2);
    const seeds = U.toNumber(payload.seeds, 1);
    const harvestHistory = Array.isArray(payload.harvestHistory) ? payload.harvestHistory : [];

    return {
      profile: {
        playerName: payload.playerName || 'Unnamed Player',
        roots,
        trunk,
        branches,
        leaves,
        fruits,
        seeds,
        harvestHistory
      },
      summary: `Roots ${roots} (${U.band(roots)}), trunk ${trunk} (${U.band(trunk)}), fruits ${fruits}.`,
      mode
    };
  }

  function starterFarmGenerator(payload, mode) {
    const soil = U.clamp(U.toNumber(payload.soilQuality, 55), 0, 100);
    const sunlight = U.clamp(U.toNumber(payload.sunlightExposure, 50), 0, 100);
    const water = U.clamp(U.toNumber(payload.waterCycle, 60), 0, 100);
    const archetype = payload.archetype || 'steady-grower';
    const slots = archetype === 'deep-specialist' ? 3 : archetype === 'explorer' ? 5 : 4;

    return {
      starterFarm: {
        resources: {
          water,
          minerals: Math.round((soil + sunlight) / 10),
          soil,
          sunlight
        },
        treeSlots: slots,
        rootStrength: Math.round((soil * 0.4 + water * 0.6)),
        trunkLevel: Math.round((sunlight * 0.45 + water * 0.35 + soil * 0.2) / 10),
        branchMap: {
          core: 'fundamentals',
          focus: payload.focusBranch || 'generalist',
          support: 'project-delivery'
        }
      },
      mode
    };
  }

  function rootStrengthCalculator(payload, mode) {
    const completedPractice = U.toNumber(payload.completedPractice, 0);
    const repetition = U.toNumber(payload.learningRepetition, 0);
    const difficulty = U.toNumber(payload.taskDifficulty, 50);
    const consistency = U.toNumber(payload.consistency, 50);

    const raw = (completedPractice * 2.2) + (repetition * 1.8) + (difficulty * 0.25) + (consistency * 0.35);
    const modeBoost = mode === 'accelerated' ? 1.08 : mode === 'resilient' ? 1.03 : 1;
    const score = U.clamp(Math.round((raw / 4) * modeBoost), 0, 100);

    return {
      roots: {
        completedPractice,
        repetition,
        difficulty,
        consistency,
        score,
        band: U.band(score)
      }
    };
  }

  function trunkGrowthCalculator(payload, mode) {
    const challengeCompletion = U.toNumber(payload.challengeCompletion, 0);
    const workDepth = U.toNumber(payload.workDepth, 0);
    const sustainedEffort = U.toNumber(payload.sustainedEffort, 0);
    const recoveredSetbacks = U.toNumber(payload.recoveredSetbacks, 0);

    const resilience = (challengeCompletion * 0.3) + (workDepth * 0.35) + (sustainedEffort * 0.25) + (recoveredSetbacks * 0.1);
    const modeBoost = mode === 'resilient' ? 1.12 : mode === 'accelerated' ? 1.04 : 1;
    const score = U.clamp(Math.round(resilience * modeBoost), 0, 100);

    return {
      trunk: {
        challengeCompletion,
        workDepth,
        sustainedEffort,
        recoveredSetbacks,
        score,
        band: U.band(score)
      }
    };
  }

  function fruitYieldEngine(payload, mode) {
    const title = payload.artifactTitle || 'Untitled Artifact';
    const quality = U.toNumber(payload.quality, 50);
    const completionState = payload.completionState || 'done';
    const effortDepth = U.toNumber(payload.effortDepth, 50);
    const doneFactor = completionState === 'done' ? 1 : completionState === 'draft' ? 0.6 : 0.2;
    const fruitCount = Math.max(0, Math.round(((quality * 0.55 + effortDepth * 0.45) / 20) * doneFactor));

    return {
      fruit: {
        title,
        quality,
        completionState,
        effortDepth,
        fruitCount,
        fruitType: fruitCount >= 4 ? 'golden-fruit' : fruitCount >= 2 ? 'ripe-fruit' : 'sprout-fruit'
      },
      mode
    };
  }

  function dailyQuestGenerator(payload, mode) {
    const rootScore = U.toNumber(payload.rootScore, 50);
    const trunkScore = U.toNumber(payload.trunkScore, 50);
    const recentFruits = U.toNumber(payload.recentFruits, 1);

    const rootTask = rootScore < 60
      ? 'Root task: 30 minutes fundamentals drill + 1 spaced repetition pass.'
      : 'Root task: review one weak concept and write a seed note.';
    const trunkTask = trunkScore < 60
      ? 'Trunk task: complete one deep work block (45 min, no context switching).'
      : 'Trunk task: finish one challenge upgrade with reflection.';
    const harvestTask = recentFruits < 2
      ? 'Harvest task: ship one small completed artifact today.'
      : 'Harvest task: refine one artifact and improve quality by one tier.';

    return {
      dailyQuests: [rootTask, trunkTask, harvestTask],
      generatedBy: 'deterministic-rule-engine',
      mode
    };
  }

  function weeklyHarvestEngine(payload, mode) {
    const consistency = U.toNumber(payload.consistency, 50);
    const completedFruits = U.toNumber(payload.completedFruits, 0);
    const growthTrend = U.toNumber(payload.growthTrend, 50);
    const taskCompletionRate = U.toNumber(payload.taskCompletionRate, 50);

    const fairnessGuard = U.clamp(100 - Math.max(0, completedFruits - 12) * 4, 60, 100);
    const score = U.clamp(Math.round(
      consistency * 0.3 +
      Math.min(completedFruits * 6, 100) * 0.2 +
      growthTrend * 0.25 +
      taskCompletionRate * 0.25
    ), 0, 100);

    return {
      weeklyHarvest: {
        consistency,
        completedFruits,
        growthTrend,
        taskCompletionRate,
        fairnessGuard,
        score,
        band: U.band(score)
      },
      mode
    };
  }

  function thirtyDayPromotionEngine(payload, mode) {
    const rootStrength = U.toNumber(payload.rootStrength, 0);
    const trunkGrowth = U.toNumber(payload.trunkGrowth, 0);
    const fruitCompletion = U.toNumber(payload.fruitCompletion, 0);
    const consistency = U.toNumber(payload.consistency, 0);
    const spamFlags = U.toNumber(payload.spamFlags, 0);

    const integrityPass = spamFlags <= 2;
    const merit = rootStrength * 0.3 + trunkGrowth * 0.3 + fruitCompletion * 0.2 + consistency * 0.2;
    const reasons = [];

    if (rootStrength < 60) reasons.push('Roots below promotion threshold (need stronger fundamentals).');
    if (trunkGrowth < 60) reasons.push('Trunk growth below threshold (needs deeper resilience).');
    if (fruitCompletion < 50) reasons.push('Fruit completion signal is low (ship more completed outputs).');
    if (consistency < 65) reasons.push('Water cycle inconsistent (daily consistency not stable).');
    if (!integrityPass) reasons.push('Integrity warning: anti-spam checks triggered.');

    let status = 'not eligible';
    if (integrityPass && merit >= 72 && reasons.length <= 1) status = 'eligible';
    else if (integrityPass && merit >= 62) status = 'nearly eligible';

    return {
      promotion: {
        status,
        merit: Math.round(merit),
        integrityPass,
        reasons: reasons.length ? reasons : ['Ready for next layer checkpoint.']
      },
      mode
    };
  }

  function fairRankingEngine(payload, mode) {
    const consistency = U.toNumber(payload.consistency, 50);
    const quality = U.toNumber(payload.quality, 50);
    const effortDepth = U.toNumber(payload.effortDepth, 50);
    const improvementTrend = U.toNumber(payload.improvementTrend, 50);
    const volume = U.toNumber(payload.volume, 0);

    const volumeCap = Math.min(volume, 12);
    const spamPenalty = volume > 16 ? (volume - 16) * 2 : 0;
    const score = U.clamp(Math.round(
      consistency * 0.28 +
      quality * 0.30 +
      effortDepth * 0.22 +
      improvementTrend * 0.15 +
      volumeCap * 0.5 -
      spamPenalty
    ), 0, 100);

    return {
      fairRank: {
        score,
        band: U.band(score),
        antiSpam: {
          volume,
          volumeCap,
          spamPenalty,
          payToWin: false,
          pureVolumeBias: false
        }
      },
      mode
    };
  }

  // defaults for Wave 1 tool forms
  const defaults = {
    playerSignup: {
      name: 'Aarav',
      archetype: 'steady-grower',
      orchardName: 'Aarav Orchard',
      focusBranch: 'ai-productivity'
    },
    orchardProfileBuilder: {
      playerName: 'Aarav',
      roots: 52,
      trunk: 46,
      branches: ['ai-productivity', 'research', 'communication'],
      leaves: 14,
      fruits: 3,
      seeds: 2,
      harvestHistory: [{ week: 1, score: 58 }]
    },
    starterFarmGenerator: {
      archetype: 'steady-grower',
      soilQuality: 62,
      sunlightExposure: 58,
      waterCycle: 65,
      focusBranch: 'ai-productivity'
    },
    rootStrengthCalculator: {
      completedPractice: 12,
      learningRepetition: 9,
      taskDifficulty: 58,
      consistency: 66
    },
    trunkGrowthCalculator: {
      challengeCompletion: 64,
      workDepth: 57,
      sustainedEffort: 70,
      recoveredSetbacks: 45
    },
    fruitYieldEngine: {
      artifactTitle: 'Weekly Research Note',
      quality: 72,
      completionState: 'done',
      effortDepth: 68
    },
    dailyQuestGenerator: {
      rootScore: 55,
      trunkScore: 49,
      recentFruits: 1
    },
    weeklyHarvestEngine: {
      consistency: 71,
      completedFruits: 4,
      growthTrend: 63,
      taskCompletionRate: 76
    },
    thirtyDayPromotionEngine: {
      rootStrength: 68,
      trunkGrowth: 64,
      fruitCompletion: 58,
      consistency: 70,
      spamFlags: 1
    },
    fairRankingEngine: {
      consistency: 73,
      quality: 69,
      effortDepth: 66,
      improvementTrend: 61,
      volume: 8
    }
  };

  // Backward-compatible generic functions from earlier scaffold
  const legacy = {
    player_signup: (m, p) => template('player-signup', m, { archetype: p.archetype || 'steady-grower', starterOrchard: p.orchard || 'orchard-alpha' }),
    orchard_profile_builder: (m) => template('orchard-profile-builder', m, { summary: 'Recruiter-readable orchard shell prepared.', sections: ['roots', 'trunk', 'branches', 'leaves', 'fruits', 'seeds'] }),
    starter_farm_generator: (m) => template('starter-farm-generator', m, { treeSlots: 3 + Math.floor(m.base / 40), minerals: 10 + Math.floor(m.depth / 20), soil: 50 + Math.floor(m.consistency / 4) }),
    root_strength_calculator: (m) => template('root-strength-calculator', m, { fundamentalsScore: Math.round((m.base * 0.6 + m.consistency * 0.4) * m.modifier) }),
    trunk_growth_calculator: (m) => template('trunk-growth-calculator', m, { depthResilience: Math.round((m.depth * 0.7 + m.consistency * 0.3) * m.modifier) }),
    fruit_yield_engine: (m, p) => template('fruit-yield-engine', m, { artifactCount: U.toNumber(p.artifacts, 2), fruitYield: Math.round((U.toNumber(p.artifacts, 2) * m.quality) / 20) }),
    daily_quest_generator: (m) => template('daily-quest-generator', m, { quests: ['water roots (fundamentals)', 'strengthen trunk (deep work)', 'ship one fruit (output)'] }),
    weekly_harvest_engine: (m) => template('weekly-harvest-engine', m, { harvestScore: Math.round((m.consistency * 0.35 + m.quality * 0.35 + m.depth * 0.3) * m.modifier) }),
    thirty_day_promotion_engine: (m) => template('thirty-day-promotion-engine', m, { promotionEligible: (m.consistency >= 65 && m.quality >= 60), reviewWindowDays: 30 }),
    fair_ranking_engine: (m, p) => template('fair-ranking-engine', m, { rankScore: Math.round(m.consistency * 0.28 + m.quality * 0.30 + m.depth * 0.2 + m.peer * 0.12 + (U.toNumber(p.improvement, 50) * 0.10)), antiVolumeBias: true })
  };

  global.EngineModels = {
    baseMetrics,
    defaults,
    playerSignup,
    orchardProfileBuilder,
    starterFarmGenerator,
    rootStrengthCalculator,
    trunkGrowthCalculator,
    fruitYieldEngine,
    dailyQuestGenerator,
    weeklyHarvestEngine,
    thirtyDayPromotionEngine,
    fairRankingEngine,
    ...legacy
  };
})(window);
