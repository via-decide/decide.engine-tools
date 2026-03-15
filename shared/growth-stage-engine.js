(() => {
  const STORAGE_KEY = 'orchard.growth-stage.v1';
  const STAGES = [
    { id: 0, name: 'Dormant Seed', xp: 0 },
    { id: 1, name: 'Sprout', xp: 120 },
    { id: 2, name: 'Sapling', xp: 300 },
    { id: 3, name: 'Young Tree', xp: 640 },
    { id: 4, name: 'Elder Tree', xp: 1200 }
  ];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { xp: 0, stageId: 0, water: 70, nutrients: 80, pests: 0, lastTickAt: Date.now() };
      return { xp: 0, stageId: 0, water: 70, nutrients: 80, pests: 0, lastTickAt: Date.now(), ...JSON.parse(raw) };
    } catch (_error) {
      return { xp: 0, stageId: 0, water: 70, nutrients: 80, pests: 0, lastTickAt: Date.now() };
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function stageForXP(xp) {
    let stage = STAGES[0];
    STAGES.forEach((candidate) => {
      if (xp >= candidate.xp) stage = candidate;
    });
    return stage;
  }

  const state = load();

  function syncStage() {
    const prev = state.stageId;
    const stage = stageForXP(state.xp);
    state.stageId = stage.id;
    if (prev !== stage.id) {
      window.dispatchEvent(new CustomEvent('growth:stage_evolved', { detail: { stage } }));
    }
    return stage;
  }

  function clampResources() {
    state.water = Math.max(0, Math.min(100, state.water));
    state.nutrients = Math.max(0, Math.min(100, state.nutrients));
    state.pests = Math.max(0, Math.min(5, state.pests));
  }

  function applyTick() {
    const now = Date.now();
    const elapsedDays = Math.max(1, Math.floor((now - state.lastTickAt) / 86400000) || 1);
    state.water -= elapsedDays * 2;
    state.nutrients -= elapsedDays;
    if (Math.random() < 0.15) state.pests += 1;
    state.lastTickAt = now;
    clampResources();
    const stage = syncStage();
    save(state);
    return { water: state.water, nutrients: state.nutrients, pests: state.pests, stage };
  }

  function addXP(amount = 0) {
    state.xp += Math.max(0, Number(amount) || 0);
    const stage = syncStage();
    save(state);
    return { xp: state.xp, stage };
  }

  function waterPlant(amount = 0) {
    state.water += Math.max(0, Number(amount) || 0);
    clampResources();
    save(state);
    return state.water;
  }

  function getState() {
    return { ...state, stage: STAGES[state.stageId] };
  }

  window.GrowthStageEngine = { applyTick, addXP, waterPlant, getState };
})();
