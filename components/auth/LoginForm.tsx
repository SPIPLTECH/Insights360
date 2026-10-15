"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usernameError } from "@/lib/usernamePolicy";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const bad = usernameError(username);
    if (bad) {
      setError(bad);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed.");
      // Role comes from the backend — it decides which dashboard opens.
      router.push(json.redirectTo || "/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="card p-8 w-full max-w-sm">
        <p className="text-xs tracking-widest font-semibold text-brand-orange uppercase">Race to Recognition</p>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Login</h1>
        <p className="text-sm text-slate-500 mt-1">Sign in with your username and password.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Username</label>
            <input
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              value={username}
              onChange={(e) => {
                const v = e.target.value.replace(/\s/g, "");
                // first character must be a letter — numbers / special characters are not accepted at the start
                if (v && !/^[A-Za-z]/.test(v)) return;
                setUsername(v);
              }}
              pattern="[A-Za-z].*@mkcl\.org"
              title="Must start with a letter and end with @mkcl.org"
              autoComplete="username"
              placeholder="name@mkcl.org"
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
              autoComplete="current-password"
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

        <Link href="/" className="block text-center text-xs text-slate-400 hover:text-slate-600 mt-5">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
