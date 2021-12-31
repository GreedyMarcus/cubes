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
    const player = new Player()
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

    Player.restoreColor(this.state.players[playerIndex].color)

    this.state.players.splice(playerIndex, 1)
    this.broadcastGameStateChanged(socket)
  }

  updateState(socket, payload) {
    const { data } = JSON.parse(payload)

    if (this.state.status === GameStatus.FINISHED) {
      Player.restoreAllColors()

      this.state = {
        status: GameStatus.STARTED,
        winner: null,
        players: this.state.players.map(({ id }) => new Player(id))
      }

      this.broadcastGameStateChanged(socket, true)
    } else {
      this.state = data.state
      this.broadcastGameStateChanged(socket, false)
    }
  }

  broadcastGameStateChanged(socket, toAllPlayer) {
    const payload = JSON.stringify({
      data: {
        state: this.state
      }
    })

    if (toAllPlayer) {
      this.io.emit(GameEvents.GAME_STATE_CHANGED, payload)
    } else {
      socket.broadcast.emit(GameEvents.GAME_STATE_CHANGED, payload)
    }
  }
}

module.exports = { Game }
