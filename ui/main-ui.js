(() => {
  'use strict';

  const navContainer = document.getElementById('main-nav-links');
  if (!navContainer) return;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'creators', label: 'Creators' },
    { id: 'builders', label: 'Builders' },
    { id: 'research', label: 'Research' },
    { id: 'business', label: 'Business' },
    { id: 'orchard', label: '🌳 Orchard Game' },
    { id: 'games', label: '🎮 Games' },
    { id: 'mars', label: '🚀 Mars' },
    { id: 'all', label: 'All Tools' }
  ];

  navContainer.innerHTML = navItems
    .map(({ id, label }, index) => (
      `<a class="nl${index === 0 ? ' on' : ''}" href="#${id}" data-route="${id}">${label}</a>`
    ))
    .join('');
})();
