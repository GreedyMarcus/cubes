const { Player } = require("./entities/player")

const GameEvents = Object.freeze({
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  USER_CONNECTED: "user-connected",
  GAME_STATE_UPDATE: "game-state-update",
  GAME_STATE_CHANGED: "game-state-changed"
})

const GameStatus = Object.freeze({
  LOBBY: "lobby",
  STARTED: "started",
  FINISHED: "finished"
})

class Game {
  constructor(io) {
    this.io = io
    this.state = {
      status: GameStatus.LOBBY,
      winner: null,
      players: []
    }
  }

  setup() {
    // Handle a socket connection request from the web client
    this.io.on(GameEvents.CONNECTION, (socket) => {
      const playerId = this.connectPlayer(socket)

      socket.on(GameEvents.DISCONNECT, () => this.disconnectPlayer(socket, playerId))
      socket.on(GameEvents.GAME_STATE_UPDATE, (payload) => this.updateState(socket, payload))
    })
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
    if (playerIndex === -1) return

    this.state.players.splice(playerIndex, 1)
    this.broadcastGameStateChanged(socket)
  }

  updateState(socket, payload) {
    const { data } = JSON.parse(payload)

    this.state = data.state
    this.broadcastGameStateChanged(socket)
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

module.exports = { Game }
