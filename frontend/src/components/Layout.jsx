import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Player from "./Player";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <div className="layout-main">
        <Sidebar />
        <div className="layout-content">
          <Navbar />
          <div className="layout-children">{children}</div>
        </div>
      </div>
      <Player />
    </div>
  );
};

export default Layout;
