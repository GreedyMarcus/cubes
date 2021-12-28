const GameEvents = Object.freeze({
  USER_CONNECTED: "user-connected",
  GAME_STATE_CHANGED: "game-state-changed"
})

class Game {
  constructor(ctx) {
    this.ctx = ctx
    this.animationId = null
    this.playerId = null
    this.state = null
  }

  setup() {
    this.ctx.canvas.width = window.innerWidth
    this.ctx.canvas.height = window.innerHeight
  }

  startRendering = () => {
    this.animationId = requestAnimationFrame(this.startRendering)

    this.clearScreen()
    this.state.players.forEach(({ cube }) => {
      // TODO: Update cube position before drawing it
      Cube.draw(this.ctx, cube)
    })
  }

  clearScreen() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  convertFromRelativeViewport(state) {
    return {
      ...state,
      players: state.players.map((player) => ({
        ...player,
        cube: {
          ...player.cube,
          size: this.ctx.canvas.width * player.cube.size,
          position: {
            x: this.ctx.canvas.width * player.cube.position.x,
            y: this.ctx.canvas.height * player.cube.position.y
          }
        }
      }))
    }
  }

  convertToRelativeViewport(state) {
    return {
      ...state,
      players: state.players.map((player) => ({
        ...player,
        cube: {
          ...player.cube,
          size: (1 / this.ctx.canvas.width) * player.cube.size,
          position: {
            x: (1 / this.ctx.canvas.width) * player.cube.position.x,
            y: (1 / this.ctx.canvas.height) * player.cube.position.y
          }
        }
      }))
    }
  }

  handleUserConnected = (payload) => {
    const { data } = JSON.parse(payload)

    this.playerId = data.playerId
    this.state = this.convertFromRelativeViewport(data.state)

    this.startRendering()
  }

  handleGameStateChanged = (payload) => {
    const { data } = JSON.parse(payload)

    this.state = this.convertFromRelativeViewport(data.state)
  }

  handleResize = () => {
    const temp = this.convertToRelativeViewport(this.state)

    this.ctx.canvas.width = window.innerWidth
    this.ctx.canvas.height = window.innerHeight

    this.state = this.convertFromRelativeViewport(temp)
  }
}
