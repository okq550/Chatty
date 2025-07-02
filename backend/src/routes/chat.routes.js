import express from "express";
import {
  getUsers,
  getChats,
  sendChat
} from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

// Protected Routes
router.get("/users", protectRoute, getUsers);
router.get("/users/:id", protectRoute, getChats);
router.post("/users/:id", protectRoute, sendChat);

export default router;
