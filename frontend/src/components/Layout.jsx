/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Player from "./Player";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="aurora-app">
      <div className="aurora-bg-orb aurora-orb-1"></div>
      <div className="aurora-bg-orb aurora-orb-2"></div>
      <div className="aurora-bg-orb aurora-orb-3"></div>

      <div className="aurora-layout">
        <Sidebar />
        <main className="aurora-main">
          <Navbar />
          <div className="aurora-content">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      <Player />
    </div>
  );
};

export default Layout;
