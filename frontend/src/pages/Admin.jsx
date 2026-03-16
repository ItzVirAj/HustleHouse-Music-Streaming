import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaCloudUploadAlt, FaCompactDisc, FaMusic, FaPhotoVideo } from "react-icons/fa";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
import { getSongPlaceholder } from "../utils/songPlaceholder";
import "./Admin.css";

const createAlbumForm = () => ({
  title: "",
  description: "",
  file: null,
});

const createSongForm = () => ({
  title: "",
  description: "",
  singer: "",
  genre: "",
  mood: "",
  album: "",
  file: null,
});

const Admin = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const {
    albums,
    songs,
    addAlbum,
    addSong,
    addThumbnail,
    deleteSong,
    loading,
  } = SongData();

  const [albumForm, setAlbumForm] = useState(createAlbumForm());
  const [songForm, setSongForm] = useState(createSongForm());
  const [thumbFiles, setThumbFiles] = useState({});
  const [songFilter, setSongFilter] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [navigate, user]);

  const stats = useMemo(
    () => [
      { label: "Albums", value: albums?.length || 0, icon: <FaCompactDisc /> },
      { label: "Songs", value: songs?.length || 0, icon: <FaMusic /> },
      {
        label: "Missing Art",
        value: songs?.filter((song) => !song.thumbnail?.url).length || 0,
        icon: <FaPhotoVideo />,
      },
    ],
    [albums, songs]
  );

  const filteredSongs = useMemo(() => {
    if (!songFilter.trim()) return songs;

    const query = songFilter.toLowerCase();
    return songs.filter(
      (song) =>
        song.title?.toLowerCase().includes(query) ||
        song.singer?.toLowerCase().includes(query) ||
        song.description?.toLowerCase().includes(query)
    );
  }, [songFilter, songs]);

  const handleAlbumInput = (field, value) => {
    setAlbumForm((current) => ({ ...current, [field]: value }));
  };

  const handleSongInput = (field, value) => {
    setSongForm((current) => ({ ...current, [field]: value }));
  };

  const resetAlbumForm = () => setAlbumForm(createAlbumForm());
  const resetSongForm = () => setSongForm(createSongForm());

  const addAlbumHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", albumForm.title);
    formData.append("description", albumForm.description);
    formData.append("file", albumForm.file);
    addAlbum(formData, resetAlbumForm);
  };

  const addSongHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", songForm.title);
    formData.append("description", songForm.description);
    formData.append("singer", songForm.singer);
    formData.append("genre", songForm.genre);
    formData.append("mood", songForm.mood);
    if (songForm.album) {
      formData.append("album", songForm.album);
    }
    formData.append("file", songForm.file);
    addSong(formData, resetSongForm);
  };

  const addThumbnailHandler = (id) => {
    const selectedFile = thumbFiles[id];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    addThumbnail(id, formData, () =>
      setThumbFiles((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      })
    );
  };

  const deleteHandler = (id) => {
    if (confirm("Are you sure you want to delete this song?")) {
      deleteSong(id);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">Control room</span>
          <h1>Shape the catalog without the old cramped dashboard.</h1>
          <p>
            Separate forms, optional album assignment for singles, and a faster pass
            over tracks that still need artwork.
          </p>
        </div>

        <div className="admin-hero-actions">
          <Link to="/" className="admin-link-btn">
            Back Home
          </Link>
          <Link to="/profile" className="admin-link-btn admin-link-soft">
            Edit Profile
          </Link>
        </div>
      </section>

      <section className="admin-stats">
        {stats.map((stat) => (
          <div className="admin-stat-card" key={stat.label}>
            <span className="admin-stat-icon">{stat.icon}</span>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <span>Create album</span>
            <h2>Release a new collection</h2>
          </div>

          <form className="admin-form" onSubmit={addAlbumHandler}>
            <label htmlFor="album-title">Album title</label>
            <input
              id="album-title"
              type="text"
              value={albumForm.title}
              onChange={(e) => handleAlbumInput("title", e.target.value)}
              required
            />

            <label htmlFor="album-description">Description</label>
            <textarea
              id="album-description"
              rows="4"
              value={albumForm.description}
              onChange={(e) => handleAlbumInput("description", e.target.value)}
              required
            />

            <label htmlFor="album-file">Cover art</label>
            <input
              id="album-file"
              type="file"
              accept="image/*"
              onChange={(e) => handleAlbumInput("file", e.target.files?.[0] || null)}
              required
            />

            <button type="submit" disabled={loading || !albumForm.file}>
              {loading ? "Uploading..." : "Publish Album"}
            </button>
          </form>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-head">
            <span>Create song</span>
            <h2>Add a track or standalone single</h2>
          </div>

          <form className="admin-form" onSubmit={addSongHandler}>
            <label htmlFor="song-title">Song title</label>
            <input
              id="song-title"
              type="text"
              value={songForm.title}
              onChange={(e) => handleSongInput("title", e.target.value)}
              required
            />

            <label htmlFor="song-description">Description</label>
            <textarea
              id="song-description"
              rows="4"
              value={songForm.description}
              onChange={(e) => handleSongInput("description", e.target.value)}
              required
            />

            <label htmlFor="song-singer">Artist name</label>
            <input
              id="song-singer"
              type="text"
              value={songForm.singer}
              onChange={(e) => handleSongInput("singer", e.target.value)}
              required
            />

            <div className="admin-inline-fields">
              <div>
                <label htmlFor="song-genre">Genre</label>
                <input
                  id="song-genre"
                  type="text"
                  value={songForm.genre}
                  onChange={(e) => handleSongInput("genre", e.target.value)}
                  placeholder="Afrobeats, House, Hip-Hop..."
                />
              </div>

              <div>
                <label htmlFor="song-mood">Mood</label>
                <input
                  id="song-mood"
                  type="text"
                  value={songForm.mood}
                  onChange={(e) => handleSongInput("mood", e.target.value)}
                  placeholder="Late night, Chill, Hype..."
                />
              </div>
            </div>

            <label htmlFor="song-album">Album association</label>
            <select
              id="song-album"
              value={songForm.album}
              onChange={(e) => handleSongInput("album", e.target.value)}
            >
              <option value="">No album, make it a single</option>
              {albums?.map((album) => (
                <option value={album._id} key={album._id}>
                  {album.title}
                </option>
              ))}
            </select>

            <label htmlFor="song-file">Audio upload</label>
            <input
              id="song-file"
              type="file"
              accept="audio/*"
              onChange={(e) => handleSongInput("file", e.target.files?.[0] || null)}
              required
            />

            <button type="submit" disabled={loading || !songForm.file}>
              {loading ? "Uploading..." : "Publish Song"}
            </button>
          </form>
        </div>
      </section>

      <section className="admin-library">
        <div className="admin-library-head">
          <div>
            <span>Catalog</span>
            <h2>Manage tracks and missing artwork</h2>
          </div>

          <div className="admin-library-tools">
            <input
              type="text"
              placeholder="Filter songs..."
              value={songFilter}
              onChange={(e) => setSongFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-song-list">
          {filteredSongs?.map((song) => (
            <article key={song._id} className="admin-song-card">
              <img
                src={song.thumbnail?.url || getSongPlaceholder(song.title)}
                alt={song.title}
                className="admin-song-thumb"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getSongPlaceholder(song.title);
                }}
              />

              <div className="admin-song-body">
                <div className="admin-song-copy">
                  <h3>{song.title}</h3>
                  <p>{song.singer}</p>
                  <span>{song.description}</span>
                </div>

                <div className="admin-song-meta">
                  <span>
                    Album: {albums?.find((album) => album._id === song.album)?.title || "Single"}
                  </span>
                  {(song.genre || song.mood) && (
                    <div className="admin-song-tags">
                      {song.genre && <span>{song.genre}</span>}
                      {song.mood && <span>{song.mood}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-song-actions">
                {!song.thumbnail?.url && (
                  <div className="admin-thumb-upload">
                    <label className="admin-upload-label">
                      <FaCloudUploadAlt />
                      <span>{thumbFiles[song._id] ? thumbFiles[song._id].name : "Pick cover"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setThumbFiles((current) => ({
                            ...current,
                            [song._id]: e.target.files?.[0] || null,
                          }))
                        }
                      />
                    </label>
                    <button
                      className="admin-upload-btn"
                      onClick={() => addThumbnailHandler(song._id)}
                      disabled={!thumbFiles[song._id] || loading}
                    >
                      Save Art
                    </button>
                  </div>
                )}

                <button className="btn-delete" onClick={() => deleteHandler(song._id)}>
                  <MdDelete />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;
