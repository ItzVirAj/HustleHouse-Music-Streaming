import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import "./Navbar.css"; // 🆕 CSS

const Navbar = () => {
  const navigate = useNavigate();
  const { logoutUser } = UserData();

  return (
    <div className="navbar-container">
      <div className="navbar-top">
        <div className="nav-controls">
          <img
            src={assets.arrow_left}
            className="nav-arrow"
            alt="Back"
            onClick={() => navigate(-1)}
          />
          <img
            src={assets.arrow_right}
            className="nav-arrow"
            alt="Forward"
            onClick={() => navigate(+1)}
          />
        </div>

        <div className="nav-actions">
          <button className="logout-button" onClick={logoutUser}>
            Logout
          </button>
        </div>
      </div>

      <div className="navbar-tabs">
        <button className="tab active">All</button>
        <a
          href="https://github.com/ItzVirAj"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="tab hide-on-small">Github</button>
        </a>

        <button
          className="tab show-on-small"
          onClick={() => navigate("/playlist")}
        >
          Playlist
        </button>
      </div>
    </div>
  );
};

export default Navbar;
