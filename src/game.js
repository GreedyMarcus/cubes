const { Player } = require("./entities/player")

const GameEvents = Object.freeze({
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  USER_CONNECTED: "user-connected",
  GAME_STATE_CHANGED: "game-state-changed"
})

class Game {
  constructor() {
    this.state = {
      players: []
    }
  }

  connectPlayer(socket) {
    const player = new Player(this.generatePlayerId())

    this.state.players.push(player)

    socket.emit(
      GameEvents.USER_CONNECTED,
      JSON.stringify({
        data: {
          playerId: player.id,
          state: this.state
        }
      })
    )

    this.broadcastGameStateChanged(socket)

    return player.id
  }

  disconnectPlayer(socket, playerId) {
    const playerIndex = this.state.players.findIndex(({ id }) => id === playerId)
    if (playerIndex !== -1) {
      this.state.players.splice(playerIndex, 1)
      this.broadcastGameStateChanged(socket)
    }
  }

  broadcastGameStateChanged(socket) {
    socket.broadcast.emit(
      GameEvents.GAME_STATE_CHANGED,
      JSON.stringify({
        data: {
          state: this.state
        }
      })
    )
  }

  generatePlayerId() {
    return Math.random().toString(36).slice(2)
  }
}

module.exports = { GameEvents, Game }
