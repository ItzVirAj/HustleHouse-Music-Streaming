import React, { useEffect, useState } from "react";
import { FaBookmark, FaPlay, FaRegBookmark } from "react-icons/fa";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
import "./SongItem.css";

const SongItem = ({ image, name, desc, id }) => {
  const [saved, setSaved] = useState(false);
  const { addToPlaylist, user } = UserData();
  const { setSelectedSong, setIsPlaying } = SongData();

  useEffect(() => {
    if (user?.playlist?.includes(id)) {
      setSaved(true);
    }
  }, [user]);

  const savetoPlaylistHandler = () => {
    setSaved(!saved);
    addToPlaylist(id);
  };

  return (
    <div className="song-card">
      <div className="song-image-wrapper">
        <img src={image} className="song-image" alt={name} />
        <div className="song-actions">
          <button
            className="action-button"
            onClick={() => {
              setSelectedSong(id);
              setIsPlaying(true);
            }}
          >
            <FaPlay />
          </button>
          <button className="action-button" onClick={savetoPlaylistHandler}>
            {saved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      </div>
      <p className="song-name">{name}</p>
      <p className="song-desc">{desc}</p>
    </div>
  );
};

export default SongItem;
