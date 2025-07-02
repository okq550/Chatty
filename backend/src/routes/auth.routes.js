import express from "express";
import {
  signup,
  signin,
  signout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

// Protected Route
router.put("/profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
