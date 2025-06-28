import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { UserData } from "../context/User";
import { FaBookmark, FaPlay } from "react-icons/fa";
import "./Album.css"; // custom style file

const Album = () => {
  const {
    fetchAlbumSong,
    albumSong = [],
    albumData,
    setIsPlaying,
    setSelectedSong,
  } = SongData();

  const params = useParams();
  const { addToPlaylist } = UserData();

  useEffect(() => {
    fetchAlbumSong(params.id);
  }, [fetchAlbumSong, params.id]);

  const handlePlayClick = (id) => {
    setSelectedSong(id);
    setIsPlaying(true);
  };

  const handleSaveToPlaylist = (id) => {
    addToPlaylist(id);
  };

  const defaultThumbnail = "/images/default-album.jpg";

  return (
    <Layout>
      <div className="album-container">
        {albumData ? (
          <>
            {/* Album Header */}
            <div className="album-header glass-card">
              <img
                src={albumData.thumbnail?.url || defaultThumbnail}
                alt={albumData.title || "Album Cover"}
                className="album-cover"
                onError={(e) => (e.target.src = defaultThumbnail)}
              />
              <div className="album-info">
                <p className="album-type">Album</p>
                <h2 className="album-title">{albumData.title || "Untitled Album"}</h2>
                <p className="album-desc">
                  {albumData.description || "No description available"}
                </p>
                <img src={assets.spotify_logo} className="spotify-logo" alt="Spotify" />
              </div>
            </div>

            {/* Song List Header */}
            <div className="song-list-header">
              <p># Title</p>
              <p>Artist</p>
              <p className="desc-col">Description</p>
              <p className="text-center">Actions</p>
            </div>
            <hr className="divider" />

            {/* Song List */}
            {albumSong.length > 0 ? (
              albumSong.map((song, index) => (
                <div
                  className="song-row glass-hover"
                  key={song._id || index}
                >
                  <div className="song-index">
                    <span className="index">{index + 1}</span>
                    <img
                      src={song.thumbnail?.url || defaultThumbnail}
                      alt={song.title}
                      className="song-thumb"
                      onError={(e) => (e.target.src = defaultThumbnail)}
                    />
                    <span className="song-title">{song.title || "Untitled"}</span>
                  </div>
                  <p className="song-artist">{song.singer || "Unknown"}</p>
                  <p className="desc-col song-desc">
                    {song.description ? `${song.description.slice(0, 30)}...` : "No description"}
                  </p>
                  <div className="song-actions">
                    <button
                      onClick={() => handleSaveToPlaylist(song._id)}
                      aria-label="Save to playlist"
                    >
                      <FaBookmark />
                    </button>
                    <button
                      onClick={() => handlePlayClick(song._id)}
                      aria-label="Play song"
                    >
                      <FaPlay />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No songs found in this album</p>
            )}
          </>
        ) : (
          <p className="empty-message">Loading album data...</p>
        )}
      </div>
    </Layout>
  );
};

export default Album;
