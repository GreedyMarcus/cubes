const { Cube } = require("./cube")
const { Projectile } = require("./projectile")

class Player {
  static colors = ["white", "salmon", "gold", "lime", "aqua", "magenta"]

  constructor(id) {
    this.id = id ?? this.generatePlayerId()
    this.alive = true
    this.color = Player.getColor()
    this.cube = new Cube(this.color)
    this.projectiles = this.generateProjectiles(10)
  }

  generatePlayerId() {
    return Math.random().toString(36).slice(2)
  }

  generateProjectiles(amount) {
    return new Array(amount).fill(new Projectile(this.id, this.cube.color))
  }

  static getColor() {
    return Player.colors.shift()
  }

  static restoreColor(color) {
    Player.colors.push(color)
  }

  static restoreAllColors() {
    Player.colors = ["white", "salmon", "gold", "lime", "aqua", "magenta"]
  }
}

module.exports = { Player }
