(() => {
  const navLinks = [...document.querySelectorAll('[data-route]')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const route = link.getAttribute('data-route');
      link.classList.toggle('active', route === id);
    });
  };

  const goToRoute = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    history.replaceState(null, '', `#${id}`);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const route = link.getAttribute('data-route');
      if (!route) return;
      event.preventDefault();
      goToRoute(route);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    {
      rootMargin: '-30% 0px -50% 0px',
      threshold: [0.2, 0.5, 0.8],
    }
  );

  sections.forEach((section) => observer.observe(section));

  const initial = window.location.hash.replace('#', '');
  if (initial && document.getElementById(initial)) {
    setTimeout(() => goToRoute(initial), 50);
  } else {
    setActive('home');
  }
})();
