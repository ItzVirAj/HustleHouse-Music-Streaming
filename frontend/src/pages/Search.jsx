import { useMemo, useState } from "react";
import API from "../api/api";
import { FaHeart, FaPlay, FaPlus, FaRegHeart, FaSearch } from "react-icons/fa";
import { SongData } from "../context/Song";
import { UserData } from "../context/User";
import { getSongPlaceholder } from "../utils/songPlaceholder";
import "./Search.css";

const createFilters = () => ({
  q: "",
  artist: "",
  album: "",
  genre: "",
  mood: "",
});

const Search = () => {
  const [filters, setFilters] = useState(createFilters());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { albums, playSong, addToQueue } = SongData();
  const { user, toggleFavorite } = UserData();

  const resultLabel = useMemo(() => {
    const hasFilters = Object.values(filters).some(Boolean);
    if (!hasFilters) return "Search the catalog with song, artist, album, genre, or mood";
    if (loading) return "Searching...";
    return `${results.length} result${results.length === 1 ? "" : "s"} found`;
  }, [filters, loading, results.length]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleSearch = async () => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value?.trim?.() || value)
    );

    if (!Object.keys(params).length) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.get("/song/search", { params });
      setResults(data.songs || []);
    } catch (error) {
      console.error("Search error", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters(createFilters());
    setResults([]);
  };

  return (
    <div className="search-container">
      <section className="search-shell">
        <div className="search-copy">
          <span className="search-kicker">Search</span>
          <h1>Search by artist, album, genre, or mood.</h1>
          <p>
            The search page now supports filtered discovery and lets you play,
            queue, and like tracks without leaving the results.
          </p>
        </div>

        <div className="search-filter-grid">
          <div className="search-input-wrap search-input-main">
            <FaSearch />
            <input
              type="text"
              className="search-input"
              placeholder="Song title or keyword"
              value={filters.q}
              onChange={(e) => updateFilter("q", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <input
            type="text"
            className="search-field"
            placeholder="Artist"
            value={filters.artist}
            onChange={(e) => updateFilter("artist", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <select
            className="search-field"
            value={filters.album}
            onChange={(e) => updateFilter("album", e.target.value)}
          >
            <option value="">All albums</option>
            {albums?.map((album) => (
              <option value={album.title} key={album._id}>
                {album.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="search-field"
            placeholder="Genre"
            value={filters.genre}
            onChange={(e) => updateFilter("genre", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <input
            type="text"
            className="search-field"
            placeholder="Mood"
            value={filters.mood}
            onChange={(e) => updateFilter("mood", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="search-actions">
          <button onClick={handleSearch} className="search-button">
            {loading ? "Searching..." : "Search"}
          </button>
          <button onClick={clearFilters} className="search-clear">
            Clear
          </button>
        </div>
      </section>

      <section className="search-results">
        <div className="search-results-head">
          <span>{resultLabel}</span>
        </div>

        {results.length > 0 ? (
          results.map((song) => {
            const liked = Boolean(user?.favorites?.includes(song._id));
            return (
              <div key={song._id} className="search-song-item">
                <div className="search-song-main">
                  <img
                    src={song.thumbnail?.url || getSongPlaceholder(song.title)}
                    alt={song.title}
                    className="search-song-thumb"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getSongPlaceholder(song.title);
                    }}
                  />
                  <div className="search-song-copy">
                    <p className="song-title">{song.title}</p>
                    <p className="song-singer">{song.singer || "Unknown artist"}</p>
                    <div className="search-meta-pills">
                      {song.genre && <span>{song.genre}</span>}
                      {song.mood && <span>{song.mood}</span>}
                    </div>
                  </div>
                </div>

                <p className="search-song-desc">{song.description || "No description"}</p>

                <div className="search-row-actions">
                  <button
                    onClick={() => toggleFavorite(song._id)}
                    className={`search-icon-button ${liked ? "active" : ""}`}
                    aria-label={liked ? "Remove from favorites" : "Add to favorites"}
                  >
                    {liked ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button
                    onClick={() => addToQueue(song._id)}
                    className="search-icon-button"
                    aria-label="Add to Play Next"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => playSong(song._id, results)}
                    className="play-button"
                    aria-label="Play song"
                  >
                    <FaPlay />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          !loading &&
          Object.values(filters).some(Boolean) && (
            <p className="no-result">No songs matched the current filters.</p>
          )
        )}
      </section>
    </div>
  );
};

export default Search;
