(() => {
  const STORAGE_KEY = 'orchard.circle-manager.v1';

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { circles: [] };
      return { circles: [], ...JSON.parse(raw) };
    } catch (_error) {
      return { circles: [] };
    }
  }

  const state = load();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function listCircles() {
    return [...state.circles];
  }

  function createCircle(name) {
    const circle = { id: `circle-${Date.now()}`, name, members: [] };
    state.circles.push(circle);
    save();
    return circle;
  }

  window.CircleManager = { listCircles, createCircle };
})();
