/**
 * api.ts — Main HTTP client for the Thela backend API.
 * Uses IAM session proofs for authentication.
 * Session proofs are automatically added via the getProof() function.
 */
import axios from "axios";
import { getProof } from "@/lib/iamClient";

const API_CLIENT_ID = process.env.NEXT_PUBLIC_IAM_CLIENT_ID || "";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // forwards IAM cookies to your backend
});

// Add IAM session proof to requests
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const proof = getProof();
    if (proof) {
      config.headers["x-session-proof"] = proof;
    }
    config.headers["x-client-id"] = API_CLIENT_ID;
  }
  return config;
});

// Handle 401 responses and trigger session expired event
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Trigger IAM session expired event
        window.dispatchEvent(new CustomEvent("iam:session-expired"));
        // Redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
