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
  </div>`;

  return `<div class="w">
    ${createSectionHeader({
      title: '🎮 Games',
      description: 'Browser games that are also learning tools. No install, no account — just play.'
    })}
    ${featured}
  </div>`;
}
