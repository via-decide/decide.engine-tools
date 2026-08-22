const ToolStorage = require('../../shared/tool-storage');

function generatePalette() {
  const palette = [
    '#FF5733',
    '#33FF57',
    '#3357FF'
  ];
  return palette;
}

document.getElementById('generate-palette').addEventListener('click', () => {
  const paletteList = document.getElementById('palette-list');
  const palette = generatePalette();
  ToolStorage.set('color-palette', palette);
  palette.forEach(color => {
    const li = document.createElement('li');
    li.textContent = color;
    paletteList.appendChild(li);
  });
});