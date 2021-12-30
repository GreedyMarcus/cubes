const startButton = document.querySelector("#start-button")
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const socket = io()

let animationId = null
let playerId = null
let state = null

function startGame() {
  state.status = GameStatus.STARTED
  socket.emit(GameEvents.GAME_STARTED)

  GameScreen.displayPanel(false)
  startRendering()
}

function startRendering() {
  animationId = requestAnimationFrame(startRendering)

  GameScreen.clear(ctx)

  state.players.forEach((currentPlayer, _, players) => {
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

          emitUpdateGameState()
        }
      })
    })

    players.forEach((player) => {
      if (player.id === currentPlayer.id || !player.alive) return

      if (Cube.isCollide(currentPlayer.cube, player.cube)) {
        currentPlayer.alive = false
        player.alive = false

        emitUpdateGameState()
      }
    })
  })
}

function emitUpdateGameState() {
  socket.emit(
    GameEvents.GAME_STATE_UPDATE,
    JSON.stringify({
      data: {
        state: GameScreen.convertToRelativeViewport(ctx, state)
      }
    })
  )
}

function fireProjectile() {
  const playerIndex = state.players.findIndex(({ id }) => id === playerId)
  if (playerIndex === -1) return

  const projectileIndex = state.players[playerIndex].projectiles.findIndex(({ fired }) => !fired)
  if (projectileIndex === -1) return

  const projectile = state.players[playerIndex].projectiles[projectileIndex]
  const cube = state.players[playerIndex].cube

  Projectile.fire(projectile, cube)
  emitUpdateGameState()
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
}

function handleGameStateChanged(payload) {
  const { data } = JSON.parse(payload)

  const startedInServer = data.state.status === GameStatus.STARTED
  const startedInLocal = state.status === GameStatus.STARTED

  state = GameScreen.convertFromRelativeViewport(ctx, data.state)

  if (startedInServer && !startedInLocal) {
    GameScreen.displayPanel(false)
    startRendering()
  }
}

function handleResize() {
  state = GameScreen.resize(ctx, state)
}

function handlePlayerMove({ clientX, clientY }) {
  if (state.status === GameStatus.STARTED) {
    const playerIndex = state.players.findIndex(({ id }) => id === playerId)
    if (playerIndex === -1) return

    const target = { x: clientX, y: clientY }
    const cube = state.players[playerIndex].cube

    Cube.changeDirection(target, cube)
    emitUpdateGameState()
  }
}

function handlePlayerAction({ code }) {
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
