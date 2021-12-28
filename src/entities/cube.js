const { Point } = require("./point")

class Cube {
  static DEFAULT_SIZE = 0.015
  static DEFAULT_COLOR = "#f55f55"
  static DEFAULT_VELOCITY_MULTIPLIER = 3

  constructor() {
    this.size = Cube.DEFAULT_SIZE
    this.color = Cube.DEFAULT_COLOR
    this.position = Cube.generateRandomPosition()
    this.velocity = new Point(0, 0)
    this.velocityMultiplier = Cube.DEFAULT_VELOCITY_MULTIPLIER
  }

  update(cube) {
    this.size = cube.size
    this.color = cube.color
    this.position = cube.position
    this.velocity = cube.velocity
    this.velocityMultiplier = cube.velocityMultiplier
  }

  static generateRandomPosition() {
    const x = Point.generateRandomCoord()
    const y = Point.generateRandomCoord()

    return new Point(x, y)
  }
}

module.exports = { Cube }
