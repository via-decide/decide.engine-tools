import { createFeaturedCard } from '../components/featured-card.js';
import { createSectionHeader } from '../components/section-header.js';

export function renderGamesSection() {
  const featured = `<div class="featured-row">
    ${createFeaturedCard({
      chip: '🎯 Strategy + Quiz',
      chipStyle: 'background:rgba(139,92,246,.15);color:#a78bfa',
      title: 'HexWars',
      description: 'Conquer hex territories with your knowledge. Answer timed quiz questions to claim tiles and dominate the battlefield. Strategy meets trivia.',
      cardStyle: 'border-color:rgba(139,92,246,.3);background:linear-gradient(135deg,rgba(139,92,246,.1),rgba(26,22,20,.97))',
      links: [{ href: './tools/games/hex-wars/index.html', label: '⬡ Play HexWars', style: 'background:#7c3aed;color:#fff;box-shadow:0 4px 0 #4c1d95' }]
    })}

    ${createFeaturedCard({
      chip: '🔥 Multiplayer Quiz',
      chipStyle: 'background:rgba(251,146,60,.15);color:#fb923c',
      title: 'Wings of Fire Quiz',
      description: "Multiplayer quiz on Dr. APJ Abdul Kalam's Wings of Fire. Test your knowledge, compete with friends, and learn from the life of India's Missile Man.",
      cardStyle: 'border-color:rgba(251,146,60,.3);background:linear-gradient(135deg,rgba(251,146,60,.1),rgba(26,22,20,.97))',
      links: [{ href: './tools/games/wings-of-fire-quiz/index.html', label: '🔥 Play Quiz', style: 'background:#ea580c;color:#fff;box-shadow:0 4px 0 #7c2d12' }]
    })}

    ${createFeaturedCard({
      chip: '🌌 Sci-Fi Strategy',
      chipStyle: 'background:rgba(14,165,233,.15);color:#38bdf8',
      title: 'SkillHex Mission Control',
      description: 'A mission control dashboard interface. Complete tasks, deploy squads, and earn experience points in a stunning sci-fi environment.',
      cardStyle: 'border-color:rgba(14,165,233,.3);background:linear-gradient(135deg,rgba(14,165,233,.1),rgba(26,22,20,.97))',
      links: [{ href: './tools/games/skillhex-mission-control/index.html', label: '🛸 Launch Control', style: 'background:#0284c7;color:#fff;box-shadow:0 4px 0 #075985' }]
    })}

    ${createFeaturedCard({
      chip: '🐍 Classic Arcade',
      chipStyle: 'background:rgba(34,197,94,.15);color:#4ade80',
      title: 'Decision Snake',
      description: 'Classic snake gameplay tuned for fast decision-making. Survive longer, chain clean moves, and beat your best score.',
      cardStyle: 'border-color:rgba(34,197,94,.3);background:linear-gradient(135deg,rgba(34,197,94,.1),rgba(26,22,20,.97))',
      links: [{ href: './tools/games/snake-game/index.html', label: '🐍 Play Snake', style: 'background:#16a34a;color:#fff;box-shadow:0 4px 0 #14532d' }]
    })}
  </div>`;

  return `<div class="w">
    ${createSectionHeader({
      title: '🎮 Games',
      description: 'Browser games that are also learning tools. No install, no account — just play.'
    })}
    ${featured}
  </div>`;
}
export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="games">
    <div class="w">
      <div class="sh">
        <h2>🎮 Games</h2>
        <p>Browser games that are also learning tools. No install, no account — just play.</p>
      </div>
      <div class="featured-row">

        <div class="feat-card" style="border-color:rgba(139,92,246,.3);background:linear-gradient(135deg,rgba(139,92,246,.1),rgba(26,22,20,.97))">
          <div class="chip" style="background:rgba(139,92,246,.15);color:#a78bfa">🎯 Strategy + Quiz</div>
          <h3>HexWars</h3>
          <p>Conquer hex territories with your knowledge. Answer timed quiz questions to claim tiles and dominate the battlefield. Strategy meets trivia.</p>
          <div class="btn-row">
            <a class="btn" style="background:#7c3aed;color:#fff;box-shadow:0 4px 0 #4c1d95" href="./tools/games/hex-wars/index.html">⬡ Play HexWars</a>
          </div>
        </div>

        <div class="feat-card" style="border-color:rgba(251,146,60,.3);background:linear-gradient(135deg,rgba(251,146,60,.1),rgba(26,22,20,.97))">
          <div class="chip" style="background:rgba(251,146,60,.15);color:#fb923c">🔥 Multiplayer Quiz</div>
          <h3>Wings of Fire Quiz</h3>
          <p>Multiplayer quiz on Dr. APJ Abdul Kalam's Wings of Fire. Test your knowledge, compete with friends, and learn from the life of India's Missile Man.</p>
          <div class="btn-row">
            <a class="btn" style="background:#ea580c;color:#fff;box-shadow:0 4px 0 #7c2d12" href="./tools/games/wings-of-fire-quiz/index.html">🔥 Play Quiz</a>
          </div>
        </div>

        <div class="feat-card" style="border-color:rgba(14,165,233,.3);background:linear-gradient(135deg,rgba(14,165,233,.1),rgba(26,22,20,.97))">
          <div class="chip" style="background:rgba(14,165,233,.15);color:#38bdf8">🌌 Sci-Fi Strategy</div>
          <h3>SkillHex Mission Control</h3>
          <p>A mission control dashboard interface. Complete tasks, deploy squads, and earn experience points in a stunning sci-fi environment.</p>
          <div class="btn-row">
            <a class="btn" style="background:#0284c7;color:#fff;box-shadow:0 4px 0 #075985" href="./tools/games/skillhex-mission-control/index.html">🛸 Launch Control</a>
          </div>
        </div>

        <div class="feat-card" style="border-color:rgba(34,197,94,.3);background:linear-gradient(135deg,rgba(34,197,94,.1),rgba(26,22,20,.97))">
          <div class="chip" style="background:rgba(34,197,94,.15);color:#4ade80">🐍 Classic Arcade</div>
          <h3>Decision Snake</h3>
          <p>Classic snake gameplay tuned for fast decision-making. Survive longer, chain clean moves, and beat your best score.</p>
          <div class="btn-row">
            <a class="btn" style="background:#16a34a;color:#fff;box-shadow:0 4px 0 #14532d" href="./tools/games/snake-game/index.html">🐍 Play Snake</a>
          </div>
        </div>

      </div>
    </div>
  </section>`);
}
