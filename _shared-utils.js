/* ─────────────────────────────────────────────────────────────
   SHARED JAVASCRIPT UTILITIES EXTRACTED FROM PRODUCTION TOOLS
   Source: viadecide-reality-check.html, viadecide-decision-matrix.html, viadecide-opportunity-radar.html
   ───────────────────────────────────────────────────────────── */

'use strict';

/* ── STORAGE UTILITIES ──────────────────────────────────── */

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} data - Data to store (will be JSON stringified)
 * @returns {boolean} - Success status
 */
function saveState(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn(`Failed to save state for key "${key}":`, e);
    return false;
  }
}

/**
 * Load data from localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Stored data or default value
 */
function loadState(key, defaultValue = null) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.warn(`Failed to load state for key "${key}":`, e);
    return defaultValue;
  }
}

/**
 * Clear localStorage entry
 * @param {string} key - Storage key to clear
 */
function clearState(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Failed to clear state for key "${key}":`, e);
  }
}

/* ── DOM UTILITIES ──────────────────────────────────────– */

/**
 * Get element by ID (shorthand)
 * @param {string} id - Element ID
 * @returns {Element|null} - Element or null
 */
function el(id) {
  return document.getElementById(id);
}

/**
 * Get element value (handles inputs, textareas, selects)
 * @param {string|Element} target - Element ID or element
 * @returns {string} - Trimmed value
 */
function val(target) {
  const elem = typeof target === 'string' ? el(target) : target;
  return (elem?.value || '').trim();
}

/**
 * Set element text content
 * @param {string|Element} target - Element ID or element
 * @param {string} text - Text to set
 */
function setText(target, text) {
  const elem = typeof target === 'string' ? el(target) : target;
  if (elem) elem.textContent = text;
}

/**
 * Toggle class on element
 * @param {string|Element} target - Element ID or element
 * @param {string} className - Class name to toggle
 */
function toggleClass(target, className) {
  const elem = typeof target === 'string' ? el(target) : target;
  if (elem) elem.classList.toggle(className);
}

/**
 * Add class to element
 * @param {string|Element} target - Element ID or element
 * @param {string} className - Class name to add
 */
function addClass(target, className) {
  const elem = typeof target === 'string' ? el(target) : target;
  if (elem) elem.classList.add(className);
}

/**
 * Remove class from element
 * @param {string|Element} target - Element ID or element
 * @param {string} className - Class name to remove
 */
function removeClass(target, className) {
  const elem = typeof target === 'string' ? el(target) : target;
  if (elem) elem.classList.remove(className);
}

/**
 * Show/hide element
 * @param {string|Element} target - Element ID or element
 * @param {boolean} show - Show or hide
 */
function setVisible(target, show = true) {
  const elem = typeof target === 'string' ? el(target) : target;
  if (elem) elem.style.display = show ? '' : 'none';
}

/* ── VALIDATION UTILITIES ───────────────────────────────── */

/**
 * Validate string against pattern
 * @param {string} value - Value to validate
 * @param {RegExp|string} pattern - Regex pattern or test string
 * @returns {boolean} - Validation result
 */
function validateInput(value, pattern) {
  if (!value) return false;
  if (pattern instanceof RegExp) return pattern.test(value.toLowerCase());
  return value.toLowerCase().includes(pattern);
}

/**
 * Check if value is empty
 * @param {any} value - Value to check
 * @returns {boolean} - True if empty
 */
function isEmpty(value) {
  return !value || (typeof value === 'string' && value.trim() === '');
}

/**
 * Sanitize HTML (escape special characters)
 * @param {string} str - String to escape
 * @returns {string} - Escaped string safe for HTML
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── KEYBOARD & INTERACTION UTILITIES ────────────────────── */

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} event - Keyboard event
 * @param {Object} handlers - Key handlers { 'Enter': function, 'Escape': function }
 */
function onKeyboard(event, handlers) {
  const handler = handlers[event.key];
  if (handler) {
    event.preventDefault();
    handler(event);
  }
}

/**
 * Enable Enter key on focusable element
 * @param {Element} element - Element to listen on
 * @param {Function} callback - Callback function
 */
function onEnter(element, callback) {
  element?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback(e);
    }
  });
}

/**
 * Enable Escape key to blur element
 * @param {Element} element - Element to listen on
 */
function onEscape(element) {
  element?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.target.blur();
    }
  });
}

/**
 * Add Enter/Space activation for buttons
 * @param {Element} element - Button element
 */
function enableButtonActivation(element) {
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === element) {
      e.preventDefault();
      element.click();
    }
  });
}

/* ── NOTIFICATION UTILITIES ──────────────────────────────── */

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} icon - Icon/emoji to display
 * @param {number} duration - Duration in ms (default 2600)
 */
function toast(message, icon = '', duration = 2600) {
  const toastLayer = el('toastLayer') || createToastLayer();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = (icon ? icon + '  ' : '') + message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toastLayer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

/**
 * Create toast layer if it doesn't exist
 * @returns {Element} - Toast layer element
 */
function createToastLayer() {
  const layer = document.createElement('div');
  layer.id = 'toastLayer';
  layer.className = 'toast-layer';
  document.body.appendChild(layer);
  return layer;
}

/* ── ANIMATION UTILITIES ────────────────────────────────── */

/**
 * Fade in element
 * @param {Element} element - Element to fade in
 * @param {number} duration - Duration in ms
 */
function fadeIn(element, duration = 300) {
  element.style.animation = `fadeIn ${duration}ms ease-in`;
}

/**
 * Fade out element
 * @param {Element} element - Element to fade out
 * @param {number} duration - Duration in ms
 */
function fadeOut(element, duration = 300) {
  element.style.animation = `fadeOut ${duration}ms ease-out`;
}

/**
 * Add pulse animation
 * @param {Element} element - Element to pulse
 */
function pulse(element) {
  element.style.animation = 'pulse 1s ease-in-out';
}

/* ── EXPORT UTILITIES ───────────────────────────────────── */

/**
 * Export data as JSON file
 * @param {any} data - Data to export
 * @param {string} filename - Filename
 */
function exportJSON(data, filename = 'export.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export data as text file
 * @param {string} text - Text to export
 * @param {string} filename - Filename
 */
function exportText(text, filename = 'export.txt') {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── UTILITY INITIALIZATION ────────────────────────────── */

/**
 * Initialize touch/mouse detection for proper focus handling
 */
function initTouchMouseDetection() {
  let touch = false;
  document.addEventListener('touchstart', () => { touch = true; }, { passive: true });
  document.addEventListener('mousedown', () => { touch = false; }, { passive: true });
  document.addEventListener('focusin', (e) => {
    if (!touch && e.target?.classList) {
      e.target.classList.add('focus-visible-active');
    }
  });
  document.addEventListener('focusout', (e) => {
    if (e.target?.classList) {
      e.target.classList.remove('focus-visible-active');
    }
  });
}

/* ── ARRAY & OBJECT UTILITIES ───────────────────────────── */

/**
 * Shuffle array
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled copy
 */
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ── TIME UTILITIES ────────────────────────────────────── */

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} - Throttled function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ── MODULE INITIALIZATION ──────────────────────────────── */

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTouchMouseDetection);
} else {
  initTouchMouseDetection();
}
