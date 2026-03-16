import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaHeart,
  FaPause,
  FaPlay,
  FaRegHeart,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { HiOutlineQueueList } from "react-icons/hi2";
import { MdOutlineRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";
import { SongData } from "../context/Song";
import { UserData } from "../context/User";
import { getSongPlaceholder } from "../utils/songPlaceholder";
import "./Player.css";

const formatTime = (time) => {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const Player = () => {
  const {
    song,
    fetchSingleSong,
    isPlaying,
    setIsPlaying,
    nextMusic,
    prevMusic,
    repeatMode,
    cycleRepeatMode,
    shuffleMode,
    toggleShuffleMode,
    queuedSongs,
    removeFromQueue,
    clearQueue,
    playSong,
    volume,
    setVolume,
    muted,
    setMuted,
  } = SongData();
  const { user, toggleFavorite } = UserData();

  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queueOpen, setQueueOpen] = useState(false);

  useEffect(() => {
    fetchSingleSong();
  }, [fetchSingleSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [muted, volume, song?._id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncDuration = () => setDuration(audio.duration || 0);
    const syncProgress = () => setProgress(audio.currentTime || 0);
    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      nextMusic();
    };

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("timeupdate", syncProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("timeupdate", syncProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [nextMusic, repeatMode, song?._id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.audio?.url) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, setIsPlaying, song?._id, song?.audio?.url]);

  const handlePlayPause = () => {
    if (!audioRef.current || !song?.audio?.url) return;
    setIsPlaying((current) => !current);
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    if (nextVolume > 0 && muted) {
      setMuted(false);
    }
  };

  const handleProgressChange = (event) => {
    if (!audioRef.current) return;
    const nextTime = Number(event.target.value);
    audioRef.current.currentTime = nextTime;
    setProgress(nextTime);
  };

  const handleMuteToggle = () => {
    setMuted((current) => !current);
  };

  const liked = Boolean(song?._id && user?.favorites?.includes(song._id));
  const placeholder = getSongPlaceholder(song?.title || "Song");
  const repeatLabel = useMemo(() => {
    if (repeatMode === "one") return "Repeat one";
    if (repeatMode === "all") return "Repeat all";
    return "Repeat off";
  }, [repeatMode]);

  if (!song) return null;

  return (
    <div className="player-aurora">
      <div className="player-progress-top">
        <input
          type="range"
          className="progress-track"
          min="0"
          max={duration || 0}
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          style={{
            background: `linear-gradient(to right, #ff7a2f ${duration ? (progress / duration) * 100 : 0}%, rgba(255,255,255,0.08) ${duration ? (progress / duration) * 100 : 0}%)`,
          }}
        />
      </div>

      <div className="player-inner">
        <div className="player-song-info">
          <div className={`player-album-art ${isPlaying ? "spinning" : ""}`}>
            <img
              src={song.thumbnail?.url || placeholder}
              alt={song.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = placeholder;
              }}
            />
          </div>

          <div className="player-text">
            <p className="player-title">{song.title}</p>
            <p className="player-artist">{song.singer || song.description || "Unknown artist"}</p>
            <div className="player-time-row">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <button
            className={`player-like-btn ${liked ? "active" : ""}`}
            onClick={() => toggleFavorite(song._id)}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="player-controls-center">
          {song.audio?.url && <audio ref={audioRef} src={song.audio.url} preload="metadata" />}

          <button
            className={`ctrl-btn ${shuffleMode ? "active" : ""}`}
            onClick={toggleShuffleMode}
            aria-label={shuffleMode ? "Disable shuffle" : "Enable shuffle"}
          >
            <MdShuffle />
          </button>
          <button className="ctrl-btn" onClick={prevMusic} aria-label="Previous song">
            <GrChapterPrevious />
          </button>
          <button className="ctrl-play" onClick={handlePlayPause} aria-label="Play or pause">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="ctrl-btn" onClick={nextMusic} aria-label="Next song">
            <GrChapterNext />
          </button>
          <button
            className={`ctrl-btn ${repeatMode !== "off" ? "active" : ""}`}
            onClick={cycleRepeatMode}
            aria-label={repeatLabel}
            title={repeatLabel}
          >
            {repeatMode === "one" ? <MdRepeatOne /> : <MdOutlineRepeat />}
          </button>
        </div>

        <div className="player-extras">
          <div className="volume-control">
            <button className="player-mute-btn" onClick={handleMuteToggle} aria-label="Mute toggle">
              {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              className="volume-track"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              style={{
                background: `linear-gradient(to right, #64d2c1 ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.08) ${(muted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>

          <div className="player-queue-wrap">
            <button
              className={`player-queue-btn ${queueOpen ? "active" : ""}`}
              onClick={() => setQueueOpen((current) => !current)}
              aria-label="Toggle queue"
            >
              <HiOutlineQueueList />
              <span>{queuedSongs.length}</span>
            </button>

            {queueOpen && (
              <div className="player-queue-panel">
                <div className="player-queue-head">
                  <strong>Play Next</strong>
                  {queuedSongs.length > 0 && (
                    <button className="player-queue-clear" onClick={clearQueue}>
                      Clear
                    </button>
                  )}
                </div>

                {queuedSongs.length > 0 ? (
                  <div className="player-queue-list">
                    {queuedSongs.map((queuedSong) => (
                      <div className="player-queue-item" key={queuedSong._id}>
                        <button
                          className="player-queue-song"
                          onClick={() => playSong(queuedSong._id, null, { forcePlay: true })}
                        >
                          <span>{queuedSong.title}</span>
                          <small>{queuedSong.singer || "Unknown artist"}</small>
                        </button>
                        <button
                          className="player-queue-remove"
                          onClick={() => removeFromQueue(queuedSong._id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="player-queue-empty">No songs queued yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
