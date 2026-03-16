/* eslint-disable react/prop-types */
import API from "../api/api";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UserData } from "./User";

const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const { user, addRecentlyPlayed } = UserData();
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [song, setSong] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [songLoading, setSongLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [trackSourceIds, setTrackSourceIds] = useState([]);
  const [queue, setQueue] = useState([]);
  const [playHistory, setPlayHistory] = useState([]);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const [albumSong, setAlbumSong] = useState([]);
  const [albumData, setAlbumData] = useState(null);

  const songMap = useMemo(
    () => new Map(songs.map((currentSong) => [currentSong._id, currentSong])),
    [songs]
  );

  const queuedSongs = useMemo(
    () => queue.map((id) => songMap.get(id)).filter(Boolean),
    [queue, songMap]
  );

  const favoriteSongs = useMemo(
    () => (user?.favorites || []).map((id) => songMap.get(id)).filter(Boolean),
    [songMap, user?.favorites]
  );

  const recentlyPlayedSongs = useMemo(
    () => (user?.recentlyPlayed || []).map((id) => songMap.get(id)).filter(Boolean),
    [songMap, user?.recentlyPlayed]
  );

  const addAlbum = async (formData, resetForm) => {
    setLoading(true);
    try {
      const { data } = await API.post("/song/album/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      fetchAlbums();
      resetForm?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add album");
    }
    setLoading(false);
  };

  const addSong = async (formData, resetForm) => {
    setLoading(true);
    try {
      const { data } = await API.post("/song/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      fetchSongs();
      resetForm?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add song");
    }
    setLoading(false);
  };

  const addThumbnail = async (id, formData, clearFile) => {
    setLoading(true);
    try {
      const { data } = await API.post(`/song/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      fetchSongs();
      clearFile?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add thumbnail");
    }
    setLoading(false);
  };

  const deleteSong = async (id) => {
    try {
      const { data } = await API.delete(`/song/${id}`);
      toast.success(data.message);
      fetchSongs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete song");
    }
  };

  const fetchSongs = useCallback(async () => {
    try {
      const { data } = await API.get("/song/all");
      const nextSongs = data.songs || data;
      setSongs(nextSongs);

      if (nextSongs.length > 0) {
        setSelectedSong((currentSelectedSong) => currentSelectedSong || nextSongs[0]._id);
        setTrackSourceIds((currentTrackSourceIds) =>
          currentTrackSourceIds.length ? currentTrackSourceIds : nextSongs.map((currentSong) => currentSong._id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchAlbums = useCallback(async () => {
    try {
      const { data } = await API.get("/song/album/all");
      setAlbums(data.albums || data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchAlbumSong = useCallback(async (id) => {
    setSongLoading(true);
    try {
      const { data } = await API.get(`/song/album/${id}`);
      setAlbumSong(data.songs || []);
      setAlbumData(data.album || null);
    } catch (error) {
      console.log(error);
    }
    setSongLoading(false);
  }, []);

  const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;
    try {
      const { data } = await API.get(`/song/single/${selectedSong}`);
      setSong(data);
    } catch (error) {
      console.log(error);
    }
  }, [selectedSong]);

  const setPlaybackSource = useCallback((sourceSongs) => {
    if (!sourceSongs?.length) return;
    setTrackSourceIds(sourceSongs.map((currentSong) => currentSong._id));
  }, []);

  const playSong = useCallback(
    (songId, sourceSongs = null, options = {}) => {
      const {
        forcePlay = true,
        trackHistory = true,
        trackRecent = true,
      } = options;

      const sourceIds =
        sourceSongs?.length ? sourceSongs.map((currentSong) => currentSong._id) : trackSourceIds.length ? trackSourceIds : songs.map((currentSong) => currentSong._id);

      if (sourceSongs?.length) {
        setTrackSourceIds(sourceIds);
      }

      const nextIndex = sourceIds.findIndex((id) => id === songId);
      if (nextIndex >= 0) {
        setIndex(nextIndex);
      }

      if (trackHistory && selectedSong && selectedSong !== songId) {
        setPlayHistory((currentHistory) => [...currentHistory, selectedSong].slice(-50));
      }

      setSelectedSong(songId);
      if (forcePlay) {
        setIsPlaying(true);
      }

      if (trackRecent) {
        addRecentlyPlayed(songId);
      }
    },
    [addRecentlyPlayed, selectedSong, songs, trackSourceIds]
  );

  const addToQueue = useCallback(
    (songId) => {
      if (!songId || songId === selectedSong) return;

      setQueue((currentQueue) => {
        const nextQueue = [songId, ...currentQueue.filter((id) => id !== songId)];
        return nextQueue;
      });
      toast.success("Added to Play Next");
    },
    [selectedSong]
  );

  const removeFromQueue = useCallback((songId) => {
    setQueue((currentQueue) => currentQueue.filter((id) => id !== songId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const nextMusic = useCallback(() => {
    const sourceIds = trackSourceIds.length ? trackSourceIds : songs.map((currentSong) => currentSong._id);
    if (!sourceIds.length) return;

    if (queue.length) {
      const [nextQueuedSong, ...restQueue] = queue;
      setQueue(restQueue);
      playSong(nextQueuedSong, null, { trackHistory: true, trackRecent: true });
      return;
    }

    if (shuffleMode && sourceIds.length > 1) {
      const availableIds = sourceIds.filter((id) => id !== selectedSong);
      const randomSongId = availableIds[Math.floor(Math.random() * availableIds.length)];
      playSong(randomSongId, null, { trackHistory: true, trackRecent: true });
      return;
    }

    if (index < sourceIds.length - 1) {
      playSong(sourceIds[index + 1], null, { trackHistory: true, trackRecent: true });
      return;
    }

    if (repeatMode === "all") {
      playSong(sourceIds[0], null, { trackHistory: true, trackRecent: true });
      return;
    }

    setIsPlaying(false);
  }, [index, playSong, queue, repeatMode, selectedSong, shuffleMode, songs, trackSourceIds]);

  const prevMusic = useCallback(() => {
    if (playHistory.length) {
      const previousSongId = playHistory[playHistory.length - 1];
      setPlayHistory((currentHistory) => currentHistory.slice(0, -1));
      playSong(previousSongId, null, { trackHistory: false, trackRecent: true });
      return;
    }

    const sourceIds = trackSourceIds.length ? trackSourceIds : songs.map((currentSong) => currentSong._id);
    if (!sourceIds.length) return;

    if (index > 0) {
      playSong(sourceIds[index - 1], null, { trackHistory: false, trackRecent: true });
    }
  }, [index, playHistory, playSong, songs, trackSourceIds]);

  const toggleShuffleMode = useCallback(() => {
    setShuffleMode((current) => !current);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((currentMode) => {
      if (currentMode === "off") return "all";
      if (currentMode === "all") return "one";
      return "off";
    });
  }, []);

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, [fetchAlbums, fetchSongs]);

  return (
    <SongContext.Provider
      value={{
        songs,
        albums,
        song,
        selectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        fetchSongs,
        fetchAlbums,
        fetchAlbumSong,
        albumSong,
        albumData,
        fetchSingleSong,
        addAlbum,
        addSong,
        addThumbnail,
        deleteSong,
        playSong,
        nextMusic,
        prevMusic,
        addToQueue,
        removeFromQueue,
        clearQueue,
        queue,
        queuedSongs,
        loading,
        songLoading,
        setIndex,
        setPlaybackSource,
        shuffleMode,
        toggleShuffleMode,
        repeatMode,
        cycleRepeatMode,
        volume,
        setVolume,
        muted,
        setMuted,
        favoriteSongs,
        recentlyPlayedSongs,
      }}
    >
      {children}
      <Toaster />
    </SongContext.Provider>
  );
};

export const SongData = () => useContext(SongContext);
