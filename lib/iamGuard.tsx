"use client";
/**
 * Route guard component — wraps protected pages.
 * Redirects to /login if not authenticated.
 * Shows a loading spinner while session is being verified.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIAM } from "./iamContext";

export function IAMGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useIAM();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">Verifying session…</span>
        </div>
      </div>
    );
  }

  if (!user) return null; // redirect in progress

  return <>{children}</>;
}
