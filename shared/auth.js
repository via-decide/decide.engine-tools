/**
 * ViaDecide Auth Module
 * Firebase Google Sign-In — browser-native, no build step
 * Loads Firebase SDK from CDN, provides sign-in/out + state listener
 */

const ViaAuth = (() => {
  let _user = null;
  let _ready = false;
  let _listeners = [];
  let _auth = null;
  let _provider = null;

  // Firebase config (client-side, safe to expose per Firebase docs)
  const CONFIG = {
    apiKey: "AIzaSyB4ues4tuPmT_BVqTr_gzUQ5m0TPbLB5H4",
    authDomain: "gen-lang-client-0530513864.firebaseapp.com",
    projectId: "gen-lang-client-0530513864",
    storageBucket: "gen-lang-client-0530513864.firebasestorage.app",
    messagingSenderId: "170638178498",
    appId: "1:170638178498:web:e05f99948bba4fa72bfefb"
  };

  // Load a script tag dynamically
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Initialize Firebase + Auth
  async function init() {
    if (_auth) return;
    try {
      // Load Firebase SDK from CDN (compat mode for browser-native use)
      await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js');

      // Initialize app if not already
      if (!firebase.apps.length) {
        firebase.initializeApp(CONFIG);
      }

      _auth = firebase.auth();
      _provider = new firebase.auth.GoogleAuthProvider();
      _provider.addScope('email');
      _provider.addScope('profile');

      // Listen for auth state changes
      _auth.onAuthStateChanged((user) => {
        _user = user ? {
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email || '',
          photoURL: user.photoURL || '',
          emailVerified: user.emailVerified
        } : null;
        _ready = true;
        _notify();
      });
    } catch (err) {
      console.error('[ViaAuth] Init failed:', err);
      _ready = true;
      _notify();
    }
  }

  // Notify all listeners
  function _notify() {
    _listeners.forEach(fn => {
      try { fn(_user); } catch(e) { console.error('[ViaAuth] Listener error:', e); }
    });
  }

  // Public API
  return {
    /** Initialize auth system — call once on page load */
    init,

    /** Sign in with Google popup */
    async signIn() {
      if (!_auth) await init();
      try {
        const result = await _auth.signInWithPopup(_provider);
        return result.user;
      } catch (err) {
        if (err.code === 'auth/popup-closed-by-user') return null;
        console.error('[ViaAuth] Sign-in error:', err);
        throw err;
      }
    },

    /** Sign out */
    async signOut() {
      if (!_auth) return;
      try {
        await _auth.signOut();
      } catch (err) {
        console.error('[ViaAuth] Sign-out error:', err);
      }
    },

    /** Get current user (null if not signed in) */
    get user() { return _user; },

    /** Whether auth has finished initializing */
    get ready() { return _ready; },

    /** Subscribe to auth state changes: fn(user | null) */
    onAuthChange(fn) {
      _listeners.push(fn);
      // If already ready, fire immediately
      if (_ready) fn(_user);
      return () => { _listeners = _listeners.filter(l => l !== fn); };
    }
  };
})();

// Auto-export for module and global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ViaAuth;
}
