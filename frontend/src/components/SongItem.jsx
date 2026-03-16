/* eslint-disable react/prop-types */
import { FaBookmark, FaHeart, FaPlay, FaPlus, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
import { getSongPlaceholder } from "../utils/songPlaceholder";
import "./SongItem.css";

const SongItem = ({ image, name, desc, id }) => {
  const { addToPlaylist, toggleFavorite, user } = UserData();
  const { songs, playSong, addToQueue } = SongData();
  const saved = Boolean(user?.playlist?.includes(id));
  const liked = Boolean(user?.favorites?.includes(id));

  const savetoPlaylistHandler = () => {
    addToPlaylist(id);
  };

  const handlePlay = () => {
    playSong(id, songs);
  };

  const fallbackImage = getSongPlaceholder(name);

  return (
    <div className="song-card-aurora">
      <div className="song-visual">
        <img
          src={image || fallbackImage}
          className="song-cover"
          alt={name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
        />
        <span className="song-card-tag">Track</span>

        <div className="song-top-actions">
          <button
            className={`song-save-btn ${liked ? "saved" : ""}`}
            onClick={() => toggleFavorite(id)}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button
            className={`song-save-btn ${saved ? "saved" : ""}`}
            onClick={savetoPlaylistHandler}
            aria-label={saved ? "Remove from library" : "Save to library"}
          >
            {saved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>

        <div className="song-overlay">
          <button className="song-play-btn" onClick={handlePlay}>
            <FaPlay />
          </button>
          <button
            className="song-queue-btn"
            onClick={() => addToQueue(id)}
            aria-label="Add to Play Next"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="song-details">
        <p className="song-card-name">{name}</p>
        <p className="song-card-desc">{desc}</p>
      </div>
    </div>
  );
};

export default SongItem;
