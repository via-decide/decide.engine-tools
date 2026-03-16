(() => {
  const POOL = [
    { type: 'water', prompt: 'Absorb the rain', xp: 12 },
    { type: 'pest', prompt: 'Clear the aphids', xp: 14 },
    { type: 'logic', prompt: 'Plan tomorrow\'s task', xp: 10 },
    { type: 'rest', prompt: 'Recovery day', xp: 8 }
  ];

  let session = null;

  function pickCards() {
    const size = 6;
    const cards = [];
    for (let i = 0; i < size; i += 1) {
      const card = POOL[Math.floor(Math.random() * POOL.length)];
      cards.push({ ...card, id: `${card.type}-${Date.now()}-${i}` });
    }
    return cards;
  }

  function startSession() {
    session = { cards: pickCards(), cursor: 0, xpEarned: 0, streak: 1, completed: false };
    return session;
  }

  function swipeCard(direction) {
    if (!session || session.completed) return null;
    const card = session.cards[session.cursor];
    if (!card) return null;
    if (direction === 'right') session.xpEarned += card.xp;
    session.cursor += 1;
    if (session.cursor >= session.cards.length) {
      session.completed = true;
      window.dispatchEvent(new CustomEvent('swipe:session_completed', { detail: { xpEarned: session.xpEarned, streak: session.streak } }));
    }
    return { ...session };
  }

  window.SwipeEngine = { startSession, swipeCard };
})();
