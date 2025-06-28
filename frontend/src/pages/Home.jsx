/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";
import "./Home.css";

const Home = () => {
  const { songs, albums } = SongData();
  const defaultThumbnail = "/default-thumbnail.jpg";

  return (
    <Layout>
      <div className="home-container">
        <div className="home-banner">
          <div className="banner-text">
            <h1 className="banner-title">Step into the Sound</h1>
            <p className="banner-subtitle">
              Raw. Real. Unfiltered. Discover what's trending right now in the underground & beyond.
            </p>
          </div>
        </div>

        {/* Featured Charts */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="home-title">🎵 Featured Charts</h2>
            <a href="#" className="see-all">See all</a>
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

        {/* Today's Biggest Hits */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="home-title">🔥 Today's Biggest Hits</h2>
            <a href="#" className="see-all">See all</a>
          </div>
          <div className="scroll-row">
            {songs?.map((song, i) => (
              <SongItem
                key={song._id || i}
                image={song.thumbnail?.url || defaultThumbnail}
                name={song.title}
                desc={song.description}
                id={song._id}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
