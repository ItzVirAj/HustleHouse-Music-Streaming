import React, { useState } from "react";
import API from "../api/api";
import { FaPlay } from "react-icons/fa";
import { SongData } from "../context/Song";
import Player from "../components/Player";
import "./Search.css"; // ⬅️ Make sure this file exists
import Navbar from "../components/Navbar";

const Search = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedSong, setIsPlaying } = SongData();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await API.get(`/song/search/${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSongs(res.data.songs || []);
    } catch (err) {
      console.error("Search error", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (songId) => {
    setSelectedSong(songId);
    setIsPlaying(true);
  };

  return (
    <div className="search-container">
      <Navbar />
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="search-results">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div key={song._id} className="song-item">
              <div>
                <p className="song-title">{song.title}</p>
                <p className="song-singer">{song.singer}</p>
              </div>
              <button
                onClick={() => handlePlay(song._id)}
                className="play-button"
              >
                <FaPlay />
              </button>
            </div>
          ))
        ) : (
          !loading &&
          query && <p className="no-result">No songs found for "{query}"</p>
        )}
      </div>

      <div className="player-wrapper">
        <Player />
      </div>
    </div>
  );
};

export default Search;
