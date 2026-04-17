(function () {
  'use strict';

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const minimap = document.getElementById('minimap');
  const minimapCtx = minimap.getContext('2d');

  const missionNameEl = document.getElementById('mission-name');
  const missionProgressEl = document.getElementById('mission-progress');
  const regionStatusEl = document.getElementById('region-status');
  const zoomStateEl = document.getElementById('zoom-state');
  const hpEl = document.getElementById('stat-hp');
  const energyEl = document.getElementById('stat-energy');
  const xpEl = document.getElementById('stat-xp');
  const regionsEl = document.getElementById('stat-regions');

  const map = new window.GameMap();
  const world = new window.World(map);
  const player = new window.Player(map.regionSize * 0.5, map.regionSize * 0.5);

  const input = { w: false, a: false, s: false, d: false };
  const camera = {
    x: player.x,
    y: player.y,
    zoom: 1,
    targetZoom: 1
  };

  const zoomScales = [0.17, 0.45, 1.0];
  const zoomLabels = ['Global', 'City', 'Ground'];
  let zoomLevel = 1;
  let lastTick = performance.now();

  const assets = {
    player: new Image(),
    building: new Image(),
    worldmap: new Image()
  };

  assets.player.src = './assets/player.png';
  assets.building.src = './assets/building.png';
  assets.worldmap.src = './assets/worldmap.png';

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function setZoom(level) {
    zoomLevel = Math.max(0, Math.min(2, level));
    camera.targetZoom = zoomScales[zoomLevel];
    zoomStateEl.textContent = `Level: ${zoomLabels[zoomLevel]}`;
  }

  function setupEvents() {
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(input, key)) input[key] = true;
    });
    window.addEventListener('keyup', (event) => {
      const key = event.key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(input, key)) input[key] = false;
    });

    window.addEventListener('wheel', (event) => {
      event.preventDefault();
      const next = zoomLevel + (event.deltaY > 0 ? -1 : 1);
      setZoom(next);
    }, { passive: false });

    document.querySelectorAll('#zoom-controls button').forEach((button) => {
      button.addEventListener('click', () => {
        setZoom(Number(button.dataset.zoom));
      });
    });
  }

  function worldToScreen(worldX, worldY) {
    return {
      x: (worldX - camera.x) * camera.zoom + canvas.width * 0.5,
      y: (worldY - camera.y) * camera.zoom + canvas.height * 0.5
    };
  }

  function drawGrid() {
    const step = map.regionSize / 6;
    ctx.strokeStyle = 'rgba(85, 139, 255, 0.12)';
    ctx.lineWidth = 1;

    const left = camera.x - canvas.width / (2 * camera.zoom);
    const right = camera.x + canvas.width / (2 * camera.zoom);
    const top = camera.y - canvas.height / (2 * camera.zoom);
    const bottom = camera.y + canvas.height / (2 * camera.zoom);

    const startX = Math.floor(left / step) * step;
    const startY = Math.floor(top / step) * step;

    for (let x = startX; x < right; x += step) {
      const a = worldToScreen(x, top);
      const b = worldToScreen(x, bottom);
      ctx.beginPath();
      ctx.moveTo(a.x, 0);
      ctx.lineTo(b.x, canvas.height);
      ctx.stroke();
    }

    for (let y = startY; y < bottom; y += step) {
      const a = worldToScreen(left, y);
      const b = worldToScreen(right, y);
      ctx.beginPath();
      ctx.moveTo(0, a.y);
      ctx.lineTo(canvas.width, b.y);
      ctx.stroke();
    }
  }

  function drawRegions() {
    map.regions.forEach((region) => {
      const worldX = region.x * map.regionSize;
      const worldY = region.y * map.regionSize;
      const p = worldToScreen(worldX, worldY);
      const size = map.regionSize * camera.zoom;

      ctx.fillStyle = region.unlocked ? 'rgba(56, 90, 153, 0.26)' : 'rgba(40, 40, 48, 0.5)';
      ctx.fillRect(p.x, p.y, size, size);

      ctx.strokeStyle = region.discovered ? 'rgba(90, 166, 255, 0.45)' : 'rgba(94, 106, 128, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, size, size);

      if (camera.zoom < 0.4) {
        ctx.fillStyle = 'rgba(214, 227, 255, 0.66)';
        ctx.font = '12px sans-serif';
        ctx.fillText(region.id, p.x + 10, p.y + 18);
      }
    });
  }

  function drawBuildings() {
    world.buildings.forEach((building) => {
      const p = worldToScreen(building.x, building.y);
      const width = building.w * camera.zoom;
      const height = building.h * camera.zoom;

      if (width < 2 || height < 2) return;

      ctx.fillStyle = building.locked ? 'rgba(87, 52, 63, 0.45)' : 'rgba(67, 112, 222, 0.43)';
      ctx.fillRect(p.x, p.y, width, height);

      if (camera.zoom > 0.6) {
        ctx.strokeStyle = 'rgba(143, 204, 255, 0.22)';
        ctx.strokeRect(p.x, p.y, width, height);
      }
    });
  }

  function drawPlayer() {
    const p = worldToScreen(player.x, player.y);
    const r = player.radius * Math.max(camera.zoom, 0.45);

    ctx.beginPath();
    ctx.fillStyle = '#47b8ff';
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.arc(p.x, p.y, r + 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#08101b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawRegions();
    if (camera.zoom > 0.28) {
      drawBuildings();
    }
    drawPlayer();
  }

  function renderMinimap() {
    minimapCtx.clearRect(0, 0, minimap.width, minimap.height);
    minimapCtx.fillStyle = '#0b1220';
    minimapCtx.fillRect(0, 0, minimap.width, minimap.height);

    const scaleX = minimap.width / map.totalWidth;
    const scaleY = minimap.height / map.totalHeight;

    map.regions.forEach((region) => {
      minimapCtx.fillStyle = region.unlocked ? '#2f4677' : '#1f2233';
      minimapCtx.fillRect(
        region.x * map.regionSize * scaleX,
        region.y * map.regionSize * scaleY,
        map.regionSize * scaleX,
        map.regionSize * scaleY
      );
    });

    minimapCtx.fillStyle = '#66d0ff';
    minimapCtx.beginPath();
    minimapCtx.arc(player.x * scaleX, player.y * scaleY, 4, 0, Math.PI * 2);
    minimapCtx.fill();
  }

  function updateHud(worldState) {
    if (worldState && worldState.mission) {
      missionNameEl.textContent = `Mission: ${worldState.mission.title}`;
      const missionProgress = Math.min(100, Math.max(0, Math.round((1 - worldState.mission.threshold / 3) * 100)));
      missionProgressEl.textContent = `Progress: ${worldState.mission.completed ? 100 : missionProgress}%`;
      regionStatusEl.textContent = `Region: ${worldState.region.id} (${worldState.region.unlocked ? 'Unlocked' : 'Locked'})`;
      regionsEl.textContent = String(worldState.unlockedRegions);
    }

    hpEl.textContent = String(player.hp.toFixed(0));
    energyEl.textContent = String(player.energy.toFixed(0));
    xpEl.textContent = String(player.xp);
  }

  function tick(now) {
    const dt = Math.min((now - lastTick) / 1000, 0.033);
    lastTick = now;

    player.update(dt, input, world, map);
    const worldState = world.update(player);

    camera.x += (player.x - camera.x) * 0.11;
    camera.y += (player.y - camera.y) * 0.11;
    camera.zoom += (camera.targetZoom - camera.zoom) * 0.09;

    render();
    renderMinimap();
    updateHud(worldState);

    requestAnimationFrame(tick);
  }

  resizeCanvas();
  setupEvents();
  setZoom(1);
  requestAnimationFrame(tick);
})();
