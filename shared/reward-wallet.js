(() => {
  const STORAGE_KEY = 'orchard.reward-wallet.v1';

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { drops: 120, coins: 0, gems: 0 };
      return { drops: 120, coins: 0, gems: 0, ...JSON.parse(raw) };
    } catch (_error) {
      return { drops: 120, coins: 0, gems: 0 };
    }
  }

  const state = load();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function earn(currency, amount = 0, reason = 'unknown') {
    const key = currency || 'drops';
    state[key] = (state[key] || 0) + Math.max(0, Number(amount) || 0);
    save();
    window.dispatchEvent(new CustomEvent('wallet:earned', { detail: { currency: key, amount, reason, total: state[key] } }));
    return state[key];
  }

  function spend(currency, amount = 0, reason = 'unknown') {
    const key = currency || 'drops';
    const need = Math.max(0, Number(amount) || 0);
    const have = state[key] || 0;
    if (have < need) {
      window.dispatchEvent(new CustomEvent('wallet:insufficient', { detail: { currency: key, needed: need, have } }));
      return false;
    }
    state[key] = have - need;
    save();
    window.dispatchEvent(new CustomEvent('wallet:spent', { detail: { currency: key, amount: need, reason, total: state[key] } }));
    return true;
  }

  function getBalances() { return { ...state }; }

  window.RewardWallet = { earn, spend, getBalances };
})();
