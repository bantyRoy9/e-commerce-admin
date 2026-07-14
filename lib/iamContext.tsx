"use client";
import React, {
  createContext, useContext, useState,
  useCallback, useEffect, useRef, ReactNode,
} from "react";
import { iamApi, getProof, setProof, clearProof } from "./iamClient";

export interface IAMUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  org: { id: string; name: string; slug: string };
}
export type PermMap = Record<string, boolean>;

interface IAMCtx {
  user:    IAMUser | null;
  perms:   PermMap;
  loading: boolean;
  login:   (email: string, password: string, orgSlug?: string) => Promise<void>;
  logout:  () => Promise<void>;
  can:     (action: string) => boolean;
  canAny:  (...actions: string[]) => boolean;
  refresh: () => Promise<void>;
}

const Context = createContext<IAMCtx | null>(null);
const ORG_SLUG = process.env.NEXT_PUBLIC_IAM_ORG_SLUG || "demo-org";

export function IAMProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<IAMUser | null>(null);
  const [perms,   setPerms]   = useState<PermMap>({});
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadUser(isInitialLoad = false) {
    try {
      // On page reload sessionStorage is cleared, so session proof is gone.
      // Attempt a silent refresh first — the server reissues the proof in
      // the response body so we can restore it before making other requests.
      if (isInitialLoad && !getProof()) {
        try {
          const r = await iamApi.post<{ message: string; sessionProof?: string }>("/auth/refresh");
          if (r.data.sessionProof) setProof(r.data.sessionProof);
        } catch {
          // No valid refresh token → genuinely not logged in
          setUser(null); setPerms({});
          setLoading(false);
          return;
        }
      }

      const [meRes, permRes] = await Promise.all([
        iamApi.get<IAMUser>("/auth/me"),
        iamApi.get<PermMap>("/auth/permissions"),
      ]);
      setUser(meRes.data);
      setPerms(permRes.data);

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        try {
          const r = await iamApi.post<{ message: string; sessionProof?: string }>("/auth/refresh");
          if (r.data.sessionProof) setProof(r.data.sessionProof);
          await loadUser();
        } catch { setUser(null); setPerms({}); }
      }, 14 * 60 * 1000);
    } catch {
      setUser(null);
      setPerms({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser(true);
    const onExpired = () => { setUser(null); setPerms({}); };
    window.addEventListener("iam:session-expired", onExpired);
    return () => {
      window.removeEventListener("iam:session-expired", onExpired);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const login = useCallback(async (email: string, password: string, orgSlug?: string) => {
    const res = await iamApi.post<{ message: string; sessionProof?: string }>(
      "/auth/login",
      { email, password, orgSlug: orgSlug || ORG_SLUG },
    );
    if (res.data.sessionProof) setProof(res.data.sessionProof);
    await loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async () => {
    await iamApi.post("/auth/logout").catch(() => {});
    clearProof();
    setUser(null);
    setPerms({});
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const can    = useCallback((a: string) => perms[a] === true, [perms]);
  const canAny = useCallback((...actions: string[]) => actions.some((a) => perms[a] === true), [perms]);
  const refresh = useCallback(async () => { await loadUser(); }, []);

  return (
    <Context.Provider value={{ user, perms, loading, login, logout, can, canAny, refresh }}>
      {children}
    </Context.Provider>
  );
}

export function useIAM(): IAMCtx {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useIAM must be used inside <IAMProvider>");
  return ctx;
}
