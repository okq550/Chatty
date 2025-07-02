import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_cookie;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded_token)
      return res.status(401).json({ message: "Unauthorized" });

    // Get the user object without the password field
    const user = await User.findById(decoded_token.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User was not found" });

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
