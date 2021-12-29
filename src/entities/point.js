class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static generateRandomPoint() {
    const x = Point.generateRandomCoord()
    const y = Point.generateRandomCoord()

    return new Point(x, y)
  }

  static generateRandomCoord() {
    return Number((Math.random() * 1).toFixed(1))
  }
}

module.exports = { Point }
