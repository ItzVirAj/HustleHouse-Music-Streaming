import React, { useState } from "react";
import { UserData } from "../context/User";
import { Link, useNavigate } from "react-router-dom";
import { SongData } from "../context/Song";
import { MdDelete } from "react-icons/md";
import "./Admin.css";

const Admin = () => {
  const { user } = UserData();
  const {
    albums,
    songs,
    addAlbum,
    loading,
    addSong,
    addThumbnail,
    deleteSong,
  } = SongData();

  const navigate = useNavigate();
  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [singer, setSinger] = useState("");
  const [album, setAlbum] = useState("");

  const fileChangeHandler = (e) => setFile(e.target.files[0]);

  const addAlbumHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    addAlbum(formData, setTitle, setDescription, setFile);
  };

  const addSongHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("singer", singer);
    formData.append("album", album);
    formData.append("file", file);
    addSong(formData, setTitle, setDescription, setFile, setSinger, setAlbum);
  };

  const addThumbnailHandler = (id) => {
    const formData = new FormData();
    formData.append("file", file);
    addThumbnail(id, formData, setFile);
  };

  const deleteHandler = (id) => {
    if (confirm("Are you sure you want to delete this song?")) {
      deleteSong(id);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <Link to="/" className="btn-home">Go to Home</Link>
      </div>

      <div className="form-grid">
        {/* Add Album */}
        <div className="glass-card">
          <h2 className="section-title">Add Album</h2>
          <form onSubmit={addAlbumHandler}>
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <label>Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <label>Thumbnail</label>
            <input type="file" accept="image/*" onChange={fileChangeHandler} required />
            <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Add Album"}</button>
          </form>
        </div>

        {/* Add Song */}
        <div className="glass-card">
          <h2 className="section-title">Add Song</h2>
          <form onSubmit={addSongHandler}>
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <label>Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <label>Singer</label>
            <input type="text" value={singer} onChange={(e) => setSinger(e.target.value)} required />
            <label>Choose Album</label>
            <select value={album} onChange={(e) => setAlbum(e.target.value)} required>
              <option value="">Select</option>
              {albums?.map((a, i) => (
                <option value={a._id} key={i}>{a.title}</option>
              ))}
            </select>
            <label>Audio</label>
            <input type="file" accept="audio/*" onChange={fileChangeHandler} required />
            <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Add Song"}</button>
          </form>
        </div>
      </div>

      {/* Songs List */}
      <h3 className="section-title">Your Songs</h3>
      <div className="songs-list">
        {songs?.map((song, i) => (
          <div key={i} className="song-card glass-card">
            {song.thumbnail ? (
              <img
                src={song.thumbnail.url}
                className="song-thumb"
                alt={song.title}
              />
            ) : (
              <div className="thumb-upload">
                <input type="file" onChange={fileChangeHandler} />
                <button onClick={() => addThumbnailHandler(song._id)}>Add Thumbnail</button>
              </div>
            )}

            <div className="song-details">
              <p><strong>Name</strong>  - {song.title}</p>
              <p><strong>Desc</strong>  - {song.description}</p>
              <p><strong>Album</strong> - {albums?.find(a => a._id === song.album)?.title || "Not Assigned"}</p>
            </div>

            <button className="btn-delete" onClick={() => deleteHandler(song._id)}>
              <MdDelete />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
