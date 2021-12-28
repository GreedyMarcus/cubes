const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Serve static content
app.use(express.static(path.join(__dirname, "..", "public")))

// Start server
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`))

// Handle a socket connection request from the web client
io.on("connection", (socket) => {
  console.log("new socket connection")
})
