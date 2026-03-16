import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Fallback: Authorization header
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // ✅ DEBUG — remove after fixing
    console.log("🔐 Token received:", token.substring(0, 20) + "...");
    console.log("🔑 Verifying with secret:", process.env.JWT_SECRET?.substring(0, 10) + "...");

    // ✅ NO FALLBACK — use exact same env variable
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Token verified, user ID:", decodedData.id);

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
    console.error("❌ Auth error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again",
      });
    }

    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};