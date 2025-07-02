import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt_cookie", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Milliseconds
    httpOnly: true, // Cookie is only accessable using http only, Not JS to prevent XSS attacks (cross-site) scripting attacks
    sameSite: "strict", // Only accept the cookie from the same site to prevent CSRF (cross-site) forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export default generateToken;
