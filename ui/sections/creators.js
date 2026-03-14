import { createFeaturedCard } from '../components/featured-card.js';
import { createGridLayout } from '../components/grid-layout.js';
import { createSectionHeader } from '../components/section-header.js';
import { createToolCard } from '../components/tool-card.js';

const cards = [
  { id: 'script-generator', chipLabel: 'Creators', chipClass: 'c-creators', icon: '🎬' },
  { id: 'prompt-compare', chipLabel: 'Analysis', chipClass: 'c-researchers', icon: '⚖️' },
  { id: 'output-evaluator', chipLabel: 'Quality', chipClass: 'c-researchers', icon: '📊' }
];

export function renderCreatorsSection(toolsById) {
  const featured = `<div class="featured-row">
    ${createFeaturedCard({
      chip: 'Most Used',
      chipClass: 'c-creators',
      title: 'PromptAlchemy',
      description: 'Turn a raw idea into a structured prompt pack ready for any AI tool. Works for social, video, writing, and product.',
      links: [
        { className: 'btn-green', href: './prompt-alchemy/index.html', label: 'Open Tool' },
        { className: 'btn-ghost', href: './tools/promptalchemy/index.html', label: 'New Version' }
      ]
    })}
    ${createFeaturedCard({
      chip: 'Popular',
      chipClass: 'c-creators',
      title: 'Idea Remixer',
      description: 'Paste one idea, get six angle variants — different audiences, formats, and positioning to test fast.',
      links: [{ className: 'btn-green', href: './tools/idea-remixer/index.html', label: 'Open Tool' }]
    })}
  </div>`;

  const gridCards = cards.map((card) => createToolCard({ ...toolsById[card.id], ...card }));

  return `<div class="w">
    ${createSectionHeader({
      title: '✏️ For Creators',
      description: 'Generate prompts, remix ideas, write scripts, and compare outputs. Built for content creators, writers, and marketers.'
    })}
    ${featured}
    ${createGridLayout(gridCards)}
  </div>`;
}
