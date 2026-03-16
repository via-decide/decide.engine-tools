const CATEGORY_CLASS = {
  creators: 'c-creators',
  coders: 'c-coders',
  researchers: 'c-researchers',
  operators: 'c-operators',
  business: 'c-business',
  education: 'c-education',
  system: 'c-system',
  misc: 'c-misc',
  games: 'c-misc'
};

const CATEGORY_LABEL = {
  creators: 'Creators',
  coders: 'Builders',
  researchers: 'Research',
  operators: 'Business',
  business: 'Business',
  education: 'Students',
  system: 'System',
  misc: 'Other',
  games: 'Games'
};

const CATEGORY_ICON = {
  creators: '✏️',
  coders: '💻',
  researchers: '🔬',
  operators: '📊',
  business: '📊',
  education: '📚',
  system: '⚙️',
  misc: '🍃',
  games: '🎮'
};

export function createToolCard(tool) {
  const category = tool.category || 'misc';
  const chipClass = tool.chipClass || CATEGORY_CLASS[category] || 'c-misc';
  const chipLabel = tool.chipLabel || CATEGORY_LABEL[category] || 'Other';
  const icon = tool.icon || CATEGORY_ICON[category] || '🍃';
  const href = tool.entry ? `./${tool.entry.replace(/^\.\//, '')}` : '#';
  const description = tool.description || 'Standalone browser tool.';

  return `<a class="card" href="${href}">
    <div class="card-top"><span class="chip ${chipClass}">${chipLabel}</span><span class="card-icon">${icon}</span></div>
    <h3>${tool.name}</h3>
    <p>${description}</p>
    <span class="card-link">Open</span>
  </a>`;
}
