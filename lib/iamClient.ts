"use client";
/**
 * IAM HTTP client — identical serialisation logic to the IAM admin-ui.
 * Single-use session proofs require requests to be serialised so only
 * one is in-flight at a time, preventing proof-rotation race conditions.
 */
import axios, { InternalAxiosRequestConfig } from "axios";

const IAM_URL       = process.env.NEXT_PUBLIC_IAM_URL       || "https://iam.local:5000";
const IAM_CLIENT_ID = process.env.NEXT_PUBLIC_IAM_CLIENT_ID || "";

// ─── Session Proof helpers ────────────────────────────────────────────────────
const PROOF_KEY = "__iam_sp";

export function getProof():   string | null { try { return sessionStorage.getItem(PROOF_KEY); }  catch { return null; } }
export function setProof(v:   string): void { try { sessionStorage.setItem(PROOF_KEY, v); }      catch {} }
export function clearProof(): void          { try { sessionStorage.removeItem(PROOF_KEY); }       catch {} }

// ─── Axios instance ───────────────────────────────────────────────────────────
export const iamApi = axios.create({
  baseURL:         IAM_URL,
  withCredentials: true,
  headers:         { "x-client-id": IAM_CLIENT_ID },
});

// ─── Serialisation queue ──────────────────────────────────────────────────────
const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/orgs/invite/accept",
];

function isPublic(url?: string) {
  return !!url && PUBLIC_PATHS.some((p) => url.includes(p));
}

let running = false;
const waitQueue: Array<() => void> = [];

function releaseNext() {
  if (waitQueue.length === 0) { running = false; return; }
  running = true;
  waitQueue.shift()!();
}

function enqueue(cfg: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  if (isPublic(cfg.url)) return Promise.resolve(cfg);
  return new Promise((resolve) => {
    const go = () => {
      const proof = getProof();
      if (proof) cfg.headers["x-session-proof"] = proof;
      resolve(cfg);
    };
    if (!running) { running = true; go(); } else { waitQueue.push(go); }
  });
}

// ─── Request interceptor ──────────────────────────────────────────────────────
iamApi.interceptors.request.use((cfg) => enqueue(cfg));

// ─── Response interceptor ─────────────────────────────────────────────────────
let isRefreshing = false;
type QItem = { resolve: (v?: unknown) => void; reject: (e: unknown) => void };
let refreshQueue: QItem[] = [];

function flushRefreshQueue(err: unknown) {
  refreshQueue.forEach((q) => (err ? q.reject(err) : q.resolve()));
  refreshQueue = [];
}

iamApi.interceptors.response.use(
  (res) => {
    const next = res.headers["x-next-session-proof"];
    if (next) setProof(next);
    if (!isPublic(res.config.url)) releaseNext();
    return res;
  },
  async (error) => {
    const orig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (!isPublic(orig?.url)) releaseNext();

    if (error.response?.status === 401 && !orig?._retry && !isPublic(orig?.url)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => refreshQueue.push({ resolve, reject }))
          .then(() => iamApi(orig));
      }
      orig._retry  = true;
      isRefreshing = true;
      try {
        const refreshRes = await iamApi.post<{ message: string; sessionProof?: string }>("/auth/refresh");
        if (refreshRes.data?.sessionProof) setProof(refreshRes.data.sessionProof);
        flushRefreshQueue(null);
        return iamApi(orig);
      } catch (e) {
        flushRefreshQueue(e);
        clearProof();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("iam:session-expired"));
        }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
