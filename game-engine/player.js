(function (global) {
  'use strict';

  class Player {
    constructor(spawnX, spawnY) {
      this.x = spawnX;
      this.y = spawnY;
      this.radius = 16;
      this.speed = 220;
      this.velocityX = 0;
      this.velocityY = 0;
      this.hp = 100;
      this.energy = 100;
      this.xp = 0;
    }

    update(dt, input, world, map) {
      const rawX = (input.d ? 1 : 0) - (input.a ? 1 : 0);
      const rawY = (input.s ? 1 : 0) - (input.w ? 1 : 0);
      const length = Math.hypot(rawX, rawY) || 1;

      this.velocityX = (rawX / length) * this.speed;
      this.velocityY = (rawY / length) * this.speed;

      const nextX = this.x + this.velocityX * dt;
      const nextY = this.y + this.velocityY * dt;

      if (!world.collides(nextX, this.y, this.radius)) {
        this.x = nextX;
      }
      if (!world.collides(this.x, nextY, this.radius)) {
        this.y = nextY;
      }

      this.x = Math.max(this.radius, Math.min(this.x, map.totalWidth - this.radius));
      this.y = Math.max(this.radius, Math.min(this.y, map.totalHeight - this.radius));

      this.energy = Math.max(20, this.energy - Math.abs(this.velocityX + this.velocityY) * dt * 0.003);
    }

    grantMissionReward() {
      this.xp += 120;
      this.energy = Math.min(100, this.energy + 16);
    }
  }

  global.Player = Player;
})(window);
