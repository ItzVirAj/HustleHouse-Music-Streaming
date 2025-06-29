// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://hustle-house-api.vercel.app/", // 🔁 replace with your actual backend URL
  withCredentials: true, // if your backend uses cookies/auth
});

export default API;
