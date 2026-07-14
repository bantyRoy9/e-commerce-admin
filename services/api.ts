/**
 * api.ts — Main HTTP client for the Thela backend API.
 * Auth tokens come from the IAM system cookies (__Host-at).
 * The IAM cookies are HttpOnly so we can't read them in JS,
 * but withCredentials: true sends them automatically.
 *
 * For routes that need the session proof, import iamApi from lib/iamClient
 * directly. This api.ts is for your OWN backend (orders, products, etc.).
 * If your own backend validates IAM sessions server-side, just include
 * withCredentials so the cookies are forwarded.
 */
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // forwards IAM cookies to your backend
});

// Keep token-based auth for backward compatibility with existing backend
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
