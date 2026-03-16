(function renderGamesSections() {
  'use strict';

  const ui = window.UISections;
  const gamesRoot = document.getElementById('games-root');
  const marsRoot = document.getElementById('mars-root');
  if (!ui || !gamesRoot || !marsRoot) return;

  gamesRoot.innerHTML = `
    <div class="sh">
      <h2>🎮 Games</h2>
      <p>Browser games that are also learning tools. No install, no account — just play.</p>
    </div>
    <div class="featured-row">
      ${ui.featuredCard({
        variantClass: 'feat-card-violet',
        chipClass: 'chip-violet',
        badge: '🎯 Strategy + Quiz',
        title: 'HexWars',
        description: 'Conquer hex territories with your knowledge. Answer timed quiz questions to claim tiles and dominate the battlefield. Strategy meets trivia.',
        buttonClass: 'btn-violet',
        cta: { href: './tools/games/hex-wars/index.html', label: '⬡ Play HexWars' }
      })}
      ${ui.featuredCard({
        variantClass: 'feat-card-orange',
        chipClass: 'chip-orange',
        badge: '🔥 Multiplayer Quiz',
        title: 'Wings of Fire Quiz',
        description: "Multiplayer quiz on Dr. APJ Abdul Kalam's Wings of Fire. Test your knowledge, compete with friends, and learn from the life of India's Missile Man.",
        buttonClass: 'btn-orange',
        cta: { href: './tools/games/wings-of-fire-quiz/index.html', label: '🔥 Play Quiz' }
      })}
    </div>
  `;

  marsRoot.innerHTML = `
    <div class="sh">
      <h2>🚀 Mars Decision Lab</h2>
      <p>A browser game where you pilot a rover across Mars — manage energy, scan terrain, survive dust storms, and make real decisions under pressure.</p>
    </div>
    <div class="mars-hero">
      <div class="mars-left">
        <div class="mars-badge">🎮 Live Game</div>
        <div class="mars-title">Mars Decision Lab</div>
        <div class="mars-desc">React-powered Mars rover simulation. Explore terrains, complete missions, manage resources, earn certifications. Built for strategic thinkers.</div>
        <div class="mars-pills">
          <span class="mpill">⚡ Energy Management</span>
          <span class="mpill">🌪️ Storm Survival</span>
          <span class="mpill">🗺️ Terrain Scanning</span>
          <span class="mpill">🎯 Mission Objectives</span>
        </div>
        <div class="btn-row mars-link-wrap">
          <a class="btn btn-mars" href="https://via-decide.github.io/mars-decision-lab/" target="_blank" rel="noopener">Launch Game →</a>
        </div>
      </div>
      <div class="mars-visual">
        <div class="mars-planet"></div>
      </div>
    </div>
  `;
})();
