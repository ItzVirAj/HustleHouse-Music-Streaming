import { Album } from "../models/Album.js";
import { Song } from "../models/Song.js";
import TryCatch from "../utils/TryCatch.js";
import getDataurl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const createAlbum = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description } = req.body;

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Album.create({
    title,
    description,
    thumbnail: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
  });

  res.json({
    message: "Album Added",
  });
});

export const getAllAlbums = TryCatch(async (req, res) => {
  const albums = await Album.find();

  res.json(albums);
});

export const addSong = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description, singer, album, genre, mood } = req.body;

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
    resource_type: "video",
  });

  const payload = {
    title,
    description,
    singer,
    genre: genre?.trim() || "",
    mood: mood?.trim() || "",
    audio: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
  };

  if (album?.trim()) {
    payload.album = album.trim();
  }

  await Song.create(payload);

  res.json({
    message: "Song Added",
  });
});

export const addThumbnail = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Song.findByIdAndUpdate(
    req.params.id,
    {
      thumbnail: {
        id: cloud.public_id,
        url: cloud.secure_url,
      },
    },
    { new: true }
  );

  res.json({
    message: "thumbnail Added",
  });
});

export const getAllSongs = TryCatch(async (req, res) => {
  const songs = await Song.find();

  res.json(songs);
});

export const getAllSongsByAlbum = TryCatch(async (req, res) => {
  const album = await Album.findById(req.params.id);
  const songs = await Song.find({ album: req.params.id });

  res.json({ album, songs });
});

export const deleteSong = TryCatch(async (req, res) => {
  const song = await Song.findById(req.params.id);

  await song.deleteOne();

  res.json({ message: "Song Deleted" });
});

export const getSingleSong = TryCatch(async (req, res) => {
  const song = await Song.findById(req.params.id);

  res.json(song);
});
export const searchSongs = TryCatch(async (req, res) => {
  const query = req.query.q ?? req.params.query ?? "";
  const artist = req.query.artist ?? "";
  const album = req.query.album ?? "";
  const genre = req.query.genre ?? "";
  const mood = req.query.mood ?? "";

  const filters = {};

  if (query.trim()) {
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { singer: { $regex: query, $options: "i" } },
    ];
  }

  if (artist.trim()) {
    filters.singer = { $regex: artist, $options: "i" };
  }

  if (genre.trim()) {
    filters.genre = { $regex: genre, $options: "i" };
  }

  if (mood.trim()) {
    filters.mood = { $regex: mood, $options: "i" };
  }

  if (album.trim()) {
    const matchedAlbums = await Album.find({
      title: { $regex: album, $options: "i" },
    }).select("_id");

    filters.album = {
      $in: matchedAlbums.map((matchedAlbum) => matchedAlbum._id.toString()),
    };
  }

  const songs = await Song.find(filters);

  res.status(200).json({ success: true, songs });
});


