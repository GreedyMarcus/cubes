const socket = io()
const game = new Game()

socket.on(GameEvents.USER_CONNECTED, game.handleUserConnected)
socket.on(GameEvents.GAME_STATE_CHANGED, game.handleGameStateChanged)
