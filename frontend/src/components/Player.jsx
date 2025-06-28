import React, { useEffect, useRef, useState } from "react";
import { SongData } from "../context/Song";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";
import "./Player.css";

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setIsPlaying,
    nextMusic,
    prevMusic,
  } = SongData();

  useEffect(() => {
    fetchSingleSong();
  }, [selectedSong]);

  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetaData = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setProgress(audio.currentTime);

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  return (
    song && (
      <div className="player-container">
        <div className="player-left">
          <img
            src={song.thumbnail ? song.thumbnail.url : "https://via.placeholder.com/50"}
            className="player-thumbnail"
            alt={song.title}
          />
          <div className="player-song-details">
            <p className="song-title">{song.title}</p>
            <p className="song-desc">{song.description?.slice(0, 30)}...</p>
          </div>
        </div>

        <div className="player-center">
          {song.audio && (
            <audio ref={audioRef} src={song.audio.url} autoPlay={isPlaying} />
          )}
          <input
            type="range"
            className="progress-bar"
            min="0"
            max="100"
            value={(progress / duration) * 100 || 0}
            onChange={handleProgressChange}
          />
          <div className="player-controls">
            <span onClick={prevMusic} className="control-button">
              <GrChapterPrevious />
            </span>
            <button className="play-pause" onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <span onClick={nextMusic} className="control-button">
              <GrChapterNext />
            </span>
          </div>
        </div>

        <div className="player-right">
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    )
  );
};

export default Player;
