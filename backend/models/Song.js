import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    singer: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: "",
    },
    mood: {
      type: String,
      default: "",
    },
    thumbnail: {
      id: String,
      url: String,
    },
    audio: {
      id: String,
      url: String,
    },

    album: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.model("Song", schema);
