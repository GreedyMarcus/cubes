class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static generateRandomCoord() {
    return Number((Math.random() * 1).toFixed(1))
  }
}

module.exports = { Point }
