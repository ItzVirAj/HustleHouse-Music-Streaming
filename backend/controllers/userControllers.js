import { User } from "../models/User.js";
import TryCatch from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import getDataurl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

// ✅ Register
export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "User Already Exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  // ✅ Generate token — sets cookie AND returns token string
  const token = generateToken(user._id, res);

  res.status(201).json({
    user,
    token,   // ✅ Frontend saves this to localStorage
    message: "User Registered",
  });
});

// ✅ Login
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "No User Exists",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(400).json({
      message: "Wrong Password",
    });
  }

  // ✅ Generate token — sets cookie AND returns token string
  const token = generateToken(user._id, res);

  res.status(200).json({
    user,
    token,   // ✅ Frontend saves this to localStorage
    message: "User LoggedIN",
  });
});

// ✅ Get Profile
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

export const updateProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name } = req.body;

  if (name?.trim()) {
    user.name = name.trim();
  }

  if (req.file) {
    if (user.avatar?.id) {
      await cloudinary.v2.uploader.destroy(user.avatar.id);
    }

    const fileUrl = getDataurl(req.file);
    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    user.avatar = {
      id: cloud.public_id,
      url: cloud.secure_url,
    };
  }

  await user.save();

  res.json({
    message: "Profile updated",
    user,
  });
});

// ✅ Logout
export const logoutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({
    message: "Logged Out Successfully",
  });
});

// ✅ Save/Unsave song to playlist
export const saveToPlaylist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const songId = req.params.id;

  if (user.playlist.includes(songId)) {
    user.playlist = user.playlist.filter((id) => id.toString() !== songId);
    await user.save();
    return res.json({ message: "Removed from playlist", user });
  }

  user.playlist.push(songId);
  await user.save();
  return res.json({ message: "Added to playlist", user });
});

export const toggleFavoriteSong = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const songId = req.params.id;

  if (user.favorites.includes(songId)) {
    user.favorites = user.favorites.filter((id) => id.toString() !== songId);
    await user.save();
    return res.json({ message: "Removed from favorites", user });
  }

  user.favorites.push(songId);
  await user.save();
  return res.json({ message: "Added to favorites", user });
});

export const addRecentlyPlayedSong = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const songId = req.params.id;

  user.recentlyPlayed = [
    songId,
    ...user.recentlyPlayed.filter((id) => id.toString() !== songId),
  ].slice(0, 20);

  await user.save();

  return res.json({
    message: "Recently played updated",
    user,
  });
});
