class Point {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  static generateRandomPoint() {
    const x = Number((Math.random() * 1).toFixed(1))
    const y = Number((Math.random() * 1).toFixed(1))

    return new Point(x, y)
  }
}

module.exports = { Point }
