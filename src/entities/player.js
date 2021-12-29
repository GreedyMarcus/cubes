const { Cube } = require("./cube")
const { Projectile } = require("./projectile")

class Player {
  constructor(id) {
    this.id = id
    this.alive = true
    this.cube = new Cube()
    this.projectiles = new Array(10).fill(new Projectile())
  }
}

module.exports = { Player }
