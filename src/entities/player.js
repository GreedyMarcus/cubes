const { Cube } = require("./cube")

class Player {
  constructor(id) {
    this.id = id
    this.cube = new Cube()
  }
}

module.exports = { Player }
