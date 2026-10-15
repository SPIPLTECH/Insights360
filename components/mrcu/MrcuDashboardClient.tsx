"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PARAM_LABEL, ParamKey } from "@/components/dcu/constants";
import OverviewView from "./OverviewView";
import CategoryView from "./CategoryView";

type View = "overview" | ParamKey;
type Notice = { type: "ok" | "warn" | "error"; text: string } | null;

const CATEGORIES = Object.keys(PARAM_LABEL) as ParamKey[];

const NOTICE_STYLE = {
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-800 border-amber-200",
  error: "bg-rose-50 text-rose-600 border-rose-200",
};

async function postReview(id: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/mrcu/submissions/${id}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    // raw server crash page — show it instead of "Unexpected end of JSON input"
    throw new Error(text || `Request failed with status ${res.status}.`);
  }
  if (!res.ok) throw new Error(json.error || `Request failed with status ${res.status}.`);
  return json;
}

export default function MrcuDashboardClient({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [view, setView] = useState<View>("overview");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/mrcu/submissions", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not load submissions.");
      setSubmissions(json.submissions ?? []);
    } catch (err: any) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setLoaded(true);
    }
  }, []);

  // load once, then pick up new DCU submissions every 30s
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30000);
    return () => clearInterval(t);
  }, [refresh]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleReview(id: string, decision: "accept" | "reject", note?: string) {
    setBusyId(id);
    setNotice(null);
    try {
      const json = await postReview(id, { decision, note });
      if (json.warning) {
        const why = json.submission?.sheetError ? ` (${json.submission.sheetError})` : "";
        setNotice({ type: "warn", text: `${json.warning}${why}` });
      } else {
        setNotice({ type: "ok", text: decision === "accept" ? "Accepted — Google Sheet updated." : "Rejected — Google Sheet updated." });
      }
      await refresh();
    } catch (err: any) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setBusyId(null);
    }
  }

  async function handleRetry(id: string) {
    setBusyId(id);
    setNotice(null);
    try {
      const json = await postReview(id, {}); // saved decision is reused server-side
      if (json.warning) {
        const why = json.submission?.sheetError ? ` (${json.submission.sheetError})` : "";
        setNotice({ type: "warn", text: `Sheet still not updated${why}` });
      } else {
        setNotice({ type: "ok", text: "Google Sheet updated." });
      }
      await refresh();
    } catch (err: any) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setBusyId(null);
    }
  }

  const unsynced = submissions.filter((s) => s.status !== "pending" && s.sheetSynced === false);

  async function handleRetryAll() {
    setRetrying(true);
    setNotice(null);
    let failed = 0;
    for (const s of unsynced) {
      try {
        const json = await postReview(s._id, {});
        if (json.warning) failed += 1;
      } catch {
        failed += 1;
      }
    }
    setNotice(
      failed === 0
        ? { type: "ok", text: `Google Sheet updated for ${unsynced.length} submission(s).` }
        : { type: "warn", text: `${failed} of ${unsynced.length} could not be written to the sheet. Check the Google script setup and retry.` }
    );
    await refresh();
    setRetrying(false);
  }

  const pendingIn = (c: ParamKey) => submissions.filter((s) => s.parameterType === c && s.status === "pending").length;
  const totalPending = submissions.filter((s) => s.status === "pending").length;

  const navItems: { key: View; label: string; badge: number }[] = [
    { key: "overview", label: "Overview", badge: totalPending },
    ...CATEGORIES.map((c) => ({ key: c as View, label: PARAM_LABEL[c], badge: pendingIn(c) })),
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-brand-gradient text-white px-5 py-5 md:px-10 md:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-widest font-semibold text-white/80 uppercase">MRCU Portal</p>
            <h1 className="text-xl md:text-2xl font-bold mt-0.5">Review Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:flex items-center gap-2 text-sm font-medium">
              <span className="text-xl" aria-hidden>
                🧑‍💼
              </span>
              {displayName}
            </span>
            <button onClick={refresh} className="bg-white/15 hover:bg-white/25 transition-colors text-sm rounded-xl px-3 py-2">
              Refresh
            </button>
            <button onClick={handleLogout} className="bg-white/15 hover:bg-white/25 transition-colors text-sm rounded-xl px-3 py-2">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6 flex flex-col md:flex-row gap-6">
        <nav className="md:w-64 md:shrink-0">
          <div className="card p-2 md:p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {navItems.map((n) => (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                className={`whitespace-nowrap md:whitespace-normal text-left text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                  view === n.key
                    ? "bg-brand-gradient text-white border-transparent"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{n.label}</span>
                {n.badge > 0 ? (
                  <span
                    className={`text-[11px] rounded-full px-2 py-0.5 ${
                      view === n.key ? "bg-white/25 text-white" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {n.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1 min-w-0">
          {notice ? (
            <div className={`mb-4 rounded-xl border px-4 py-3 text-sm flex items-start justify-between gap-3 ${NOTICE_STYLE[notice.type]}`}>
              <span>{notice.text}</span>
              <button onClick={() => setNotice(null)} className="font-semibold opacity-60 hover:opacity-100" aria-label="Dismiss">
                ✕
              </button>
            </div>
          ) : null}

          <div className="card p-5 md:p-7">
            {!loaded ? (
              <p className="text-sm text-slate-400 py-10 text-center">Loading submissions…</p>
            ) : view === "overview" ? (
              <OverviewView
                submissions={submissions}
                unsyncedCount={unsynced.length}
                retrying={retrying}
                onRetryAll={handleRetryAll}
                onOpen={(c) => setView(c)}
              />
            ) : (
              <CategoryView
                key={view}
                category={view}
                submissions={submissions}
                busyId={busyId}
                onReview={handleReview}
                onRetry={handleRetry}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
