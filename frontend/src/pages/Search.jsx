// src/pages/Search.jsx
import React, { useState } from "react";
import API from "../api/axios"; // ✅ adjust path if needed


const Search = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
const res = await API.get(`/song/search/${query}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


      console.log("Search response:", res.data);
      setSongs(res.data.songs || []);
    } catch (err) {
      console.error("Search error", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-white">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-[#1e1e1e] text-white"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div>
        {songs.length > 0 ? (
          songs.map((song) => (
            <div key={song._id} className="mb-2 p-2 border-b border-gray-700">
              <p className="font-bold">{song.title}</p>
              <p className="text-sm text-gray-400">{song.singer}</p>
            </div>
          ))
        ) : (
          !loading &&
          query && (
            <p className="text-gray-400">No songs found for "{query}"</p>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
