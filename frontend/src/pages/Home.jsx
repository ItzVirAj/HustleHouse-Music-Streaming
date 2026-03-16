import { SongData } from "../context/Song";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";
import { getSongPlaceholder } from "../utils/songPlaceholder";
import "./Home.css";

const Home = () => {
  const { songs, albums, favoriteSongs, recentlyPlayedSongs } = SongData();
  const defaultThumbnail = "/default-thumbnail.jpg";
  const spotlightAlbum = albums?.[0];

  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="hero-kicker">Editorial rebuild</span>
          <h1>Music for late nights, live sets, and heavy repeat.</h1>
          <p>
            HustleHouse now opens with a sharper mix of featured albums, fast access
            to saved cuts, and a cleaner path from discovery to playback.
          </p>

          <div className="hero-stats">
            <div>
              <strong>{albums?.length || 0}</strong>
              <span>Albums</span>
            </div>
            <div>
              <strong>{songs?.length || 0}</strong>
              <span>Tracks</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Rotation</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <p className="hero-panel-label">Spotlight</p>
          <h2>{spotlightAlbum?.title || "No album loaded yet"}</h2>
          <p>
            {spotlightAlbum?.description ||
              "Drop a fresh album into the catalog and it will surface here."}
          </p>
          <div className="hero-panel-meta">
            <span>Curated cover art</span>
            <span>Fast queue access</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Featured collections</span>
            <h2 className="home-title">Albums worth starting with</h2>
          </div>
        </div>
        <div className="scroll-row">
          {albums?.map((album, i) => (
            <AlbumItem
              key={album._id || i}
              image={album.thumbnail?.url || defaultThumbnail}
              name={album.title}
              desc={album.description}
              id={album._id}
            />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Daily picks</span>
            <h2 className="home-title">Tracks in heavy rotation</h2>
          </div>
        </div>
        <div className="scroll-row">
          {songs?.map((song, i) => (
            <SongItem
              key={song._id || i}
              image={song.thumbnail?.url || getSongPlaceholder(song.title)}
              name={song.title}
              desc={song.description}
              id={song._id}
            />
          ))}
        </div>
      </section>

      {recentlyPlayedSongs?.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <div>
              <span className="section-kicker">History</span>
              <h2 className="home-title">Recently played</h2>
            </div>
          </div>
          <div className="scroll-row">
            {recentlyPlayedSongs.map((song) => (
              <SongItem
                key={song._id}
                image={song.thumbnail?.url || getSongPlaceholder(song.title)}
                name={song.title}
                desc={song.description}
                id={song._id}
              />
            ))}
          </div>
        </section>
      )}

      {favoriteSongs?.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <div>
              <span className="section-kicker">Collection</span>
              <h2 className="home-title">Songs you liked</h2>
            </div>
          </div>
          <div className="scroll-row">
            {favoriteSongs.map((song) => (
              <SongItem
                key={song._id}
                image={song.thumbnail?.url || getSongPlaceholder(song.title)}
                name={song.title}
                desc={song.description}
                id={song._id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
