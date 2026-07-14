"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useIAM } from "@/lib/iamContext";

const DEFAULT_ORG = process.env.NEXT_PUBLIC_IAM_ORG_SLUG || "demo-org";

export default function LoginPage() {
  const { login, user, loading } = useIAM();
  const router  = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [orgSlug,  setOrgSlug]  = useState(DEFAULT_ORG);
  const [error,    setError]    = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in → go to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleLogin(e?: FormEvent) {
    e?.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password, orgSlug);
      // Redirect is now handled by useEffect when user state updates
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg === "Invalid credentials")          setError("Invalid email or password.");
      else if (msg === "Account is temporarily locked") setError("Account locked — too many failed attempts. Try again later.");
      else if (msg === "Access denied for this application") setError("Your account does not have access to this application.");
      else setError(msg || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render form if user is already logged in (redirect in progress)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-lg w-[420px]"
      >
        <h1 className="text-3xl font-bold text-center mb-2">Thela Admin</h1>
        <p className="text-gray-500 text-center mb-8">Sign in to your admin console</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@thela.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Input
          label="Organization"
          value={orgSlug}
          onChange={(e) => setOrgSlug(e.target.value)}
          placeholder="demo-org"
        />

        <Button text={submitting ? "Signing in…" : "Login"} loading={submitting} onClick={() => handleLogin()} />
      </form>
    </div>
  );
}
