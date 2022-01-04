const { Point } = require("./point")

const DEFAULT_CUBE_SIZE = 0.015
const DEFAULT_CUBE_VELOCITY_MULTIPLIER = 3

class Cube {
  constructor(color) {
    this.size = DEFAULT_CUBE_SIZE
    this.color = color
    this.position = Point.generateRandomPoint()
    this.velocity = new Point()
    this.velocityMultiplier = DEFAULT_CUBE_VELOCITY_MULTIPLIER
  }
}

module.exports = { Cube }
