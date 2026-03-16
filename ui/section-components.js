(function initSectionComponents() {
  'use strict';

  function featuredCard(opts) {
    const secondary = opts.secondaryCta
      ? `<a class="btn btn-ghost" href="${opts.secondaryCta.href}">${opts.secondaryCta.label}</a>`
      : '';

    return `
      <div class="feat-card ${opts.variantClass || ''}">
        <div class="chip ${opts.chipClass || ''}">${opts.badge}</div>
        <h3>${opts.title}</h3>
        <p>${opts.description}</p>
        <div class="btn-row">
          <a class="btn ${opts.buttonClass || ''}" href="${opts.cta.href}">${opts.cta.label}</a>
          ${secondary}
        </div>
      </div>
    `;
  }

  function orchardToolCard(opts) {
    return `
      <${opts.href ? 'a href="' + opts.href + '"' : 'div'} class="card ${opts.cardClass || ''}">
        <div class="card-top"><span class="chip ${opts.chipClass || ''}">${opts.chip}</span><span class="card-icon">${opts.icon}</span></div>
        <h3>${opts.title}</h3>
        <p>${opts.description}</p>
        <span class="${opts.footerClass || 'card-link'}">${opts.footerText}</span>
      </${opts.href ? 'a' : 'div'}>
    `;
  }

  window.UISections = {
    featuredCard,
    orchardToolCard
  };
})();
