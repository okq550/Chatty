// CommonJS Style
// const express = require("express");

// ES6 Style
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js"
import path from "path"
import { fileURLToPath } from "url"

import connectDB from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"

dotenv.config()
const PORT = process.env.PORT || 5001

// Add a middleware to allow accessing json in requests
app.use(express.json())
// Add cookie parser middleware
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

// Add Auth route
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/chats", chatRoutes)

app.get("/ping", (req, res) => {
  return res.send("success")
})

// Serve the frontend as static
// if (process.env.NODE_ENV === "production") {
//   const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
//   const __dirname = path.dirname(__filename); // get the name of the directory

//   console.log(path.join(__dirname, "../frontend/dist"));

//   app.use(express.static(path.join(__dirname, "../frontend/dist")))

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   })
// }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __dist = path.join(__dirname, "../../frontend", "dist")
const __index = path.join(__dist, "index.html")

console.log(`__filename: ${__filename}`)
console.log(`__dirname: ${__dirname}`)
console.log(`__dist: ${__dist}`)
console.log(`__index: ${__index}`)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname))

  app.get("*", (req, res) => {
    res.sendFile(__index)
  })
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB()
})
