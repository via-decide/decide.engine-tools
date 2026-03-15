export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="orchard">
    <div class="w">
      <div class="sh">
        <h2>🌳 Orchard Engine — The Game</h2>
        <p>A 3-layer habit-building game disguised as a farming simulation. King-style daily loops, COC-style clan events, seasonal tournaments, and server bosses. Zero install. Pure browser.</p>
      </div>

      <!-- LAYER EXPLAINER -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:24px">
        <div style="background:var(--bg2);border:1px solid var(--border);border-top:3px solid var(--leaf);border-radius:var(--r);padding:16px">
          <div style="font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--leaf);margin-bottom:6px">Layer 1 · Days 1–30</div>
          <div style="font-weight:700;margin-bottom:6px">The Crucible</div>
          <div style="font-size:.82rem;color:var(--muted)">Solo swipe-card daily grind. Grow your roots. Survive the 30 days or reset the clock.</div>
        </div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-top:3px solid var(--gold);border-radius:var(--r);padding:16px">
          <div style="font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin-bottom:6px">Layer 2 · Day 30+</div>
          <div style="font-weight:700;margin-bottom:6px">The Commons</div>
          <div style="font-size:.82rem;color:var(--muted)">Package your stats into Seeds. Mentor new players. Join a Circle. Your roots become someone else's boost.</div>
        </div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-top:3px solid var(--water);border-radius:var(--r);padding:16px">
          <div style="font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--water);margin-bottom:6px">Layer 3 · Endgame</div>
          <div style="font-weight:700;margin-bottom:6px">The Market</div>
          <div style="font-size:.82rem;color:var(--muted)">Trade seeds, compete globally, specialise your build. Orchard Coins and Harvest Gems unlock here.</div>
        </div>
      </div>

      <!-- LIVE EVENTS ROW -->
      <div style="background:rgba(82,183,86,.06);border:1px solid rgba(82,183,86,.2);border-radius:var(--r);padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div style="font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--leaf)">⚡ Live Events</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span style="font-size:.8rem;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--border);color:var(--muted)">🌧️ Daily Weather</span>
          <span style="font-size:.8rem;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--border);color:var(--muted)">🏆 Weekly Harvest Race</span>
          <span style="font-size:.8rem;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--border);color:var(--muted)">🦠 Server Boss: The Blight</span>
          <span style="font-size:.8rem;padding:4px 10px;border-radius:999px;background:rgba(255,202,40,.1);border:1px solid rgba(255,202,40,.2);color:var(--gold)">⚡ Flash Events</span>
        </div>
      </div>

      <!-- GAME TOOLS GRID -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:11px" id="orchard-tools-grid">

        <!-- Growth Milestone Engine — THE MAIN GAME -->
        <a class="card" href="./tools/engine/growth-milestone-engine/index.html" style="border-color:rgba(82,183,86,.35);background:linear-gradient(135deg,rgba(82,183,86,.08),var(--bg2))">
          <div class="card-top"><span class="chip cat-engine" style="background:rgba(82,183,86,.15);color:var(--leaf)">🎮 Main Game</span><span class="card-icon">🌳</span></div>
          <h3>Growth Milestone Engine</h3>
          <p>The core 3D farming game. Grow from Seed to Elder Tree. Manage water, nutrients, pests. Three.js rendering.</p>
          <span class="card-link" style="color:var(--leaf)">Play Now</span>
        </a>

        <!-- Layer 1 Swipe — COMING -->
        <div class="card" style="opacity:.65;border-style:dashed">
          <div class="card-top"><span class="chip" style="background:rgba(255,202,40,.1);color:var(--gold);font-size:.69rem;font-weight:700;padding:3px 8px;border-radius:999px">In Dev</span><span class="card-icon">👆</span></div>
          <h3>Layer 1 — Swipe Crucible</h3>
          <p>Daily swipe-card sessions. Drag left/right to complete micro-tasks. 5–8 cards per session. Streak tracking.</p>
          <span style="font-size:.8rem;color:var(--muted)">Coming soon</span>
        </div>

        <!-- Season Engine — COMING -->
        <div class="card" style="opacity:.65;border-style:dashed">
          <div class="card-top"><span class="chip" style="background:rgba(255,202,40,.1);color:var(--gold);font-size:.69rem;font-weight:700;padding:3px 8px;border-radius:999px">In Dev</span><span class="card-icon">🗓️</span></div>
          <h3>Season Engine</h3>
          <p>30-day season track. Daily weather events. Season XP tiers. Monsoon → Summer → Harvest → Winter.</p>
          <span style="font-size:.8rem;color:var(--muted)">Coming soon</span>
        </div>

        <!-- Circle Manager — COMING -->
        <div class="card" style="opacity:.65;border-style:dashed">
          <div class="card-top"><span class="chip" style="background:rgba(255,202,40,.1);color:var(--gold);font-size:.69rem;font-weight:700;padding:3px 8px;border-radius:999px">In Dev</span><span class="card-icon">⭕</span></div>
          <h3>Circle Manager</h3>
          <p>COC-style clan system. 5–8 farmers per circle. Weekly harvest race. Pest Siege events. Seed Library.</p>
          <span style="font-size:.8rem;color:var(--muted)">Coming soon</span>
        </div>

        <!-- Reward Wallet — COMING -->
        <div class="card" style="opacity:.65;border-style:dashed">
          <div class="card-top"><span class="chip" style="background:rgba(255,202,40,.1);color:var(--gold);font-size:.69rem;font-weight:700;padding:3px 8px;border-radius:999px">In Dev</span><span class="card-icon">💰</span></div>
          <h3>Reward Wallet</h3>
          <p>Three currencies: 🌊 Water Drops, 🌰 Orchard Coins, 💎 Harvest Gems. Earned through play, never bought.</p>
          <span style="font-size:.8rem;color:var(--muted)">Coming soon</span>
        </div>

        <!-- Server Tournament — COMING -->
        <div class="card" style="opacity:.65;border-style:dashed">
          <div class="card-top"><span class="chip" style="background:rgba(255,202,40,.1);color:var(--gold);font-size:.69rem;font-weight:700;padding:3px 8px;border-radius:999px">In Dev</span><span class="card-icon">🏆</span></div>
          <h3>Server Tournament</h3>
          <p>Global 24h leaderboards. Harvest Race, Root Challenge, Water Trial. Top 100 win Harvest Gems.</p>
          <span style="font-size:.8rem;color:var(--muted)">Coming soon</span>
        </div>

        <!-- Server Boss — COMING -->
        <div class="card" style="opacity:.65;border-style:dashed">
          <div class="card-top"><span class="chip" style="background:rgba(255,202,40,.1);color:var(--gold);font-size:.69rem;font-weight:700;padding:3px 8px;border-radius:999px">In Dev</span><span class="card-icon">🦠</span></div>
          <h3>Server Boss</h3>
          <p>Community collective challenges. The Blight (50K pests), The Locust King (100K HP). Everyone fights together.</p>
          <span style="font-size:.8rem;color:var(--muted)">Coming soon</span>
        </div>

        <!-- Skin Engine — COMING -->
        <div class="card" style="opacity:.65;border-style:dashed">
          <div class="card-top"><span class="chip" style="background:rgba(255,202,40,.1);color:var(--gold);font-size:.69rem;font-weight:700;padding:3px 8px;border-radius:999px">In Dev</span><span class="card-icon">🎨</span></div>
          <h3>Skin Engine</h3>
          <p>Switch themes: Farming (default), Space Colony, Dojo, Chef's Kitchen, Ancient Library, Street Food Cart.</p>
          <span style="font-size:.8rem;color:var(--muted)">Coming soon</span>
        </div>

      </div>
    </div>
  </section>`);
}
