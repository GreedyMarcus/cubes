const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const game = new Game(ctx)
const socket = io()

game.setup()

socket.on(GameEvents.USER_CONNECTED, (payload) => game.handleUserConnected(payload))
socket.on(GameEvents.GAME_STATE_CHANGED, (payload) => game.handleGameStateChanged(payload))

addEventListener("resize", () => game.handleResize())
addEventListener("mousemove", (e) => game.handlePlayerMove(socket, e.clientX, e.clientY))
