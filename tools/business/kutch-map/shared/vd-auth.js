/**
 * vd-auth.js
 * Centralized Firebase Auth for decide.engine-tools
 * Orchade Pattern: Unified session across all tools.
 */

window._VD_AUTH = (() => {
  let currentUser = null;
  let isReady = false;
  const readyCallbacks = [];

  // SDKs are expected to be loaded in index.html (root)
  // window.firebase is the compat SDK (v9+)
  
  function init() {
    if (!window.firebase) {
      console.warn("VD Auth: Firebase SDK not found. Waiting...");
      setTimeout(init, 500);
      return;
    }

    const auth = firebase.auth();
    
    auth.onAuthStateChanged((user) => {
      currentUser = user;
      isReady = true;
      console.log("VD Auth: State changed", user ? user.uid : "Signed out");
      
      // Trigger callbacks
      readyCallbacks.forEach(cb => cb(user));
      readyCallbacks.length = 0;
    });
  }

  return {
    init,
    login: async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebase.auth().signInWithPopup(provider);
      } catch (err) {
        console.error("VD Auth: Login failed", err);
        alert("Login failed: " + err.message);
      }
    },
    logout: () => firebase.auth().signOut(),
    getUser: () => currentUser,
    getUID: () => currentUser ? currentUser.uid : 'anonymous',
    onReady: (cb) => {
      if (isReady) cb(currentUser);
      else readyCallbacks.push(cb);
    }
  };
})();

// Auto-init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => _VD_AUTH.init());
} else {
  _VD_AUTH.init();
}
