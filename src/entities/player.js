const { Cube } = require("./cube")
const { Projectile } = require("./projectile")

class Player {
  static colors = ["white", "salmon", "gold", "lime", "aqua", "magenta"]

  constructor() {
    this.id = this.generatePlayerId()
    this.alive = true
    this.color = Player.getColor()
    this.cube = new Cube(this.color)
    this.projectiles = new Array(10).fill(new Projectile(this.id, this.cube.color))
  }

  generatePlayerId() {
    return Math.random().toString(36).slice(2)
  }

  static reset(player) {
    player.alive = true
    player.cube = new Cube(player.color)
    player.projectiles = new Array(10).fill(new Projectile(player.id, player.color))
  }

  static getColor() {
    return Player.colors.shift()
  }

  static restoreColor(color) {
    Player.colors.push(color)
  }
}

module.exports = { Player }
