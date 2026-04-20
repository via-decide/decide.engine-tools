(function (global) {
  'use strict';

  const environments = [
    { id: 'mars', title: 'Mars simulation', status: 'Live' },
    { id: 'orchade', title: 'Orchade strategy', status: 'Scaffold' },
    { id: 'skillhex', title: 'SkillHex capability graph', status: 'Prototype' }
  ];

  function render(host) {
    host.innerHTML = environments.map((env) => (
      `<article><strong>${env.title}</strong> <span>(${env.status})</span></article>`
    )).join('');
  }

  global.EnvironmentBrowser = { render };
})(window);
