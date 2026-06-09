/**
 * HexGrid — axial coordinate math for the Mars visual layer.
 *
 * Flat-top axial coordinates are the shared source of truth for Task 1
 * rendering and Task 2 rover pathfinding. This file intentionally has no p5.js
 * dependency so it can run in Node unit tests and browser demos.
 */
(function (global) {
  'use strict';

  const SQRT_3 = Math.sqrt(3);
  const DIRECTIONS = Object.freeze([
    Object.freeze({ q: 1, r: 0, name: 'E' }),
    Object.freeze({ q: 1, r: -1, name: 'SE' }),
    Object.freeze({ q: 0, r: -1, name: 'SW' }),
    Object.freeze({ q: -1, r: 0, name: 'W' }),
    Object.freeze({ q: -1, r: 1, name: 'NW' }),
    Object.freeze({ q: 0, r: 1, name: 'NE' })
  ]);

  class Hex {
    constructor(q, r, metadata = {}) {
      this.q = q;
      this.r = r;
      this.s = -q - r;
      this.x = 0;
      this.y = 0;
      this.visited = Boolean(metadata.visited);
      Object.assign(this, metadata);
    }

    key() {
      return HexGrid.key(this.q, this.r);
    }
  }

  class HexGrid {
    constructor(options = {}) {
      const terrainGenerator = options.terrainGenerator || null;
      this.radius = Number.isInteger(options.radius) ? options.radius : 1;
      this.hexSize = Number.isFinite(options.hexSize) ? options.hexSize : 52;
      this.centerX = Number.isFinite(options.centerX) ? options.centerX : 0;
      this.centerY = Number.isFinite(options.centerY) ? options.centerY : 0;
      this.minHexSize = Number.isFinite(options.minHexSize) ? options.minHexSize : 28;
      this.maxHexSize = Number.isFinite(options.maxHexSize) ? options.maxHexSize : 96;
      this.terrainGenerator = terrainGenerator;
      this.authoredTerrain = HexGrid.normalizeTerrain(options.terrain || []);
      this.hexes = new Map();
      this.roverPos = { q: 0, r: 0 };

      this.generate();
    }

    static key(q, r) {
      return `${q},${r}`;
    }

    static normalizeTerrain(terrain) {
      const map = new Map();
      if (Array.isArray(terrain)) {
        terrain.forEach((entry) => {
          if (entry && Number.isFinite(entry.q) && Number.isFinite(entry.r)) {
            map.set(HexGrid.key(entry.q, entry.r), entry);
          }
        });
      } else if (terrain && typeof terrain === 'object') {
        Object.keys(terrain).forEach((key) => map.set(key, terrain[key]));
      }
      return map;
    }

    generate() {
      this.hexes.clear();
      for (let q = -this.radius; q <= this.radius; q += 1) {
        const rMin = Math.max(-this.radius, -q - this.radius);
        const rMax = Math.min(this.radius, -q + this.radius);
        for (let r = rMin; r <= rMax; r += 1) {
          const key = HexGrid.key(q, r);
          const authored = this.authoredTerrain.get(key) || {};
          const generated = this.terrainGenerator && typeof this.terrainGenerator.generate === 'function'
            ? this.terrainGenerator.generate(q, r, authored)
            : authored;
          const hex = new Hex(q, r, generated);
          this.hexes.set(key, hex);
        }
      }
      this.updatePixelCoordinates();
      const start = this.getHex(0, 0);
      if (start) start.visited = true;
      return this;
    }

    axialToPixel(q, r) {
      return {
        x: this.centerX + this.hexSize * (1.5 * q),
        y: this.centerY + this.hexSize * ((SQRT_3 / 2) * q + SQRT_3 * r)
      };
    }

    pixelToAxial(x, y) {
      const localX = (x - this.centerX) / this.hexSize;
      const localY = (y - this.centerY) / this.hexSize;
      return this.axialRound((2 / 3) * localX, (-1 / 3) * localX + (SQRT_3 / 3) * localY);
    }

    axialRound(q, r) {
      const s = -q - r;
      let rq = Math.round(q);
      let rr = Math.round(r);
      let rs = Math.round(s);

      const qDiff = Math.abs(rq - q);
      const rDiff = Math.abs(rr - r);
      const sDiff = Math.abs(rs - s);

      if (qDiff > rDiff && qDiff > sDiff) {
        rq = -rr - rs;
      } else if (rDiff > sDiff) {
        rr = -rq - rs;
      } else {
        rs = -rq - rr;
      }

      return { q: rq, r: rr, s: rs };
    }

    updatePixelCoordinates() {
      this.hexes.forEach((hex) => {
        const pixel = this.axialToPixel(hex.q, hex.r);
        hex.x = pixel.x;
        hex.y = pixel.y;
      });
      return this;
    }

    getHex(q, r) {
      return this.hexes.get(HexGrid.key(q, r)) || null;
    }

    getHexAtPixel(x, y) {
      const axial = this.pixelToAxial(x, y);
      return this.getHex(axial.q, axial.r);
    }

    getAllHexes() {
      return Array.from(this.hexes.values());
    }

    getNeighbors(q, r) {
      return DIRECTIONS
        .map((direction) => this.getHex(q + direction.q, r + direction.r))
        .filter(Boolean);
    }

    distance(q1, r1, q2, r2) {
      const s1 = -q1 - r1;
      const s2 = -q2 - r2;
      return (Math.abs(q1 - q2) + Math.abs(r1 - r2) + Math.abs(s1 - s2)) / 2;
    }

    pan(dx, dy) {
      this.centerX += dx;
      this.centerY += dy;
      return this.updatePixelCoordinates();
    }

    zoom(factor, originX = this.centerX, originY = this.centerY) {
      if (!Number.isFinite(factor) || factor <= 0) return this;
      const before = this.pixelToAxial(originX, originY);
      const previousSize = this.hexSize;
      this.hexSize = Math.max(this.minHexSize, Math.min(this.maxHexSize, this.hexSize * factor));
      if (this.hexSize === previousSize) return this.updatePixelCoordinates();

      const afterPixel = this.axialToPixel(before.q, before.r);
      this.centerX += originX - afterPixel.x;
      this.centerY += originY - afterPixel.y;
      return this.updatePixelCoordinates();
    }

    moveRover(q, r) {
      const hex = this.getHex(q, r);
      if (!hex) return false;
      this.roverPos = { q, r };
      hex.visited = true;
      return true;
    }
  }

  HexGrid.DIRECTIONS = DIRECTIONS;
  global.Hex = Hex;
  global.HexGrid = HexGrid;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Hex, HexGrid, DIRECTIONS };
  }
})(typeof window !== 'undefined' ? window : globalThis);
