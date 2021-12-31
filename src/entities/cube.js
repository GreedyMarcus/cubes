const { Point } = require("./point")

class Cube {
  static DEFAULT_SIZE = 0.015
  static DEFAULT_VELOCITY_MULTIPLIER = 3

  constructor(color) {
    this.size = Cube.DEFAULT_SIZE
    this.color = color
    this.position = Point.generateRandomPoint()
    this.velocity = new Point(0, 0)
    this.velocityMultiplier = Cube.DEFAULT_VELOCITY_MULTIPLIER
  }
}

module.exports = { Cube }
