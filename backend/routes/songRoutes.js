import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import {
  addSong,
  addThumbnail,
  createAlbum,
  deleteSong,
  getAllAlbums,
  getAllSongs,
  getAllSongsByAlbum,
  getSingleSong,
  searchSongs,
} from "../controllers/songControllers.js";

const router = express.Router();

// Admin-only (write) routes — require auth
router.post("/album/new", isAuth, uploadFile, createAlbum);
router.post("/new", isAuth, uploadFile, addSong);
router.post("/:id", isAuth, uploadFile, addThumbnail);
router.delete("/:id", isAuth, deleteSong);

// Public read routes — no auth required
router.get("/album/all", getAllAlbums);
router.get("/all", getAllSongs);
router.get("/search", searchSongs);
router.get("/single/:id", getSingleSong);
router.get("/album/:id", getAllSongsByAlbum);
router.get("/search/:query", searchSongs);

export default router;
