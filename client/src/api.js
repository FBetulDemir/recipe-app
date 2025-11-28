// src/api.js
import axios from 'axios';

// Use Render in production, localhost in dev
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://recipe-app-8t4e.onrender.com');

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Optional: export for convenience
export { API_BASE };
