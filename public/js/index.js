const panel = document.querySelector("#panel")
const startButton = document.querySelector("#start-button")
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const socket = io()

let animationId = null
let playerId = null
let state = null

function setup() {
  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight
}

function startGame() {
  state.status = GameStatus.STARTED
  socket.emit(GameEvents.GAME_STARTED)

  hidePanel()
  startRendering()
}

function startRendering() {
  animationId = requestAnimationFrame(startRendering)

  clearScreen()

  state.players.forEach(({ cube }) => {
    Cube.render(ctx, cube)
  })
}

function clearScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function convertFromRelativeViewport(state) {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      cube: {
        ...player.cube,
        size: ctx.canvas.width * player.cube.size,
        position: {
          x: ctx.canvas.width * player.cube.position.x,
          y: ctx.canvas.height * player.cube.position.y
        }
      }
    }))
  }
}

function convertToRelativeViewport(state) {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      cube: {
        ...player.cube,
        size: (1 / ctx.canvas.width) * player.cube.size,
        position: {
          x: (1 / ctx.canvas.width) * player.cube.position.x,
          y: (1 / ctx.canvas.height) * player.cube.position.y
        }
      }
    }))
  }
}

function handleUserConnected(payload) {
  const { data } = JSON.parse(payload)

  playerId = data.playerId
  state = convertFromRelativeViewport(data.state)

  if (state.status === GameStatus.LOBBY) {
    showPanel()
  }

  if (state.status === GameStatus.STARTED) {
    hidePanel()
    startRendering()
  }
}

function handleGameStateChanged(payload) {
  const { data } = JSON.parse(payload)

  const startedInServer = data.state.status === GameStatus.STARTED
  const startedInLocal = state.status === GameStatus.STARTED

  state = convertFromRelativeViewport(data.state)

  if (startedInServer && !startedInLocal) {
    hidePanel()
    startRendering()
  }
}

function handleResize() {
  const temp = convertToRelativeViewport(state)

  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight

  state = convertFromRelativeViewport(temp)
}

function handlePlayerMove({ clientX, clientY }) {
  const playerIndex = state.players.findIndex(({ id }) => id === playerId)
  if (playerIndex !== -1) {
    const angle = Math.atan2(
      clientY - state.players[playerIndex].cube.position.y,
      clientX - state.players[playerIndex].cube.position.x
    )

    state.players[playerIndex].cube.velocity.x = Math.cos(angle)
    state.players[playerIndex].cube.velocity.y = Math.sin(angle)

    if (state.status === GameStatus.STARTED) {
      socket.emit(
        GameEvents.GAME_STATE_UPDATE,
        JSON.stringify({
          data: {
            state: convertToRelativeViewport(state)
          }
        })
      )
    }
  }
}

function showPanel() {
  panel.style.visibility = "visible"
}

function hidePanel() {
  panel.style.visibility = "hidden"
}

setup()

socket.on(GameEvents.USER_CONNECTED, handleUserConnected)
socket.on(GameEvents.GAME_STATE_CHANGED, handleGameStateChanged)

addEventListener("resize", handleResize)
addEventListener("mousemove", handlePlayerMove)

startButton.addEventListener("click", () => startGame(socket))
