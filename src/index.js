const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const { Game } = require("./game")

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const game = new Game(socketio(server))

// Serve static content
app.use(express.static(path.join(__dirname, "..", "public")))

// Start server
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`))

game.setup()
