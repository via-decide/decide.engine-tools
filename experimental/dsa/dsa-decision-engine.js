/**
 * Non-intrusive DSA Decision Engine (advisory only).
 * Isolation guarantees:
 * - no imports from core/runtime/agent systems
 * - pure functions
 * - no writes to global mutable state
 */
(function (global) {
  'use strict';

  const DEFAULT_COMPLEXITIES = {
    tiny: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)', 'O(n!)'],
    small: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
    medium: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'],
    large: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    huge: ['O(1)', 'O(log n)', 'O(n)']
  };

  function normalizeInput(input) {
    const safe = input && typeof input === 'object' ? input : {};
    const graph = safe.graph && typeof safe.graph === 'object' ? safe.graph : {};
    return {
      n: Number.isFinite(Number(safe.n)) ? Number(safe.n) : 0,
      sorted: Boolean(safe.sorted),
      queries: Number.isFinite(Number(safe.queries)) ? Number(safe.queries) : 0,
      graph: {
        exists: Boolean(graph.exists),
        weighted: Boolean(graph.weighted)
      },
      tree: Boolean(safe.tree),
      needTopK: Boolean(safe.needTopK),
      needAll: Boolean(safe.needAll),
      needOptimization: Boolean(safe.needOptimization)
    };
  }

  function sizeCategoryForN(n) {
    if (n <= 10) return 'tiny';
    if (n <= 100) return 'small';
    if (n <= 10000) return 'medium';
    if (n <= 1000000) return 'large';
    return 'huge';
  }

  function classifyConstraints(input) {
    const data = normalizeInput(input);
    const sizeCategory = sizeCategoryForN(data.n);
    const allowedComplexity = DEFAULT_COMPLEXITIES[sizeCategory].slice();
    return { sizeCategory, allowedComplexity };
  }

  function decision(algorithm, complexity, confidence, reasoning) {
    return { algorithm, complexity, confidence, reasoning };
  }

  function suggestAlgorithms(input) {
    const data = normalizeInput(input);
    const profile = classifyConstraints(data);
    const reasons = [
      `Input size n=${data.n} classified as ${profile.sizeCategory}.`,
      `Allowed complexity classes: ${profile.allowedComplexity.join(', ')}.`
    ];

    if (data.sorted) {
      reasons.push('Data is sorted, enabling logarithmic lookup strategy.');
      return decision('Binary Search', 'O(log n)', 'high', reasons);
    }

    if (data.graph.exists) {
      if (data.graph.weighted) {
        reasons.push('Weighted graph detected, shortest-path advisory favors Dijkstra.');
        return decision('Dijkstra', 'O((V + E) log V)', 'high', reasons);
      }
      reasons.push('Unweighted graph detected, traversal advisory favors BFS.');
      return decision('Breadth-First Search (BFS)', 'O(V + E)', 'high', reasons);
    }

    if (data.tree) {
      reasons.push('Tree structure detected, traversal advisory favors DFS.');
      return decision('Depth-First Search (DFS)', 'O(n)', 'high', reasons);
    }

    if (data.queries > 1) {
      reasons.push(`Multiple queries detected (${data.queries}), preprocessing with prefix sums is beneficial.`);
      return decision('Prefix Sum', 'O(n) build, O(1) query', 'high', reasons);
    }

    if (data.needAll) {
      if (profile.sizeCategory === 'tiny' || profile.sizeCategory === 'small') {
        reasons.push('Need to enumerate all solutions and size is small enough for backtracking.');
        return decision('Backtracking', 'O(2^n) or O(n!)', 'medium', reasons);
      }
      reasons.push('Need all solutions but input is beyond small; full backtracking may be infeasible.');
      return decision('Pruned Search / Heuristic Enumeration', 'Problem-dependent', 'low', reasons);
    }

    if (data.needOptimization) {
      reasons.push('Optimization objective detected, dynamic programming is a strong candidate.');
      return decision('Dynamic Programming', 'O(n) to O(n^2)', 'medium', reasons);
    }

    if (data.needTopK) {
      reasons.push('Top-K requirement detected, heap-based selection is appropriate.');
      return decision('Heap (Top-K)', 'O(n log k)', 'medium', reasons);
    }

    reasons.push('No dominant pattern detected; linear scan is safest default advisory.');
    return decision('Linear Scan', 'O(n)', 'low', reasons);
  }

  function analyzeProblem(input) {
    const normalized = normalizeInput(input);
    return {
      input: normalized,
      constraintProfile: classifyConstraints(normalized),
      decision: suggestAlgorithms(normalized)
    };
  }

  const DsaDecisionEngine = { analyzeProblem, classifyConstraints, suggestAlgorithms };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DsaDecisionEngine;
  }
  if (global) {
    global.DsaDecisionEngine = DsaDecisionEngine;
  }
})(typeof window !== 'undefined' ? window : globalThis);
