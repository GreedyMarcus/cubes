const express = require("express")
const path = require("path")
const http = require("http")

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

// Serve static content
app.use(express.static(path.join(__dirname, "..", "public")))

// Start server
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
