/**
 * DSA advisory data-model references.
 * Pure constants and helpers; no runtime side effects.
 */
(function (global) {
  'use strict';

  const SIZE_CATEGORIES = ['tiny', 'small', 'medium', 'large', 'huge'];
  const CONFIDENCE = ['high', 'medium', 'low'];

  const COMPLEXITY_BY_SIZE = {
    tiny: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)', 'O(n!)'],
    small: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
    medium: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'],
    large: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    huge: ['O(1)', 'O(log n)', 'O(n)']
  };

  const DsaTypes = { SIZE_CATEGORIES, CONFIDENCE, COMPLEXITY_BY_SIZE };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DsaTypes;
  }
  if (global) {
    global.DsaTypes = DsaTypes;
  }
})(typeof window !== 'undefined' ? window : globalThis);
