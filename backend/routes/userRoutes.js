import express from "express";
import {
  addRecentlyPlayedSong,
  loginUser,
  logoutUser,
  myProfile,
  registerUser,
  saveToPlaylist,
  toggleFavoriteSong,
  updateProfile,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/logout", isAuth, logoutUser);
router.post("/song/:id", isAuth, saveToPlaylist);
router.post("/favorite/:id", isAuth, toggleFavoriteSong);
router.post("/recent/:id", isAuth, addRecentlyPlayedSong);
router.put("/profile", isAuth, uploadFile, updateProfile);

export default router;
