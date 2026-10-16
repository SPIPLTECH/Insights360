"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import { usernameError } from "@/lib/usernamePolicy";

const fieldBase =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-orange/15";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-slate-100">
      <style>{`
        @keyframes lf-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .lf-rise { animation: lf-rise .5s ease-out both; }
      `}</style>

      <div className="lf-rise w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/60">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-brand-pink/30">
          <Lock size={22} />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">Welcome back</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="username" className="text-xs font-bold uppercase tracking-wide text-slate-500">Username</label>
            <div className="relative mt-1.5">
              <User size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="username"
                className={`${fieldBase} pr-4`}
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
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</label>
            <div className="relative mt-1.5">
              <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`${fieldBase} pr-12`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error ? (
            <div role="alert" className="lf-rise flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-pink/25 transition hover:shadow-xl hover:shadow-brand-pink/30 hover:brightness-105 active:scale-[0.99] disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-brand-orange">
          <ArrowLeft size={15} /> Back to website
        </Link>
      </div>
    </div>
  );
}