/**
 * API client for making authenticated requests to your backend microservices.
 * Routes through Next.js API proxy which adds IAM authentication headers.
 */
import axios from "axios";
import { getProof } from "./iamClient";

const API_CLIENT_ID = process.env.NEXT_PUBLIC_IAM_CLIENT_ID || "";

// Create axios instance for backend API calls
export const apiClient = axios.create({
  baseURL: "/api/proxy", // Routes through Next.js API proxy
  headers: {
    "Content-Type": "application/json",
  },
});

// Add session proof to requests
apiClient.interceptors.request.use((config) => {
  const proof = getProof();
  if (proof) {
    config.headers["x-session-proof"] = proof;
  }
  config.headers["x-client-id"] = API_CLIENT_ID;
  return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired, trigger logout
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("iam:session-expired"));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Typed API methods for common operations
 */
export const api = {
  // Products
  products: {
    getAll: () => apiClient.get("/products"),
    getById: (id: string) => apiClient.get(`/products/${id}`),
    create: (data: any) => apiClient.post("/products", data),
    update: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/products/${id}`),
  },

  // Categories
  categories: {
    getAll: () => apiClient.get("/categories"),
    getById: (id: string) => apiClient.get(`/categories/${id}`),
    create: (data: any) => apiClient.post("/categories", data),
    update: (id: string, data: any) => apiClient.put(`/categories/${id}`, data),
    delete: (id: string) => apiClient.delete(`/categories/${id}`),
  },

  // Orders
  orders: {
    getAll: () => apiClient.get("/orders"),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    updateStatus: (id: string, status: string) => 
      apiClient.patch(`/orders/${id}/status`, { status }),
  },

  // Dashboard
  dashboard: {
    getStats: () => apiClient.get("/dashboard/stats"),
    getRecentOrders: () => apiClient.get("/dashboard/recent-orders"),
    getRevenue: () => apiClient.get("/dashboard/revenue"),
  },

  // Customers
  customers: {
    getAll: () => apiClient.get("/customers"),
    getById: (id: string) => apiClient.get(`/customers/${id}`),
  },
};
