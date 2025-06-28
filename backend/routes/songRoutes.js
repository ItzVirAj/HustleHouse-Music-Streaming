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

router.post("/album/new", isAuth, uploadFile, createAlbum);
router.get("/album/all", isAuth, getAllAlbums);
router.post("/new", isAuth, uploadFile, addSong);
router.post("/:id", isAuth, uploadFile, addThumbnail);
router.get("/single/:id", isAuth, getSingleSong);
router.delete("/:id", isAuth, deleteSong);
router.get("/all", isAuth, getAllSongs);
router.get("/album/:id", isAuth, getAllSongsByAlbum);
router.get("/search/:query", isAuth, searchSongs);

export default router;
