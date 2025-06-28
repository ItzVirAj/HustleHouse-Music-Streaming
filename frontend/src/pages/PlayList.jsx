import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import { assets } from "../assets/assets";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { UserData } from "../context/User";
import "./Playlist.css"; // Import custom CSS

const PlayList = ({ user }) => {
  const { songs, setSelectedSong, setIsPlaying } = SongData();
  const { addToPlaylist } = UserData();
  const [myPlaylist, setMyPlaylist] = useState([]);

  useEffect(() => {
    if (songs && user && Array.isArray(user.playlist)) {
      const filteredSongs = songs.filter((e) =>
        user.playlist.includes(e._id.toString())
      );
      setMyPlaylist(filteredSongs);
    }
  }, [songs, user]);

  const playHandler = (id) => {
    setSelectedSong(id);
    setIsPlaying(true);
  };

  const togglePlaylist = (id) => {
    addToPlaylist(id);
  };

  return (
    <Layout>
      <div className="playlist-container">
        <div className="playlist-banner glass-card">
          <img
            src={
              myPlaylist && myPlaylist[0]
                ? myPlaylist[0].thumbnail.url
                : "https://via.placeholder.com/250"
            }
            className="playlist-cover"
            alt="Playlist"
          />
          <div className="playlist-info">
            <p className="playlist-type">Playlist</p>
            <h2 className="playlist-title">{user.name}'s Playlist</h2>
            <h4 className="playlist-desc">Your favorite songs curated here</h4>
            <img
              src={assets.spotify_logo}
              className="spotify-logo"
              alt="Spotify Logo"
            />
          </div>
        </div>

        <div className="playlist-header">
          <p>#</p>
          <p>Artist</p>
          <p className="desc-col">Description</p>
          <p className="text-center">Actions</p>
        </div>
        <hr className="divider" />

        {myPlaylist?.map((e, i) => (
          <div key={i} className="playlist-item glass-hover">
            <div className="playlist-index">
              <span className="index">{i + 1}</span>
              <img src={e.thumbnail.url} alt="" className="song-thumb" />
              <span className="song-title">{e.title}</span>
            </div>
            <p className="song-artist">{e.singer}</p>
            <p className="desc-col song-desc">{e.description.slice(0, 30)}...</p>
            <div className="playlist-actions">
              <button onClick={() => togglePlaylist(e._id)}>
                <FaBookmark />
              </button>
              <button onClick={() => playHandler(e._id)}>
                <FaPlay />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default PlayList;
