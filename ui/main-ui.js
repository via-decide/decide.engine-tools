(function () {
  'use strict';

  document.querySelectorAll('.nl[data-s]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const section = document.getElementById(link.dataset.s);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nl[data-s]')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('on', link.dataset.s === entry.target.id));
    });
  }, { threshold: 0.35 });

  sections.forEach((section) => observer.observe(section));
})();
