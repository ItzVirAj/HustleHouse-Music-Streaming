/* eslint-disable no-unused-vars */
import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { UserData } from "../context/User";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = UserData();

  return (
    <div className="sidebar">
      {/* Top Nav Links */}
      <div className="sidebar-section sidebar-menu">
        <div className="sidebar-link" onClick={() => navigate("/")}>
          <img src={assets.home_icon} alt="Home" />
          <span>Home</span>
        </div>
        <div className="sidebar-link" onClick={() => navigate("/search")}>
          <img src={assets.search_icon} alt="Search" />
          <span>Search</span>
        </div>
      </div>

      {/* Library & Playlist */}
      <div className="sidebar-section sidebar-library">
        <div className="sidebar-library-header">
          <div className="library-left">
            <img src={assets.stack_icon} alt="Library" />
            <span>Your Library</span>
          </div>
          <div className="library-right">
            <img src={assets.arrow_icon} alt="Arrow" />
            <img src={assets.plus_icon} alt="Plus" />
          </div>
        </div>

        <div onClick={() => navigate("/playlist")}>
          <PlayListCard />
        </div>

        {user && user.role === "admin" && (
          <button className="admin-btn" onClick={() => navigate("/admin")}>
            Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
