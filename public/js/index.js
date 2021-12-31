const startButton = document.querySelector("#start-button")
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const socket = io()

let animationId = null
let playerId = null
let state = null

function startGame() {
  state.status = GameStatus.STARTED
  updateGameState()

  GameScreen.displayPanel(false)
  startRendering()
}

function startRendering() {
  animationId = requestAnimationFrame(startRendering)

  GameScreen.clear(ctx, !animationId)

  state.players.forEach((currentPlayer, _, players) => {
    if (!animationId) return
    if (!currentPlayer.alive) return

    Cube.render(ctx, currentPlayer.cube)

    currentPlayer.projectiles.forEach((projectile) => {
      if (!animationId) return
      if (!projectile.fired) return

      Projectile.render(ctx, projectile)

      players.forEach((player) => {
        if (player.id === projectile.createdBy || !player.alive) return

        if (Projectile.isCollide(projectile, player.cube)) {
          player.alive = false

          Projectile.reload(projectile)

          checkEndGame()
          updateGameState()
        }
      })
    })

    players.forEach((player) => {
      if (player.id === currentPlayer.id || !player.alive) return

      if (Cube.isCollide(currentPlayer.cube, player.cube)) {
        currentPlayer.alive = false
        player.alive = false

        checkEndGame()
        updateGameState()
      }
    })
  })
}

function stopRendering() {
  cancelAnimationFrame(animationId)
  GameScreen.clear(ctx, true)
}

function updateGameState() {
  socket.emit(
    GameEvents.GAME_STATE_UPDATE,
    JSON.stringify({
      data: {
        state: GameScreen.convertToRelativeViewport(ctx, state)
      }
    })
  )
}

function checkEndGame() {
  const alivePlayers = state.players.filter((player) => player.alive)

  if (alivePlayers.length >= 2) return

  if (alivePlayers.length === 1) state.winner = alivePlayers[0].id
  if (alivePlayers.length === 0) state.winner = null

  state.status = GameStatus.FINISHED
  GameScreen.displayWinner(true, state.winner)
  stopRendering()
}

function fireProjectile() {
  const playerIndex = state.players.findIndex(({ id }) => id === playerId)
  if (playerIndex === -1) return

  const projectileIndex = state.players[playerIndex].projectiles.findIndex(({ fired }) => !fired)
  if (projectileIndex === -1) return

  const projectile = state.players[playerIndex].projectiles[projectileIndex]
  const cube = state.players[playerIndex].cube

  Projectile.fire(projectile, cube)
  updateGameState()
}

function handleUserConnected(payload) {
  const { data } = JSON.parse(payload)

  playerId = data.playerId
  state = GameScreen.convertFromRelativeViewport(ctx, data.state)

  if (state.status === GameStatus.LOBBY) {
    GameScreen.displayPanel(true)
  }

  if (state.status === GameStatus.STARTED) {
    GameScreen.displayPanel(false)
    startRendering()
  }

  if (state.status === GameStatus.FINISHED) {
    GameScreen.displayWinner(state.winner)
  }
}

function handleGameStateChanged(payload) {
  const { data } = JSON.parse(payload)

  const startedInServer = data.state.status === GameStatus.STARTED
  const startedInLocal = state.status === GameStatus.STARTED

  if (startedInServer && !startedInLocal) {
    GameScreen.displayPanel(false)
    startRendering()
  }

  const finishedInServer = data.state.status === GameStatus.FINISHED
  const finishedInLocal = state.status === GameStatus.FINISHED

  if (finishedInServer && !finishedInLocal) {
    GameScreen.displayWinner(true, data.state.winner)
    stopRendering()
  }

  state = GameScreen.convertFromRelativeViewport(ctx, data.state)
}

function handleResize() {
  state = GameScreen.resize(ctx, state)
}

function handlePlayerMove({ clientX, clientY }) {
  if (state.status !== GameStatus.STARTED) return

  const playerIndex = state.players.findIndex(({ id }) => id === playerId)
  if (playerIndex === -1) return

  const target = { x: clientX, y: clientY }
  const cube = state.players[playerIndex].cube

  Cube.changeDirection(target, cube)
  updateGameState()
}

function handlePlayerAction({ code }) {
  if (state.status !== GameStatus.STARTED) return

  switch (code) {
    case "Space":
      fireProjectile()
      break
  }
}

GameScreen.setup(ctx)

socket.on(GameEvents.USER_CONNECTED, handleUserConnected)
socket.on(GameEvents.GAME_STATE_CHANGED, handleGameStateChanged)

addEventListener("resize", handleResize)
addEventListener("mousemove", handlePlayerMove)
addEventListener("keydown", handlePlayerAction)

startButton.addEventListener("click", () => startGame(socket))
