import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], //Sockets will be created and accepted from localhost:5173 which is the frontend application.
  },
})

// Online users
const usersSocketMap = {} // Object format {userId, socketId}

export function getReceiverSocketId(userId) {
  return usersSocketMap[userId]
}

io.on("connection", (socket) => {
  console.log(`User is connected ${socket.id}`)

  // Fetch the userId from the socket which was passed by the client.
  const userId = socket.handshake.query.userId
  if (userId) usersSocketMap[userId] = socket.id

  // Used to send events to all connected clients.
  io.emit("getOnlineUsers", Object.keys(usersSocketMap)) // Send an event called 'getOnlineUsers' to all socket connected clients.

  console.log("usersSocketMap", usersSocketMap)

  socket.on("disconnect", () => {
    console.log(`User is disconnected ${socket.id}`)
    delete usersSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(usersSocketMap))
  })
})

export { io, app, server }
