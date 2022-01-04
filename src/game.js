const { Player } = require("./entities/player")

const GAME_PLAYER_LIMIT = 6

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
  constructor(io) {
    this.io = io
    this.state = {
      status: GameStatus.LOBBY,
      winner: null,
      players: []
    }
  }

  setup() {
    this.io.on(GameEvents.CONNECTION, (socket) => {
      const playerId = this.connectPlayer(socket)

      socket.on(GameEvents.DISCONNECT, () => this.disconnectPlayer(socket, playerId))
      socket.on(GameEvents.START_GAME, () => this.startGame())
      socket.on(GameEvents.FINISH_GAME, (winner) => this.finishGame(winner))
      socket.on(GameEvents.UPDATE_GAME_STATE, (state) => this.updateGameState(socket, state))
    })
  }

  connectPlayer(socket) {
    if (this.state.players.length === GAME_PLAYER_LIMIT) {
      socket.emit(GameEvents.PLAYER_LIMIT_REACHED)
      return
    }

    if (this.state.players.length >= 2 && this.state.status === GameStatus.STARTED) {
      socket.emit(GameEvents.GAME_ALREADY_STARTED)
      return
    }

    const player = new Player()
    this.state.players.push(player)

    this.io.emit(
      GameEvents.PLAYER_CONNECTED,
      JSON.stringify({
        data: {
          playerId: player.id,
          state: this.state
        }
      })
    )

    return player.id
  }

  disconnectPlayer(socket, playerId) {
    const playerIndex = this.state.players.findIndex(({ id }) => id === playerId)
    if (playerIndex === -1) return

    Player.restoreColor(this.state.players[playerIndex].color)
    this.state.players.splice(playerIndex, 1)

    // Finish game if all players disconnected except one
    if (this.state.players.length === 1 && this.state.status !== GameStatus.FINISHED) {
      this.state.status = GameStatus.FINISHED
      this.state.winner = this.state.players[0].color
    }

    // Go back to lobby if all players disconnected
    if (!this.state.players.length && this.state.status !== GameStatus.LOBBY) {
      this.state.status = GameStatus.LOBBY
      this.state.winner = null
    }

    socket.broadcast.emit(
      GameEvents.GAME_STATE_CHANGED,
      JSON.stringify({
        data: {
          state: this.state
        }
      })
    )
  }

  startGame() {
    if (this.state.status === GameStatus.STARTED) return

    Player.restoreAllColors()

    this.state = {
      status: GameStatus.STARTED,
      winner: null,
      players: this.state.players.map(({ id }) => new Player(id))
    }

    this.io.emit(
      GameEvents.GAME_STARTED,
      JSON.stringify({
        data: {
          state: this.state
        }
      })
    )
  }

  finishGame(winner) {
    if (this.state.status === GameStatus.FINISHED) return

    this.state.status = GameStatus.FINISHED
    this.state.winner = winner

    this.io.emit(
      GameEvents.GAME_FINISHED,
      JSON.stringify({
        data: {
          state: this.state
        }
      })
    )
  }

  updateGameState(socket, state) {
    const { data } = JSON.parse(state)

    this.state = data.state

    socket.broadcast.emit(
      GameEvents.GAME_STATE_CHANGED,
      JSON.stringify({
        data: {
          state: this.state
        }
      })
    )
  }
}

module.exports = { Game }
