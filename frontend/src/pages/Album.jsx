import { useEffect } from "react";
import { SongData } from "../context/Song";
import { useParams } from "react-router-dom";
import { UserData } from "../context/User";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { getSongPlaceholder } from "../utils/songPlaceholder";
import "./Album.css";

const Album = () => {
  const {
    fetchAlbumSong,
    albumSong = [],
    albumData,
    songs,
    setIsPlaying,
    setSelectedSong,
    setIndex,
  } = SongData();

  const params = useParams();
  const { addToPlaylist } = UserData();

  useEffect(() => {
    fetchAlbumSong(params.id);
  }, [fetchAlbumSong, params.id]);

  const handlePlayClick = (id) => {
    const songIndex = songs.findIndex((song) => song._id === id);
    if (songIndex >= 0) setIndex(songIndex);
    setSelectedSong(id);
    setIsPlaying(true);
  };

  const defaultThumbnail = "/images/default-album.jpg";

  return (
    <div className="album-container">
      {albumData ? (
        <>
          <section className="album-header">
            <img
              src={albumData.thumbnail?.url || defaultThumbnail}
              alt={albumData.title || "Album cover"}
              className="album-cover"
              onError={(e) => (e.target.src = defaultThumbnail)}
            />

            <div className="album-info">
              <span className="album-type">Album archive</span>
              <h1 className="album-title">{albumData.title || "Untitled Album"}</h1>
              <p className="album-desc">
                {albumData.description || "No description available for this album."}
              </p>

              <div className="album-summary">
                <div>
                  <strong>{albumSong.length}</strong>
                  <span>Tracks</span>
                </div>
                <div>
                  <strong>HQ</strong>
                  <span>Artwork</span>
                </div>
              </div>
            </div>
          </section>

          <section className="track-panel">
            <div className="track-panel-head">
              <div>
                <span className="track-kicker">Track list</span>
                <h2>Play from anywhere in the set</h2>
              </div>
            </div>

            <div className="song-list-header">
              <p>Track</p>
              <p>Artist</p>
              <p className="desc-col">Description</p>
              <p className="text-center">Actions</p>
            </div>

            {albumSong.length > 0 ? (
              albumSong.map((song, index) => {
                const placeholder = getSongPlaceholder(song.title);

                return (
                  <div className="song-row" key={song._id || index}>
                    <div className="song-index">
                      <span className="index">{String(index + 1).padStart(2, "0")}</span>
                      <img
                        src={song.thumbnail?.url || placeholder}
                        alt={song.title}
                        className="song-thumb"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = placeholder;
                        }}
                      />
                      <div>
                        <span className="song-title">{song.title || "Untitled"}</span>
                        <span className="song-meta-mobile">{song.singer || "Unknown"}</span>
                      </div>
                    </div>
                    <p className="song-artist">{song.singer || "Unknown"}</p>
                    <p className="desc-col song-desc">
                      {song.description || "No description available"}
                    </p>
                    <div className="song-actions">
                      <button onClick={() => addToPlaylist(song._id)} aria-label="Save to playlist">
                        <FaBookmark />
                      </button>
                      <button onClick={() => handlePlayClick(song._id)} aria-label="Play song">
                        <FaPlay />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-message">No songs found in this album.</p>
            )}
          </section>
        </>
      ) : (
        <p className="empty-message">Loading album data...</p>
      )}
    </div>
  );
};

export default Album;
