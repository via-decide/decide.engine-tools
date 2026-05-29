/**
 * HexRenderer — p5.js renderer and input adapter for HexGrid.
 */
(function (global) {
  'use strict';

  function color(base, delta = 0) {
    return {
      r: Math.max(0, Math.min(255, base.r + delta)),
      g: Math.max(0, Math.min(255, base.g + delta)),
      b: Math.max(0, Math.min(255, base.b + delta))
    };
  }

  class HexRenderer {
    constructor(grid, p, options = {}) {
      this.grid = grid;
      this.p = p;
      this.onHover = typeof options.onHover === 'function' ? options.onHover : () => {};
      this.hoveredHex = null;
      this.selectedHex = null;
      this.dragging = false;
      this.lastTouchDistance = null;
      this.baseBasalt = { r: 96, g: 100, b: 108 };
      this.hazardColors = {
        dust: { r: 189, g: 133, b: 70 },
        thermal: { r: 206, g: 70, b: 42 },
        rock: { r: 132, g: 136, b: 146 }
      };
    }

    updateHover(x = this.p.mouseX, y = this.p.mouseY) {
      const next = this.grid.getHexAtPixel(x, y);
      if ((next && next.key()) !== (this.hoveredHex && this.hoveredHex.key())) {
        this.hoveredHex = next;
        this.onHover(next);
      }
      return next;
    }

    render() {
      const p = this.p;
      p.background(15, 18, 24);
      this.drawBackdrop();
      this.grid.getAllHexes().forEach((hex) => this.drawHex(hex));
      if (this.selectedHex) this.drawHexOutline(this.selectedHex, { r: 87, g: 205, b: 255 }, 3, 180);
      if (this.hoveredHex) this.drawHexOutline(this.hoveredHex, { r: 255, g: 195, b: 76 }, 4, 230);
      this.drawGridStats();
    }

    drawBackdrop() {
      const p = this.p;
      p.noStroke();
      for (let i = 0; i < 8; i += 1) {
        p.fill(24 + i * 4, 18 + i * 2, 18, 18);
        p.ellipse(p.width * 0.5, p.height * (0.8 + i * 0.02), p.width * (1.3 - i * 0.08), 150 - i * 10);
      }
    }

    drawHex(hex) {
      const p = this.p;
      const noise = Math.round((hex.basaltNoise || 0.4) * 34) - 14;
      let fillColor = color(this.baseBasalt, noise);
      if (hex.hazardType && this.hazardColors[hex.hazardType]) {
        fillColor = this.blend(fillColor, this.hazardColors[hex.hazardType], 0.28);
      }

      p.stroke(54, 62, 72);
      p.strokeWeight(1.2);
      p.fill(fillColor.r, fillColor.g, fillColor.b);
      this.drawHexPolygon(hex.x, hex.y);
      this.drawBasaltTexture(hex);
      this.drawComplexityLabel(hex);

      if (hex.apxsContact) this.drawAPXSMarker(hex);
      if (hex.hazardType) this.drawHazardGlyph(hex);
      if (hex.visited) this.drawVisited(hex);
    }

    drawHexPolygon(cx, cy) {
      const p = this.p;
      p.beginShape();
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI / 3) * i;
        p.vertex(cx + this.grid.hexSize * Math.cos(angle), cy + this.grid.hexSize * Math.sin(angle));
      }
      p.endShape(p.CLOSE);
    }

    drawBasaltTexture(hex) {
      const p = this.p;
      const flecks = 9;
      p.noStroke();
      for (let i = 0; i < flecks; i += 1) {
        const seed = Math.sin((hex.q * 17.13) + (hex.r * 31.7) + i * 9.91);
        const radius = this.grid.hexSize * (0.12 + Math.abs(seed) * 0.6);
        const angle = seed * Math.PI * 2;
        const x = hex.x + Math.cos(angle) * radius;
        const y = hex.y + Math.sin(angle) * radius;
        const shade = 70 + Math.abs(seed) * 55;
        p.fill(shade, shade + 2, shade + 8, 42);
        p.circle(x, y, 2 + Math.abs(seed) * 3);
      }
    }

    drawComplexityLabel(hex) {
      const p = this.p;
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont('monospace');
      p.noStroke();
      p.fill(232, 229, 218);
      p.textSize(Math.max(11, this.grid.hexSize * 0.24));
      p.text(Number(hex.complexity || 0).toFixed(1), hex.x, hex.y - 8);
      p.fill(118, 171, 255);
      p.textSize(Math.max(9, this.grid.hexSize * 0.17));
      p.text(`${hex.energy || 0}% SOL`, hex.x, hex.y + 12);
    }

    drawAPXSMarker(hex) {
      const p = this.p;
      p.stroke(93, 190, 255, 210);
      p.strokeWeight(1.4);
      p.noFill();
      p.circle(hex.x, hex.y + this.grid.hexSize * 0.42, 13);
      p.noStroke();
      p.fill(93, 190, 255, 230);
      p.circle(hex.x, hex.y + this.grid.hexSize * 0.42, 5);
    }

    drawHazardGlyph(hex) {
      const p = this.p;
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(Math.max(10, this.grid.hexSize * 0.2));
      p.noStroke();
      p.fill(255, 191, 101, 230);
      const glyph = hex.hazardType === 'dust' ? '≈' : hex.hazardType === 'thermal' ? '△' : '◆';
      p.text(glyph, hex.x + this.grid.hexSize * 0.45, hex.y - this.grid.hexSize * 0.35);
    }

    drawVisited(hex) {
      const p = this.p;
      p.noFill();
      p.stroke(88, 255, 153, 95);
      p.strokeWeight(1);
      p.circle(hex.x, hex.y, this.grid.hexSize * 1.15);
    }

    drawHexOutline(hex, strokeColor, weight, alpha = 255) {
      const p = this.p;
      p.noFill();
      p.stroke(strokeColor.r, strokeColor.g, strokeColor.b, alpha);
      p.strokeWeight(weight);
      this.drawHexPolygon(hex.x, hex.y);
      p.stroke(strokeColor.r, strokeColor.g, strokeColor.b, 55);
      p.strokeWeight(weight + 6);
      this.drawHexPolygon(hex.x, hex.y);
    }

    drawGridStats() {
      const p = this.p;
      p.noStroke();
      p.fill(255, 255, 255, 110);
      p.textAlign(p.RIGHT, p.BOTTOM);
      p.textFont('monospace');
      p.textSize(10);
      p.text(`${this.grid.getAllHexes().length} HEX · ZOOM ${Math.round(this.grid.hexSize)}PX`, p.width - 14, p.height - 12);
    }

    blend(base, overlay, alpha) {
      return {
        r: Math.round(base.r * (1 - alpha) + overlay.r * alpha),
        g: Math.round(base.g * (1 - alpha) + overlay.g * alpha),
        b: Math.round(base.b * (1 - alpha) + overlay.b * alpha)
      };
    }

    handlePress() {
      this.dragging = true;
      this.selectedHex = this.updateHover();
      return false;
    }

    handleRelease() {
      this.dragging = false;
      this.lastTouchDistance = null;
      return false;
    }

    handleDrag() {
      this.grid.pan(this.p.mouseX - this.p.pmouseX, this.p.mouseY - this.p.pmouseY);
      this.updateHover();
      return false;
    }

    handleWheel(event) {
      const factor = event.delta > 0 ? 0.92 : 1.08;
      this.grid.zoom(factor, this.p.mouseX, this.p.mouseY);
      this.updateHover();
      return false;
    }

    handleTouchMove() {
      const touches = this.p.touches || [];
      if (touches.length === 2) {
        const dx = touches[0].x - touches[1].x;
        const dy = touches[0].y - touches[1].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (this.lastTouchDistance) {
          this.grid.zoom(distance / this.lastTouchDistance, this.p.width / 2, this.p.height / 2);
        }
        this.lastTouchDistance = distance;
      }
      return false;
    }
  }

  global.HexRenderer = HexRenderer;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HexRenderer };
  }
})(typeof window !== 'undefined' ? window : globalThis);
