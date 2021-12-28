const GameEvents = Object.freeze({
  USER_CONNECTED: "user-connected",
  GAME_STATE_UPDATE: "game-state-update",
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
      Cube.render(this.ctx, cube)
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

  handleUserConnected(payload) {
    const { data } = JSON.parse(payload)

    this.playerId = data.playerId
    this.state = this.convertFromRelativeViewport(data.state)

    this.startRendering()
  }

  handleGameStateChanged(payload) {
    const { data } = JSON.parse(payload)

    this.state = this.convertFromRelativeViewport(data.state)
  }

  handleResize() {
    const temp = this.convertToRelativeViewport(this.state)

    this.ctx.canvas.width = window.innerWidth
    this.ctx.canvas.height = window.innerHeight

    this.state = this.convertFromRelativeViewport(temp)
  }

  handlePlayerMove(socket, mouseX, mouseY) {
    const playerIndex = this.state.players.findIndex(({ id }) => id === this.playerId)
    if (playerIndex !== -1) {
      const angle = Math.atan2(
        mouseY - this.state.players[playerIndex].cube.position.y,
        mouseX - this.state.players[playerIndex].cube.position.x
      )

      this.state.players[playerIndex].cube.velocity.x = Math.cos(angle)
      this.state.players[playerIndex].cube.velocity.y = Math.sin(angle)

      socket.emit(
        GameEvents.GAME_STATE_UPDATE,
        JSON.stringify({
          data: {
            state: this.convertToRelativeViewport(this.state)
          }
        })
      )
    }
  }
}
