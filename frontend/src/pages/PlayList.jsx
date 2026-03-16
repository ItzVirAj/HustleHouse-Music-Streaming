import { useEffect, useState } from "react";
import { SongData } from "../context/Song";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { UserData } from "../context/User";
import { getSongPlaceholder } from "../utils/songPlaceholder";
import "./Playlist.css";

const PlayList = () => {
  const { user, addToPlaylist } = UserData();
  const { songs, setSelectedSong, setIsPlaying, setIndex } = SongData();
  const [myPlaylist, setMyPlaylist] = useState([]);

  useEffect(() => {
    if (songs && user && Array.isArray(user.playlist)) {
      const filteredSongs = songs.filter((song) =>
        user.playlist.includes(song._id.toString())
      );
      setMyPlaylist(filteredSongs);
    }
  }, [songs, user]);

  const playHandler = (id) => {
    const songIndex = songs.findIndex((song) => song._id === id);
    if (songIndex >= 0) setIndex(songIndex);
    setSelectedSong(id);
    setIsPlaying(true);
  };

  return (
    <div className="playlist-container">
      <section className="playlist-banner">
        <img
          src={
            myPlaylist?.[0]?.thumbnail?.url ||
            getSongPlaceholder(myPlaylist?.[0]?.title || "Playlist")
          }
          className="playlist-cover"
          alt="Playlist"
        />

        <div className="playlist-info">
          <span className="playlist-type">Personal archive</span>
          <h1 className="playlist-title">{user?.name || "Your"} playlist</h1>
          <p className="playlist-desc">
            Your saved songs now live in a cleaner queue with direct play and remove
            actions.
          </p>

          <div className="playlist-summary">
            <div>
              <strong>{myPlaylist.length}</strong>
              <span>Saved songs</span>
            </div>
            <div>
              <strong>Instant</strong>
              <span>Play access</span>
            </div>
          </div>
        </div>
      </section>

      <section className="playlist-table">
        <div className="playlist-header">
          <p>Track</p>
          <p>Artist</p>
          <p className="desc-col">Description</p>
          <p className="text-center">Actions</p>
        </div>

        {myPlaylist.length > 0 ? (
          myPlaylist.map((song, i) => (
            <div key={song._id || i} className="playlist-item">
              <div className="playlist-index">
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <img
                  src={song.thumbnail?.url || getSongPlaceholder(song.title)}
                  alt={song.title}
                  className="song-thumb"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getSongPlaceholder(song.title);
                  }}
                />
                <div>
                  <span className="song-title">{song.title}</span>
                  <span className="song-meta-mobile">{song.singer}</span>
                </div>
              </div>
              <p className="song-artist">{song.singer}</p>
              <p className="desc-col song-desc">{song.description || "No description"}</p>
              <div className="playlist-actions">
                <button onClick={() => addToPlaylist(song._id)} aria-label="Remove from playlist">
                  <FaBookmark />
                </button>
                <button onClick={() => playHandler(song._id)} aria-label="Play song">
                  <FaPlay />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">Your playlist is empty right now.</p>
        )}
      </section>
    </div>
  );
};

export default PlayList;
