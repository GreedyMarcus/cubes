const { Point } = require("./point")

const DEFAULT_PROJECTILE_RADIUS = 0.004
const DEFAULT_PROJECTILE_VELOCITY_MULTIPLIER = 5

class Projectile {
  constructor(createdBy, color) {
    this.color = color
    this.createdBy = createdBy
    this.radius = DEFAULT_PROJECTILE_RADIUS
    this.position = new Point()
    this.velocity = new Point()
    this.velocityMultiplier = DEFAULT_PROJECTILE_VELOCITY_MULTIPLIER
    this.fired = false
  }
}

module.exports = { Projectile }
