/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
import "./Register.css"; // <-- New CSS for styling

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { registerUser, btnLoading } = UserData();
  const { fetchSongs, fetchAlbums } = SongData();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    registerUser(name, email, password, navigate, fetchSongs, fetchAlbums);
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1 className="register-title">Join Hustle House</h1>
        <p className="register-text">Create your account and drop the beat.</p>

        <form className="register-form" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Your Name"
            className="register-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email or Username"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="register-button" disabled={btnLoading}>
            {btnLoading ? "Please Wait..." : "Register"}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>

      <div className="register-right">
        <div className="info-box">
          <h2>Level up your sound and your story.</h2>
          <p>
            Hustle House is the home of rising legends. Join the movement, upload your vibe, and let the world hear what hustle sounds like.
          </p>
        </div>

        <div className="top-buttons">
          <Link to="/login" className="btn-outline">Log In</Link>
          
        </div>
      </div>
    </div>
  );
};

export default Register;
