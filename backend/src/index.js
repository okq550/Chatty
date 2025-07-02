// CommonJS Style
// const express = require("express");

// ES6 Style
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js"

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
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB()
})
