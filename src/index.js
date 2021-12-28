const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const { Game, GameEvents } = require("./game")

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const game = new Game()

// Serve static content
app.use(express.static(path.join(__dirname, "..", "public")))

// Start server
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})

// Handle a socket connection request from the web client
io.on(GameEvents.CONNECTION, (socket) => {
  const playerId = game.connectPlayer(socket)

  socket.on(GameEvents.DISCONNECT, () => {
    game.disconnectPlayer(socket, playerId)
  })

  socket.on(GameEvents.GAME_STATE_UPDATE, (payload) => {
    game.updateState(socket, payload)
  })
})
