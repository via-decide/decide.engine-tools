(function renderOrchardSection() {
  'use strict';

  const root = document.getElementById('orchard-root');
  const ui = window.UISections;
  if (!root || !ui) return;

  const layerCards = [
    {
      color: 'var(--leaf)',
      label: 'Layer 1 · Days 1–30',
      title: 'The Crucible',
      desc: 'Solo swipe-card daily grind. Grow your roots. Survive the 30 days or reset the clock.'
    },
    {
      color: 'var(--gold)',
      label: 'Layer 2 · Day 30+',
      title: 'The Commons',
      desc: "Package your stats into Seeds. Mentor new players. Join a Circle. Your roots become someone else's boost."
    },
    {
      color: 'var(--water)',
      label: 'Layer 3 · Endgame',
      title: 'The Market',
      desc: 'Trade seeds, compete globally, specialise your build. Orchard Coins and Harvest Gems unlock here.'
    }
  ];

  const inDevCard = (icon, title, description) => ui.orchardToolCard({
    chip: 'In Dev',
    chipClass: 'chip-in-dev',
    icon,
    title,
    description,
    footerText: 'Coming soon',
    footerClass: 'coming-soon-label',
    cardClass: 'card-coming-soon'
  });

  root.innerHTML = `
    <div class="sh">
      <h2>🌳 Orchard Engine — The Game</h2>
      <p>A 3-layer habit-building game disguised as a farming simulation. King-style daily loops, COC-style clan events, seasonal tournaments, and server bosses. Zero install. Pure browser.</p>
    </div>

    <div class="ui-grid-auto ui-mb-24">
      ${layerCards.map(layer => `
        <div class="orchard-layer-card" style="--layer-color:${layer.color}">
          <div class="orchard-layer-label">${layer.label}</div>
          <div class="orchard-layer-title">${layer.title}</div>
          <div class="orchard-layer-desc">${layer.desc}</div>
        </div>
      `).join('')}
    </div>

    <div class="live-events-row ui-mb-20">
      <div class="live-events-title">⚡ Live Events</div>
      <div class="pill-row">
        <span class="event-pill">🌧️ Daily Weather</span>
        <span class="event-pill">🏆 Weekly Harvest Race</span>
        <span class="event-pill">🦠 Server Boss: The Blight</span>
        <span class="event-pill event-pill-highlight">⚡ Flash Events</span>
      </div>
    </div>

    <div class="ui-grid-fill" id="orchard-tools-grid">
      ${ui.orchardToolCard({
        href: './tools/engine/growth-milestone-engine/index.html',
        chip: '🎮 Main Game',
        chipClass: 'chip-main-game',
        icon: '🌳',
        title: 'Growth Milestone Engine',
        description: 'The core 3D farming game. Grow from Seed to Elder Tree. Manage water, nutrients, pests. Three.js rendering.',
        footerText: 'Play Now',
        cardClass: 'card-main-game'
      })}
      ${inDevCard('👆', 'Layer 1 — Swipe Crucible', 'Daily swipe card game loop inspired by retention games. Win streaks, lose streaks, comeback mechanics.')}
      ${inDevCard('⭕', 'Circle Manager', 'COC-style clan system. 5–8 farmers per circle. Weekly harvest race. Pest Siege events. Seed Library.')}
      ${inDevCard('💰', 'Reward Wallet', 'Three currencies: 🌊 Water Drops, 🌰 Orchard Coins, 💎 Harvest Gems. Earned through play, never bought.')}
      ${inDevCard('🏆', 'Server Tournament', 'Global 24h leaderboards. Harvest Race, Root Challenge, Water Trial. Top 100 win Harvest Gems.')}
      ${inDevCard('🦠', 'Server Boss', 'Community collective challenges. The Blight (50K pests), The Locust King (100K HP). Everyone fights together.')}
      ${inDevCard('🎨', 'Skin Engine', "Switch themes: Farming (default), Space Colony, Dojo, Chef's Kitchen, Ancient Library, Street Food Cart.")}
    </div>
  `;
})();
