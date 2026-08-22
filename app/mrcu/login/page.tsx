"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MrcuLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed.");
      if (json.role !== "mrcu") throw new Error("This login is not an MRCU account.");
      router.push("/mrcu/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="card p-8 w-full max-w-sm">
        <p className="text-xs tracking-widest font-semibold text-brand-orange uppercase">Insights360™</p>
        <h1 className="text-xl font-bold text-slate-800 mt-1">MRCU Login</h1>
        <p className="text-sm text-slate-500 mt-1">Review and approve DCU submissions across all districts.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Username</label>
            <input
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="mrcu_admin"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gradient text-white font-semibold text-sm rounded-xl py-2.5 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
