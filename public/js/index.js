const startButton = document.querySelector("#start-button")
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const socket = io()
const game = new Game()

Screen.fitWindow(ctx)

socket.on(GameEvents.PLAYER_CONNECTED, handlePlayerConnected)
socket.on(GameEvents.PLAYER_LIMIT_REACHED, handlePlayerLimitReached)
socket.on(GameEvents.GAME_STARTED, handleGameStarted)
socket.on(GameEvents.GAME_FINISHED, handleGameFinished)
socket.on(GameEvents.GAME_STATE_CHANGED, handleGameStateChanged)
socket.on(GameEvents.GAME_ALREADY_STARTED, handleGameAlreadyStarted)

window.addEventListener("resize", handleResizeScreen)
window.addEventListener("mousemove", handlePlayerMove)
window.addEventListener("keydown", handlePlayerAction)
startButton.addEventListener("click", handleStartClick)

function handlePlayerConnected(payload) {
  const { data } = JSON.parse(payload)
  game.connectPlayer(ctx, socket, data.playerId, data.state)
}

function handlePlayerLimitReached() {
  Screen.displayMessage(true, "There are too many players at the moment")
  Screen.displayPanel(true)
  Screen.hideStartButton()
}

function handleGameStarted(payload) {
  const { data } = JSON.parse(payload)
  game.startGame(ctx, socket, data.state)
}

function handleGameFinished(payload) {
  const { data } = JSON.parse(payload)
  game.finishGame(ctx, data.state)
}

function handleGameStateChanged(payload) {
  const { data } = JSON.parse(payload)
  game.acceptServerGameState(ctx, data.state)
}

function handleGameAlreadyStarted() {
  Screen.displayMessage(true, "The game is already started")
  Screen.displayPanel(true)
  Screen.hideStartButton()
}

function handleResizeScreen() {
  Screen.resize(ctx, game.state)
}

function handlePlayerMove({ clientX, clientY }) {
  const target = { x: clientX, y: clientY }
  game.movePlayerCube(ctx, socket, target)
}

function handlePlayerAction({ code }) {
  if (!game.playerId || game.state.status !== GameStatus.STARTED) return

  switch (code) {
    case "Space":
      game.fireProjectile(ctx, socket)
      break
  }
}

function handleStartClick() {
  socket.emit(GameEvents.START_GAME)
}
