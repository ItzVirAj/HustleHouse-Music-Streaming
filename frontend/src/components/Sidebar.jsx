import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: assets.home_icon, path: "/" },
    { label: "Search", icon: assets.search_icon, path: "/search" },
    { label: "Playlist", icon: assets.stack_icon, path: "/playlist" },
  ];

  return (
    <aside className="sidebar-aurora">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <span>HH</span>
          </div>
          <div>
            <p className="brand-kicker">Station</p>
            <h1 className="brand-name">HustleHouse</h1>
          </div>
        </div>

        <div className="sidebar-feature">
          <span>Fresh drop</span>
          <h2>Streetwave set</h2>
          <p>Quick discovery and cleaner playback flow.</p>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Navigate</p>
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <div className="nav-icon-wrap">
                <img src={item.icon} alt={item.label} />
              </div>
              <span>{item.label}</span>
              {location.pathname === item.path && <div className="active-indicator" />}
            </div>
          ))}
        </nav>

        <div className="sidebar-library">
          <div className="library-header">
            <div className="library-title">
              <div className="nav-icon-wrap">
                <img src={assets.stack_icon} alt="Library" />
              </div>
              <span>Your Library</span>
            </div>
            <button className="library-add-btn" onClick={() => navigate("/playlist")}>
              <img src={assets.plus_icon} alt="Open playlist" />
            </button>
          </div>

          <div className="library-list" onClick={() => navigate("/playlist")}>
            <PlayListCard />
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
