export function createFeaturedCard({ chip, chipClass = '', chipStyle = '', title, description, links = [], cardStyle = '' }) {
  const chipClassAttr = chipClass ? ` ${chipClass}` : '';
  const chipStyleAttr = chipStyle ? ` style="${chipStyle}"` : '';
  const linksHtml = links
    .map((link) => `<a class="btn ${link.className || ''}"${link.style ? ` style="${link.style}"` : ''} href="${link.href}">${link.label}</a>`)
    .join('');

  return `<div class="feat-card"${cardStyle ? ` style="${cardStyle}"` : ''}>
    <div class="chip${chipClassAttr}"${chipStyleAttr}>${chip}</div>
    <h3>${title}</h3>
    <p>${description}</p>
    <div class="btn-row">${linksHtml}</div>
  </div>`;
}
