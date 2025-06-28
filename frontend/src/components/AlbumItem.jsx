import React from "react";
import { useNavigate } from "react-router-dom";
import "./AlbumItem.css"; // ✅ Link the new CSS

const AlbumItem = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/album/" + id)}
      className="album-card"
    >
      <div className="album-thumbnail">
        <img src={image} alt={name} />
      </div>
      <div className="album-info">
        <p className="album-name">{name.slice(0, 16)}{name.length > 16 && "..."}</p>
        <p className="album-desc">{desc.slice(0, 22)}{desc.length > 22 && "..."}</p>
      </div>
    </div>
  );
};

export default AlbumItem;
