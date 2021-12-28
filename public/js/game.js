const GameEvents = Object.freeze({
  USER_CONNECTED: "user-connected",
  GAME_STATE_CHANGED: "game-state-changed"
})

class Game {
  constructor() {
    this.playerId = null
    this.state = null
  }

  handleUserConnected(payload) {
    const { data } = JSON.parse(payload)

    this.playerId = data.playerId
    this.state = data.state
  }

  handleGameStateChanged(payload) {
    const { data } = JSON.parse(payload)

    this.state = data.state
  }
}
