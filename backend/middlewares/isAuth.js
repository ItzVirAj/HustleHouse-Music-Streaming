import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Recommended: use .env for production
const JWT_SECRET = process.env.JWT_SECRET || "your_strong_jwt_secret_key_here_12345!@#";

export const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Fallback: Check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decodedData = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decodedData.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired, please login again" });
    }

    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};
