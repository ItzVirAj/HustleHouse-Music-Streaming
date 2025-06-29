// backend/api/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "../backend/database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(
  cors({
    origin: "https://hustle-house-front.vercel.app", // frontend domain
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect DB once
let isDbConnected = false;
app.use(async (req, res, next) => {
  if (!isDbConnected) {
    await connectDb();
    isDbConnected = true;
  }
  next();
});

// Routes
import userRoutes from "../backend/routes/userRoutes.js";
import songRoutes from "../backend/routes/songRoutes.js";

app.use("/api/user", userRoutes);
app.use("/api/song", songRoutes);

// Default health route
app.get("/api/health", (req, res) => {
  res.send("API is up 🚀");
});

export default app;
