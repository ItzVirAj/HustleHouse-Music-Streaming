/* eslint-disable react/prop-types */
import API from "../api/api";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(
    name,
    email,
    password,
    navigate,
    fetchSongs,
    fetchAlbums
  ) {
    setBtnLoading(true);
    try {
      const { data } = await API.post("/user/register", {
        name,
        email,
        password,
      });

      // ✅ Save token to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchSongs();
      fetchAlbums();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password, navigate, fetchSongs, fetchAlbums) {
    setBtnLoading(true);
    try {
      const { data } = await API.post("/user/login", {
        email,
        password,
      });

      // ✅ Save token to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchSongs();
      fetchAlbums();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await API.get("/user/me");

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  async function logoutUser() {
    try {
      const { data } = await API.get("/user/logout");

      // ✅ Clear token from localStorage
      localStorage.removeItem("token");

      toast.success(data.message);
      window.location.reload();
    } catch (error) {
      // ✅ Even if API fails, still clear local state
      localStorage.removeItem("token");
      toast.error(error.response?.data?.message || "Logout failed");
      window.location.reload();
    }
  }

  async function addToPlaylist(id) {
    try {
      const { data } = await API.post("/user/song/" + id);

      toast.success(data.message);
      if (data.user) {
        setUser(data.user);
      } else {
        fetchUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update playlist");
    }
  }

  async function toggleFavorite(id) {
    try {
      const { data } = await API.post("/user/favorite/" + id);
      toast.success(data.message);
      if (data.user) {
        setUser(data.user);
      } else {
        fetchUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update favorites");
    }
  }

  async function addRecentlyPlayed(id) {
    try {
      const { data } = await API.post("/user/recent/" + id);
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateProfile({ name, file }) {
    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("file", file);
      }

      const { data } = await API.put("/user/profile", formData);
      setUser(data.user);
      toast.success(data.message);
      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    } finally {
      setBtnLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        user,
        isAuth,
        btnLoading,
        loading,
        loginUser,
        logoutUser,
        addToPlaylist,
        toggleFavorite,
        addRecentlyPlayed,
        updateProfile,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
