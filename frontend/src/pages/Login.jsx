/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
import "./Login.css"; // <-- Add this line

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser, btnLoading } = UserData();
  const { fetchSongs, fetchAlbums } = SongData();

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, password, navigate, fetchSongs, fetchAlbums);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-title">Hustle House</h1>
        <p className="welcome-text">Welcome back to The Jam</p>

        <form className="login-form" onSubmit={submitHandler}>


          <input
            type="email"
            placeholder="Your email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="login-button" disabled={btnLoading}>
            {btnLoading ? "Please Wait..." : "Log In"}
          </button>

          <p className="signup-text">
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>

      <div className="login-right">
        <div className="info-box">
          <h2>Uncover raw sounds from the streets to the stars.</h2>
          <p>
            At Hustle House, we spotlight the unheard, the underground, and the next wave of legends. Step into a world where every beat tells a story.
          </p>
        </div>

        <div className="top-buttons">
          <Link to="/register" className="btn-outline">Sign Up</Link>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
