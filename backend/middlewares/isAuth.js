import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Choose ONE of these options:

// Option 1: Hardcoded secret (development only)
const JWT_SECRET = "your_strong_jwt_secret_key_here_12345!@#";

// Option 2: Environment variable (production)
// import dotenv from "dotenv";
// dotenv.config();

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({  // Changed from 403 to 401
        success: false,
        message: "Please login first"
      });
    }

    // Use the same secret consistently
    const decodedData = jwt.verify(token, JWT_SECRET);  // Or process.env.JWT_SECRET for Option 2

    if (!decodedData) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    req.user = await User.findById(decodedData.id);

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    
    // Specific error handling
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again"
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};