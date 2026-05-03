/* eslint-disable no-console */
(function () {
  'use strict';

  let engine;
  try {
    engine = require('./dsa-decision-engine');
  } catch (_error) {
    engine = (typeof window !== 'undefined' && window.DsaDecisionEngine) || null;
  }

  if (!engine) {
    throw new Error('DsaDecisionEngine unavailable. Load dsa-decision-engine.js first.');
  }

  const samples = [
    { n: 100000, sorted: true, queries: 1, graph: { exists: false, weighted: false }, tree: false, needTopK: false, needAll: false, needOptimization: false },
    { n: 5000, sorted: false, queries: 1, graph: { exists: true, weighted: false }, tree: false, needTopK: false, needAll: false, needOptimization: false },
    { n: 3000, sorted: false, queries: 1, graph: { exists: true, weighted: true }, tree: false, needTopK: false, needAll: false, needOptimization: false },
    { n: 80, sorted: false, queries: 250, graph: { exists: false, weighted: false }, tree: false, needTopK: false, needAll: false, needOptimization: false },
    { n: 12, sorted: false, queries: 1, graph: { exists: false, weighted: false }, tree: false, needTopK: false, needAll: true, needOptimization: false },
    { n: 2000, sorted: false, queries: 1, graph: { exists: false, weighted: false }, tree: false, needTopK: false, needAll: false, needOptimization: true }
  ];

  samples.forEach((input, idx) => {
    const profile = engine.classifyConstraints(input);
    const decision = engine.suggestAlgorithms(input);

    console.log(`\n[Test ${idx + 1}] input:`);
    console.log(input);
    console.log('constraint profile:');
    console.log(profile);
    console.log('decision:');
    console.log(decision);
    console.log('reasoning trace:');
    decision.reasoning.forEach((line, i) => console.log(`  ${i + 1}. ${line}`));
  });
})();
