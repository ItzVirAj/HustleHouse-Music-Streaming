import { UserData } from "../context/User";
import { getUserAvatar } from "../utils/userAvatar";
import "./PlayListCard.css";

const PlayListCard = () => {
  const { user } = UserData();

  return (
    <div className="playlist-card-aurora">
      <div className="playlist-card-top">
        <div className="playlist-card-icon">
          <img
            src={user?.avatar?.url || getUserAvatar(user?.name || "User")}
            alt={user?.name || "Listener"}
            className="playlist-icon-inner playlist-user-avatar"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getUserAvatar(user?.name || "User");
            }}
          />
        </div>
        <span className="playlist-card-tag">Pinned</span>
      </div>

      <div className="playlist-card-info">
        <h3 className="playlist-card-title">My Playlist</h3>
        <p className="playlist-card-meta">
          <span className="meta-dot"></span>
          Playlist • {user?.name || "Listener"}
        </p>
        <p className="playlist-card-copy">Keep your favorite cuts one tap away.</p>
      </div>

      <div className="playlist-card-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
};

export default PlayListCard;
