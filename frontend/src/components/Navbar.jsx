import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { getUserAvatar } from "../utils/userAvatar";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser, user } = UserData();

  const routeMeta = {
    "/": { eyebrow: "Discover", title: "HustleHouse Radio" },
    "/search": { eyebrow: "Explore", title: "Find your next track" },
    "/playlist": { eyebrow: "Collection", title: "Your saved rotation" },
    "/admin": { eyebrow: "Control", title: "Manage the catalog" },
  };

  const current = routeMeta[location.pathname] || {
    eyebrow: "Now Playing",
    title: "Music with attitude",
  };

  return (
    <header className="navbar-aurora">
      <div className="navbar-left">
        <div className="nav-arrows">
          <button className="nav-arrow-btn" onClick={() => navigate(-1)}>
            <img src={assets.arrow_left} alt="Back" />
          </button>
          <button className="nav-arrow-btn" onClick={() => navigate(+1)}>
            <img src={assets.arrow_right} alt="Forward" />
          </button>
        </div>

        <div className="nav-copy">
          <p>{current.eyebrow}</p>
          <h1>{current.title}</h1>
        </div>
      </div>

      <div className="navbar-right">
        <button className="nav-pill" onClick={() => navigate("/search")}>
          Search
        </button>
        <button className="nav-pill hide-sm" onClick={() => navigate("/playlist")}>
          Playlist
        </button>
        <div className="nav-user-chip hide-sm">
          <button className="nav-user-main" onClick={() => navigate("/profile")}>
            <img
              src={user?.avatar?.url || getUserAvatar(user?.name || "User")}
              alt={user?.name || "Listener"}
              className="nav-user-badge"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getUserAvatar(user?.name || "User");
              }}
            />
            <div>
              <strong>{user?.name || "Listener"}</strong>
              <span>{user?.role === "admin" ? "Admin access" : "Edit profile"}</span>
            </div>
          </button>
          {user?.role === "admin" && (
            <button className="nav-user-admin" onClick={() => navigate("/admin")}>
              Admin
            </button>
          )}
        </div>
        <button className="logout-btn-aurora" onClick={logoutUser}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="hide-sm">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
