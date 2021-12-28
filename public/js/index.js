const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const game = new Game(ctx)
const socket = io()

game.setup()

socket.on(GameEvents.USER_CONNECTED, game.handleUserConnected)
socket.on(GameEvents.GAME_STATE_CHANGED, game.handleGameStateChanged)

addEventListener("resize", game.handleResize)
