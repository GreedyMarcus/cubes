const GameEvents = Object.freeze({
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  PLAYER_CONNECTED: "player-connected",
  PLAYER_LIMIT_REACHED: "player-limit-reached",
  START_GAME: "start-game",
  FINISH_GAME: "finish-game",
  UPDATE_GAME_STATE: "update-game-state",
  GAME_STARTED: "game-started",
  GAME_FINISHED: "game-finished",
  GAME_STATE_CHANGED: "game-state-changed",
  GAME_ALREADY_STARTED: "game-already-started"
})

const GameStatus = Object.freeze({
  LOBBY: "lobby",
  STARTED: "started",
  FINISHED: "finished"
})

class Game {
  constructor() {
    this.animationId = null
    this.playerId = null
    this.state = null
  }

  connectPlayer(ctx, socket, playerId, state) {
    this.playerId = this.playerId ?? playerId
    this.state = Screen.convertFromRelativeViewport(ctx, state)

    if (this.state.status === GameStatus.LOBBY) {
      Panel.displayPanel(true)
    }

    if (this.state.status === GameStatus.STARTED) {
      Panel.displayMessage(false)
      Panel.displayPanel(false)
      this.startRendering(ctx, socket)
    }

    if (this.state.status === GameStatus.FINISHED) {
      Panel.displayMessage(true, Panel.printWinner(this.state.winner))
      Panel.displayPanel(true)
    }
  }

  startGame(ctx, socket, state) {
    this.state = Screen.convertFromRelativeViewport(ctx, state)

    Panel.displayMessage(false)
    Panel.displayPanel(false)

    this.startRendering(ctx, socket)
  }

  finishGame(ctx, state) {
    this.state = Screen.convertFromRelativeViewport(ctx, state)

    Panel.displayMessage(true, Panel.printWinner(this.state.winner))
    Panel.displayPanel(true)

    this.stopRendering(ctx)
  }

  startRendering(ctx, socket) {
    this.animationId = requestAnimationFrame(() => this.startRendering(ctx, socket))

    Screen.clear(ctx, !this.animationId)

    this.state.players.forEach((currentPlayer, _, players) => {
      if (!currentPlayer.alive) return

      Cube.render(ctx, currentPlayer.cube)

      currentPlayer.projectiles.forEach((projectile) => {
        if (!projectile.fired) return

        Projectile.render(ctx, projectile)

        players.forEach((player) => {
          if (player.id === projectile.createdBy || !player.alive) return

          if (Projectile.isCollide(projectile, player.cube)) {
            player.alive = false

            Projectile.reload(projectile)

            this.checkEndGame(socket)
            this.updateGameState(ctx, socket)
          }
        })
      })

      players.forEach((player) => {
        if (player.id === currentPlayer.id || !player.alive) return

        if (Cube.isCollide(currentPlayer.cube, player.cube)) {
          currentPlayer.alive = false
          player.alive = false

          this.checkEndGame(socket)
          this.updateGameState(ctx, socket)
        }
      })
    })
  }

  stopRendering(ctx) {
    cancelAnimationFrame(this.animationId)
    Screen.clear(ctx, true)
  }

  movePlayerCube(ctx, socket, target) {
    if (!this.playerId || this.state.status !== GameStatus.STARTED) return

    const playerIndex = this.state.players.findIndex(({ id }) => id === this.playerId)
    if (playerIndex === -1) return

    Cube.changeDirection(target, this.state.players[playerIndex].cube)
    this.updateGameState(ctx, socket)
  }

  fireProjectile(ctx, socket) {
    const playerIndex = this.state.players.findIndex(({ id }) => id === this.playerId)
    if (playerIndex === -1) return

    const player = this.state.players[playerIndex]
    const projectileIndex = player.projectiles.findIndex(({ fired }) => !fired)
    if (projectileIndex === -1) return

    Projectile.fire(player.projectiles[projectileIndex], player.cube)
    this.updateGameState(ctx, socket)
  }

  checkEndGame(socket) {
    const alivePlayers = this.state.players.filter(({ alive }) => alive)

    if (alivePlayers.length >= 2) return
    if (alivePlayers.length === 1) this.state.winner = alivePlayers[0].color
    if (alivePlayers.length === 0) this.state.winner = null

    this.state.status = GameStatus.FINISHED
    socket.emit(GameEvents.FINISH_GAME, this.state.winner)
  }

  acceptServerGameState(ctx, state) {
    if (!this.playerId) return

    if (state.players.length === 1 && state.status === GameStatus.FINISHED) {
      this.finishGame(ctx, state)
      return
    }

    const playerIndex = state.players.findIndex(({ id }) => id === this.playerId)
    if (playerIndex === -1) return

    const player = JSON.stringify(this.state.players[playerIndex])

    this.state = Screen.convertFromRelativeViewport(ctx, state)
    this.state.players[playerIndex] = {
      ...JSON.parse(player),
      alive: this.state.players[playerIndex].alive
    }
  }

  updateGameState(ctx, socket) {
    if (this.state.status !== GameStatus.STARTED) return

    socket.emit(
      GameEvents.UPDATE_GAME_STATE,
      JSON.stringify({
        data: {
          state: Screen.convertToRelativeViewport(ctx, this.state)
        }
      })
    )
  }
}
