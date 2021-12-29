const { Point } = require("./point")

class Projectile {
  static DEFAULT_RADIUS = 0.004
  static DEFAULT_VELOCITY_MULTIPLIER = 5

  constructor(playerId, color) {
    this.createdBy = playerId
    this.radius = Projectile.DEFAULT_RADIUS
    this.color = color
    this.position = new Point(0, 0)
    this.velocity = new Point(0, 0)
    this.velocityMultiplier = Projectile.DEFAULT_VELOCITY_MULTIPLIER
    this.fired = false
  }
}

module.exports = { Projectile }
