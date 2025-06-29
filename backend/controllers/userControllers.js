import { User } from "../models/User.js";
import TryCatch from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

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

  const token = generateToken(user._id, res); // ✅ also return this

  res.status(201).json({
    user,
    token, // ✅ send to frontend
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

  const token = generateToken(user._id, res); // ✅ also return this

  res.status(200).json({
    user,
    token, // ✅ send to frontend
    message: "User LoggedIN",
  });
});

// ✅ Get Profile
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

// ✅ Logout
export const logoutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 }); // clears cookie
  res.json({
    message: "Logged Out Successfully",
  });
});

// ✅ Save/Unsave song to playlist
export const saveToPlaylist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const songId = req.params.id;

  if (user.playlist.includes(songId)) {
    user.playlist = user.playlist.filter(id => id.toString() !== songId);
    await user.save();
    return res.json({ message: "Removed from playlist" });
  }

  user.playlist.push(songId);
  await user.save();
  return res.json({ message: "Added to playlist" });
});
