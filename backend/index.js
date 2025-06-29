// api/index.js (MOVE to `api/index.js`)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "../database/db.js"; // adjust if needed
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// CORS middleware
app.use(
  cors({
    origin: "https://hustle-house-front.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
import userRoutes from "../routes/userRoutes.js";
import songRoutes from "../routes/songRoutes.js";

app.use("/api/user", userRoutes);
app.use("/api/song", songRoutes);

// Connect DB once when deployed (only once in cold start)
let isDbConnected = false;
app.use(async (req, res, next) => {
  if (!isDbConnected) {
    await connectDb();
    isDbConnected = true;
  }
  next();
});

// Required by Vercel: export the Express app as handler
export default app;
