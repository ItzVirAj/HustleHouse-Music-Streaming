/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import "./AlbumItem.css";

const AlbumItem = ({ image, name, desc, id }) => {
  const navigate = useNavigate();
  const safeName = name || "Untitled collection";
  const safeDesc = desc || "Curated tracks for the next session.";

  return (
    <div onClick={() => navigate("/album/" + id)} className="album-card-aurora">
      <div className="album-art-wrap">
        <img src={image} alt={safeName} className="album-art-img" />
        <div className="album-play-overlay">
          <div className="album-play-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="album-meta">
        <span className="album-card-tag">Album</span>
        <h3 className="album-card-name">{safeName}</h3>
        <p className="album-card-desc">{safeDesc}</p>
      </div>
    </div>
  );
};

export default AlbumItem;
